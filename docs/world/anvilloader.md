---
description: >-
  本页描述了如何使用AnvilLoader加载一个世界文件夹
---

## 使用AnvilLoader加载世界

为了将一个世界加载到实例中，请使用 `InstanceContainer#setChunkLoader(ChunkLoader)` 函数。

使用此方法加载一个世界的示例如下：

```java
InstanceContainer.setChunkLoader(new AnvilLoader("worlds/world"));
```

这将把 `worlds/world` 目录内的世界加载到InstanceContainer中，允许你像以前一样使用实例，但世界已经加载在其中。

为了加载一个世界，世界文件夹只需要 `/region` 文件夹，因为它包含区块数据。

## 保存世界

为了保存一个世界，你需要使用 `InstanceContainer#saveChunksToStorage()` 函数，
这只会在你之前使用AnvilLoader将世界加载到实例中时才有效。
