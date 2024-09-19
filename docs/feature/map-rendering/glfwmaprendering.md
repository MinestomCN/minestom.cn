# GLFW 地图渲染

_**本文要求熟悉**_ [_**地图渲染**_](/docs/feature/map-rendering)

_访问 GLFW 支持的帧缓冲区需要使用 LWJGL，以及 Minestom 的 LWJGL 相关代码。更多信息，请参阅_ [_Minestom LWJGL 示例_](https://github.com/Minestom/LWJGL-Example)

_GLFW 支持的帧缓冲区需要访问由 GLFW 支持的 API：OpenGL、OpenGL ES、Vulkan 或 EGL。基于软件的驱动程序 **应该** 开箱即用，但不保证。_

_这些帧缓冲区可能需要从 RGB 转换为 MapColors，但提供了加速此过程的选项，请参阅本文末尾（颜色映射）。_

GLFW（及其 LWJGL 绑定）提供了一个窗口，程序可以在其上渲染。通过使窗口不可见，可以渲染到离屏缓冲区，抓取其内容并将其作为地图发送。

这意味着你可以使用 OpenGL 在地图上渲染！![部分纹理的 3D 方块在 4x4 墙地图上。](https://cdn.discordapp.com/attachments/706186241288306798/742862333046554624/2020-08-11_23.47.49.png)

## 设置

首先创建一个 `GLFWFramebuffer` 或 `LargeGLFWFramebuffer`。

```java
LargeGLFWFramebuffer framebuffer = new LargeGLFWFramebuffer(512, 512); // 设置一个 512x512 的帧缓冲区
```

你必须注意，这会创建一个新的 GLFW 上下文和一个新的窗口。可以通过 `GLFWFramebuffer` 和 `LargeGLFWFramebuffer` 中的重载构造函数更改使用的 API。它默认使用 OpenGL，并通过原生 API（OSMesa 是 LWJGL 的一个选项）创建。

### 即时渲染

_如果你计划很少更新地图，应该使用这种渲染方式。_

首先调用 `GLFWCapableBuffer#changeRenderingThreadToCurrent()` 将渲染上下文绑定到当前线程。然后调用 `GLFWCapableBuffer#render(Runnable)` 来渲染你的内容。这将调用 `Runnable` 参数，交换不可见窗口缓冲区，提取帧缓冲区像素并转换为地图颜色。如果你不使用 `Framebuffer#preparePacket`，可以通过 `Framebuffer#toMapColors()` 获取地图颜色。强烈建议使用 `render` 以确保 Minestom 抓取帧缓冲区的内容并将像素转换为地图颜色。

### 连续渲染

如果你想要连续渲染，建议使用 `setupRenderLoop(long period, TimeUnit unit, Runnable renderCode)`。

- `period` 是一个长整数，表示两次渲染调用之间的周期。以 `unit` 为单位表示。
- `unit` 周期所表示的单位
- `renderCode` 你的渲染代码。

这将通过 SchedulerManager 设置一个重复任务，每隔 `period` 自动渲染内容。它还会在第一次渲染之前绑定到正确的线程。

## 颜色映射

地图不使用 RGB，而是使用颜色调色板中的索引。默认情况下，Minestom 会在每次渲染后在 CPU 上将帧缓冲区中的 RGB 像素转换为地图颜色。虽然这有效并能给出可观的结果，但这种转换不是并行进行的，分辨率越高，所需时间越长。

尽管 Graphics2D 帧缓冲区无法加速此过程，但 GLFW 支持的缓冲区提供了一种快速转换的方法。有两种方法可以进行这种转换。

### 手动转换

调用 `GLFWCapableBuffer#useMapColors()` 将告诉帧缓冲区你不是直接使用 RGB 渲染，而是使用地图颜色。在这种情况下，地图颜色在此帧缓冲区的 RED 通道中编码。当从帧缓冲区抓取像素进行处理时，Minestom 只会查询红色通道，并将红色强度解释为颜色调色板中的索引。如果你想手动使用此模式，你可以通过简单地将索引除以 `255f` 来将颜色索引转换为颜色强度。

### 自动/后处理转换

_需要使用理解 OpenGL 调用的 OpenGL 或 OpenGL-ES_

_你可能需要现代 OpenGL 代码才能使其工作，但无论如何在 $currentYear 你应该使用现代 OpenGL 代码。_

适应现有代码或在地图颜色中思考对于复杂/大/大规模项目来说并不特别方便。因此，Minestom 提供了一个后处理着色器，可以自动将 RGB 转换为地图颜色。进入 `MapColorRenderer`。

设置示例代码：

```java
LargeGLFWFramebuffer glfwFramebuffer = new LargeGLFWFramebuffer(512, 512);
glfwFramebuffer.changeRenderingThreadToCurrent(); // 创建 OpenGL 资源时需要
// 初始化你的渲染（顺序与 MapColorRenderer 无关）
MapColorRenderer renderer = new MapColorRenderer(glfwFramebuffer, YOUR_RENDER_RUNNABLE);
glfwFramebuffer.unbindContextFromThread();

glfwFramebuffer.setupRenderLoop(15, TimeUnit.MILLISECOND, renderer); // 通过将你的渲染代码替换为 renderer，转换将自动进行。
```

如你所见，这只需要多一行代码来初始化地图颜色自动转换，并修改一行代码来使用它。

要使其工作所需的文件（所有文件都在类路径中，开发时在 src/_something_/resources 中）。所有文件已经在 Minestom LWJGL 代码中：

- `/shaders/mapcolorconvert.vertex.glsl` 一个简单的顶点着色器，用于渲染全屏四边形
- `/shaders/mapcolorconvert.fragment.glsl` 负责将 RGB 转换为地图颜色的片段着色器
- `/textures/palette.png` 地图使用的颜色调色板。可以通过 `net.minestom.server.map.PaletteGenerator` 自动生成，输出到 `src/lwjgl/resources/textures/palette.png`。

此渲染器通过在 OpenGL 帧缓冲区中渲染你的内容来获得更多对帧缓冲区格式的控制（默认情况下，RGBA 颜色纹理，深度 24 位，模板 8 位渲染缓冲区），然后使用 `mapcolorconvert` 着色器渲染全屏四边形（纹理单元 0 包含你的颜色结果，纹理单元 1 包含调色板）。