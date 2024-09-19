# 地图渲染

## 介绍

Minecraft 地图通常保存一个 128x128 的图像，代表某个区域的上空视图。这是通过在地图数据中保存一个 128x128 的图像并进行渲染来实现的。

问题是...服务器决定了内容，并且没有要求显示上空视图。这意味着地图可以作为任意的 128x128 纹理，然后可以用于自定义方块、图形等。

## 写入地图数据 - 低级 API

Minestom 不会为你保存地图数据，但会为你发送数据。在最基本的层面上，地图帧缓冲区（服务器在其上绘制的 128x128 像素区域）保存了预定义颜色调色板中的颜色索引，而不是 RGB。

一旦你选择了一个地图 ID 进行写入（有关更多信息，请参阅 [MapMeta](https://github.com/Minestom/Minestom/blob/master/src/main/java/net/minestom/server/item/metadata/MapMeta.java)），你可以通过 `MapDataPacket` 写入其内容：

```java
MapDataPacket mapData = new MapDataPacket();
mapData.mapId = YOUR_MAP_ID;
mapData.data = YOUR_PIXELS;
mapData.x = X_START;
mapData.z = Z_START;
mapData.rows = ROW_COUNT;
mapData.columns = COLUMN_COUNT;
```

- `mapId` 是一个 `int`，用于引用要更改的地图。
- `data` 是一个 `byte[]` 数组，保存颜色调色板中的索引。其大小应至少为 `rows*columns`。
- `x` 是一个无符号字节（存储在 `short` 中），表示要写入的最左侧像素的 X 坐标。范围从 0 到 127（含）。
- `y` 是一个无符号字节（存储在 `short` 中），表示要写入的最顶部像素的 Y 坐标。范围从 0 到 127（含）。
- `rows` 是一个无符号字节（存储在 `short` 中），表示要更新的行数。
- `columns` 是一个无符号字节（存储在 `short` 中），表示要更新的列数。

像素以行优先配置存储（即索引由 `x+width*y` 定义）。尝试写入 128x128 区域之外的像素将导致崩溃和/或断开客户端连接，因此请小心。Minestom 不会检查你要写入的区域。

然后你可以通过 `PlayerConnection#sendPacket(ServerPacket)` 将数据包发送给玩家。

## 帧缓冲区 - 高级 API

虽然直接写入像素缓冲区对于简单图形来说既快速又简单，但逐个像素地写入很快就会变得繁琐。为此，Minestom 提供了帧缓冲区：一个用于在地图上渲染的高级 API。

帧缓冲区分成两类：`Framebuffer` 和 `LargeFramebuffer`。区别在于 `Framebuffer` 旨在渲染到单个地图（因此分辨率限制为 128x128），而 `LargeFramebuffer` 可以渲染到任何帧缓冲区大小，通过在多个地图上进行渲染。大型帧缓冲区提供了一种创建 `Framebuffer` 视图的方法，以帮助在地图上进行渲染。

一旦你在帧缓冲区上完成渲染，你可以要求它为你准备 `MapDataPacket`。

```java
MapDataPacket mapData = new MapDataPacket();
mapData.mapId = YOUR_MAP_ID;
Framebuffer fb = //...
// 一些渲染代码
fb.preparePacket(packet);
```

Minestom 提供了三种默认的帧缓冲区：Direct、Graphics2D 和 GLFW-Capable。

### `DirectFramebuffer` / `LargeDirectFramebuffer`

直接帧缓冲区非常接近直接写入 `MapDataPacket` 中的像素缓冲区。它们持有一个内部 `byte[]`，表示地图上的颜色，可以通过 `get` 和 `set` 分别访问和修改。整个内部缓冲区也可以通过 `getColors()` 暴露出来（你可以从返回的值中修改它）。

示例用法：

```java
DirectFramebuffer fb = new DirectFramebuffer();
byte[] colors = fb.getColors();
for (int i = 0; i < colors.length; i++) {
    colors[i] = MapColors.COLOR_CYAN.baseColor();
}
fb.set(0,0, MapColors.DIRT.baseColor());
```

### `Graphics2DFramebuffer` / `LargeGraphics2DFramebuffer`

_这些帧缓冲区需要从 RGB 转换为 MapColors。这是由 Minestom 自动完成的，但在分辨率增加时会严重影响渲染性能。_

顾名思义，这些帧缓冲区允许使用 Java 标准库中包含的 AWT 库的 Graphics2D API。通过 `getRenderer()` 访问 `Graphics2D` 对象并在其上渲染你的内容。

示例用法：

```java
Graphics2D renderer = framebuffer.getRenderer();
renderer.setColor(Color.BLACK);
renderer.clearRect(0, 0, 128, 128);
renderer.setColor(Color.WHITE);
renderer.drawString("Hello from", 0, 10);
renderer.drawString("Graphics2D!", 0, 20);
```

Graphics2D 帧缓冲区还支持在必要时单独获取/设置像素。

### GLFW-Capable 缓冲区

[这是一篇单独的文章。](./map-rendering/glfwmaprendering)