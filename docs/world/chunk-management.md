---
description: >-
  本页描述了你需要了解的关于块管理的信息，更具体地说是关于InstanceContainer的
---

# 块管理

## 加载/保存步骤

尝试加载一个块时，实例容器会按此顺序进行多重检查：

1. 验证块是否已经加载（如果是，则停止）
2. 尝试使用实例的[IChunkLoader](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html)从[IChunkLoader#loadChunk](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html#loadChunk%28net.minestom.server.instance.Instance,int,int,net.minestom.server.utils.chunk.ChunkCallback%29)加载块（如果块加载成功，则停止）
3. 创建一个新的块，并执行实例的ChunkGenerator（如果有的话）以生成块的所有方块。

尝试保存一个块时，会调用[IChunkLoader#saveChunk](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html#saveChunk%28net.minestom.server.instance.Chunk,java.lang.Runnable%29)。

### 默认行为

`AnvilLoader`是所有`InstanceContainer`默认使用的块加载器。

## 创建你自己的块类型

[Chunk](https://minestom.github.io/Minestom/net/minestom/server/instance/Chunk.html) 是一个抽象类，你可以简单地创建一个新类来扩展它，以创建你自己的实现。

制作你自己的块实现允许你自定义你想要如何存储方块，你想要块的tick如何发生等等。

### 如何使我的实例使用我的实现

如果你正在使用一个简单的[InstanceContainer](https://minestom.github.io/Minestom/net/minestom/server/instance/InstanceContainer.html) 与默认的[IChunkLoader](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html)，你只需要更改实例的块供应商

```java
instanceContainer.setChunkSupplier(YOUR_CHUNK_SUPPLIER);
```

当需要提供块对象时，它将被调用。
