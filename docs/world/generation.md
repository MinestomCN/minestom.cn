# 生成

## 基础

每个 `Instance` 都有一个可选的 `Generator`，负责生成各种大小的区域。

区域大小被抽象为一个 `GenerationUnit`，表示多个区块的集合，生成器然后可以使用相对和绝对坐标放置方块（和生物群系）。动态大小的区域使 API 更加灵活，并允许实例选择是立即生成完整的区块还是逐区块生成，而无需更改生成器。

生成任务目前被转发到通用的 JDK 线程池。一旦 Project Loom 集成到主线中，将使用虚拟线程。

## 你的第一个平坦世界

以下是生成从 y=0 到 y=40 的平坦世界的简单方法

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    final Point start = unit.absoluteStart();
    final Point size = unit.size();
    for (int x = 0; x < size.blockX(); x++) {
        for (int z = 0; z < size.blockZ(); z++) {
            for (int y = 0; y < Math.min(40 - start.blockY(), size.blockY()); y++) {
                unit.modifier().setBlock(start.add(x, y, z), Block.STONE);
            }
        }
    }
});
```

`GenerationUnit#absoluteStart` 返回单元的最低坐标，这对于绝对放置很有用。现在，我们可以通过使用我们手动优化的方法来大大简化代码：

```java
Instance instance = ...;
instance.setGenerator(unit ->
    unit.modifier().fillHeight(0, 40, Block.STONE));
```

## 跨单元边界修改

在 `GenerationUnit` 边界之外的修改不能在不采取额外步骤的情况下完成。`GenerationUnit` 在生成过程中不能调整大小，相反，我们需要创建一个新的 `GenerationUnit`，它包围了我们目标方块周围的区域。我们可以通过 `GenerationUnit#fork` 方法来实现这一点。

分叉的单元设计为在可能的情况下放置到实例中。这消除了可能出现的任何区块边界问题。

有两种分叉方法，各有各的用途。以下是一个简单的添加结构（雪人）的示例：

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    Random random = ...;
    Point start = unit.absoluteStart();

    // 为雪人创建雪地毯
    unit.modifier().fillHeight(-64, -60, Block.SNOW);

    // 如果单元不是底部单元，或者在其他情况下有 5/6 的概率退出
    if (start.y() > -64 || random.nextInt(6) != 0) {
        return;
    }

    // 让我们分叉这个部分来添加我们的高雪人。
    // 我们在这个分叉中增加了两个额外的区块空间来适应雪人。
    GenerationUnit fork = unit.fork(start, start.add(16, 32, 16));

    // 现在我们添加雪人到分叉中
    fork.modifier().fill(start, start.add(3, 19, 3), Block.POWDER_SNOW);
    fork.modifier().setBlock(start.add(1, 19, 1), Block.JACK_O_LANTERN);
});
```

使用分叉添加结构很简单。
然而，对于这个 `GenerationUnit#fork` 方法，你必须事先知道这些结构的大小。为了缓解这个条件，有一个替代的 `GenerationUnit#fork` 方法，它提供了一个直接的 `Block.Setter`。这个 `Block.Setter` 会根据你设置的方块自动调整分叉的大小。

以下是使用 `Block.Setter` 工具编写的相同示例：

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    Random random = ...;
    Point start = unit.absoluteStart();

    // 为雪人创建雪地毯
    unit.modifier().fillHeight(-64, -60, Block.SNOW);

    // 如果单元不是底部单元或者有 5/6 的概率退出
    if (start.y() > -64 || random.nextInt(6) != 0) {
        return;
    }

    // 添加雪人
    unit.fork(setter -> {
        for (int x = 0; x < 3; x++) {
            for (int y = 0; y < 19; y++) {
                for (int z = 0; z < 3; z++) {
                    setter.setBlock(start.add(x, y, z), Block.POWDER_SNOW);
                }
            }
        }
        setter.setBlock(start.add(1, 19, 1), Block.JACK_O_LANTERN);
    });
});
```

这些示例将生成一个平坦的雪世界，雪人散布其中，干净地在可能的情况下应用雪人。

![](/docs/world/generation/snowmen-terrain.png)

为了清晰起见，缺少地形的示例：

![](/docs/world/generation/snowmen.png)

## 使用 JNoise 的高度图

这个示例展示了使用 JNoise 构建高度图的简单方法，这也可以扩展到其他噪声实现。

```java
// 用于高度的噪声
JNoise noise = JNoise.newBuilder()
        .fastSimplex()
        .setFrequency(0.005) // 低频率用于平滑地形
        .build();

// 设置生成器
instance.setGenerator(unit -> {
    Point start = unit.absoluteStart();
    for (int x = 0; x < unit.size().x(); x++) {
        for (int z = 0; z < unit.size().z(); z++) {
            Point bottom = start.add(x, 0, z);

            synchronized (noise) { // 同步对于 JNoise 是必要的
                double height = noise.getNoise(bottom.x(), bottom.z()) * 16;
                // * 16 意味着高度将在 -16 和 +16 之间
                unit.modifier().fill(bottom, bottom.add(1, 0, 1).withY(height), Block.STONE);
            }
        }
    }
});
```

以下是它的样子：

![](/docs/world/generation/jnoise.png)