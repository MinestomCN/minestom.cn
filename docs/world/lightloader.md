---
description: >-
  本页描述如何为Minestom实例添加光照
---

## 设置区块供应商

要使用 `LightingChunk` 类，可以调用 `InstanceContainer#setChunkSupplier(LightingChunk::new)` 方法。
默认情况下，当区块发送给客户端时，光照将会生成。

使用此方法的示例：
```java
InstanceContainer.setChunkSupplier(LightingChunk::new);
```
## 预计算光照

要在玩家加入之前预加载区块并计算光照，可以使用以下代码：

```java
var chunks = new ArrayList<CompletableFuture<Chunk>>();
ChunkUtils.forChunksInRange(0, 0, 32, (x, z) -> chunks.add(instanceContainer.loadChunk(x, z)));

CompletableFuture.runAsync(() -> {
    CompletableFuture.allOf(chunks.toArray(CompletableFuture[]::new)).join();
    System.out.println("load end");
    LightingChunk.relight(instanceContainer, instanceContainer.getChunks());
    System.out.println("light end");
});
```