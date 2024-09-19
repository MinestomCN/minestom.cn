# Batch

当操作大量方块时，使用批量处理来一次性更新所有区块会更明智。有3种类型的批量处理：`ChunkBatch`、`AbsoluteBlockBatch`、`RelativeBlockBatch`。

所有批量处理都有一套类似的方法来设置方块，但坐标系统并不完全相同。具体细节请查看各个批量处理的说明。

```java
Batch#setBlockStateId(int /* x */, int /* y */, int /* z */, short /* block id */, Data);
Batch#setCustomBlock(int /* x */, int /* y */, int /* z */, short /* custom block id */, Data);
Batch#setSeparateBlocks(int /* x */, int /* y */, int /* z */, short /* block id */, short /* custom block id */, Data);
```

应用批量处理总是可以通过 `Batch#apply(Instance, Callback)` 来完成。这将在“默认”位置（取决于批量处理）应用批量处理。有关替代应用选项，请查看每个批量处理的个别 `apply` 变体。

`BatchOption` 提供了一些与批量处理行为相关的配置。选项包括：

*   完整区块：如果设置，此批量处理修改的每个区块都将假设批量处理负责整个区块，因此任何现有的方块都将被移除。
* 计算逆向：如果设置，`apply` 方法将返回批量处理的逆向。详见下文的逆向。
* 不安全应用：如果设置，批量处理在应用时不会等待自身准备就绪。详见下文的逆向。

> 每种批量处理都适用于不同的用例，但最好尽可能使用最具体的批量处理。例如，设置一组全部位于一个区块内的方块可以使用所有3种批量处理来完成。然而，应该使用 `ChunkBatch`，因为它是3种中最高效的。

## ChunkBatch

包含完全包含在1个区块内的更改，可以应用到任何区块。

坐标以相对区块坐标给出（即0-15），而不是世界坐标。

默认的 `apply` 位置是区块 (0, 0)，但可以应用到任何区块。

```java
ChunkBatch#apply(Instance, int /* chunkX */, int /* chunkZ */, ChunkCallback);
ChunkBatch#apply(Instance, Chunk, ChunkCallback);

// 例如
// 将在区块1, 2（即方块16, 32）应用
chunkBatch.apply(instance, 1, 2, null);
```

## AbsoluteBlockBatch

表示相对于原点（0, 0, 0）的一组方块更改。所有更改都将应用于 `Batch#set*` 给出的坐标，因此坐标以世界坐标给出。

`AbsoluteBlockBatch` 没有任何特定于批量处理的 `apply` 选项。

## RelativeBlockBatch

表示一组没有指定位置的方块更改。坐标以世界坐标给出，但它们将被转换为 `apply` 给出的任何位置。

默认的 `apply` 位置是实例原点（0, 0, 0），但可以应用到任何位置

```java
RelativeBlockBatch#apply(Instance, BlockPosition, Runnable);
RelativeBlockBatch#apply(Instance, int /* x */, int /* y */, int /* z */, Runnable);
```

`AbsoluteBlockBatch` 与其他两个选项相比，在性能上有显著差异，如果可能的话，应该优先使用它们而不是 `RelativeBlockBatch`。可以使用以下方法将相对批量处理转换为 `AbsoluteBlockBatch`。如果批量处理将多次应用到同一位置，应该使用（并缓存）此方法。

```java
RelativeBlockBatch#toAbsoluteBatch();
RelativeBlockBatch#toAbsoluteBatch(int /* x */, int /* y */, int /* z */);
```

## 逆向

逆向存在是为了在应用批量操作后撤销它。如果在 `BatchOption`s 中设置了计算逆向，`apply` 将返回一个新的批量处理，其中包含应用期间执行的每个操作的相反操作。

当从 `apply` 返回逆向时，它不一定已经准备好应用。如果设置了不安全应用选项，则不会进行检查。否则，逆向的 `apply` 将阻塞当前线程，直到它准备就绪。

可以检查批量处理是否准备就绪，并等待它准备就绪，不管是否设置了不安全应用选项。

```java
// 返回是否已准备就绪
Batch#isReady()

// 阻塞直到准备就绪
Batch#awaitReady()
```

> 在 `apply` 回调中，逆向总是准备好应用的。
