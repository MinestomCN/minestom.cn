---
description: >-
  本页介绍区块管理需要了解的内容，尤其是 InstanceContainer 的区块管理
---

# 区块管理

## 加载/保存步骤

当尝试加载一个区块时，InstanceContainer 会按以下顺序进行多次检查：

1. 检查该区块是否已加载（若已加载则停止）
2. 尝试通过实例的 [ChunkLoader](https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/ChunkLoader.html) 使用 [ChunkLoader#loadChunk](<https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/ChunkLoader.html#loadInstance(net.minestom.server.instance.Instance)>) 加载区块（若加载成功则停止）
3. 创建一个新区块，并执行实例的 ChunkGenerator（如果有）以生成该区块的所有方块。

当尝试保存一个区块时，会调用 [ChunkLoader#saveChunk](<https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/ChunkLoader.html#saveChunk(net.minestom.server.instance.Chunk)>)。

### 默认行为

`AnvilLoader` 是所有 `InstanceContainer` 默认使用的区块加载器。

## 创建你自己的区块类型

[Chunk](https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/Chunk.html) 是一个抽象类，你可以通过继承它来创建自己的实现。

自定义区块实现可以让你控制方块的存储方式、区块的更新逻辑等。

### 如何让实例使用你的实现

如果你使用的是简单的 [InstanceContainer](https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/InstanceContainer.html)，只需修改实例的区块提供者：

```java
// 设置自定义区块提供者
instanceContainer.setChunkSupplier(YOUR_CHUNK_SUPPLIER);
```

该提供者将在需要区块对象时被调用。