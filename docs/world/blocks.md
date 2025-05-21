# 区块

## 概览

一个 `Block` 是一个 **不可变** 对象，包含以下内容：

- 命名空间 & 协议 ID
- `Map<String, String>` 包含属性（例如 waterlogged）
- 状态 ID，这是定义区块视觉的数字 ID，用于区块数据包和其他一些地方
- 可选的 NBT
- 一个 `BlockHandler`

不可变性允许区块引用被缓存和重用。

## 使用

```java
Instance instance = ...;
// 每个原版区块都有一个常量，可以从 `Block` 接口看到
instance.setBlock(0, 40, 0, Block.STONE);

// 获取 TNT 区块，并创建一个新区块，将 `unstable` 属性设置为 "true"。
// 属性名称由 Mojang 定义，并可在各种命令中使用
Block tnt = Block.TNT.withProperty("unstable", "true");
instance.setBlock(0, 41, 0, tnt);
```

## 注册表

每个区块都有独特的数据，可以通过 `Block#registry()` 检索。

```java
Block block = Block.GRASS;
// 一些字段有它们自己的专用方法
boolean solid = block.registry().isSolid();
// ... 然而你也可以通过字符串来检索它们
double hardness = block.registry().getDouble("hardness");
hardness = block.registry().hardness();
```

## 标签

`Block` 实现了 `TagReadable` 意味着它们可以包含各种类型的数据。（参见 [标签](../feature/tags)）

```java
Tag<String> tag = Tag.String("my-key");
Block tnt = Block.TNT;
// 创建一个新区块，将标签设置为 "my-value"
tnt = tnt.withTag(tag, "my-value");
// 从新创建的区块中检索值
String value = tnt.getTag(tag);

// 区块还可以提供它们 NBT 的便捷视图
NBTCompound nbt = tnt.nbt();
```

标签数据可以被序列化，并且会自动保存到磁盘上。

:::alert  warning
标签 `id`, `x`, `y`, `z` 和 `keepPacked` 由 Anvil 加载器使用，添加到区块时可能会导致意外的行为。
:::

## 处理器

`BlockHandler` 接口允许区块通过监听一些事件（如放置或交互）来具有行为。并且可以通过它们的命名空间序列化到磁盘。

```java
public class DemoHandler implements BlockHandler {
    @Override
    public void onPlace(@NotNull Placement placement) {
        if (placement instanceof PlayerPlacement) {
            // 一个玩家放置了区块
        }
        Block block = placement.getBlock();
        System.out.println("区块 " + block.name() + " 已被放置");
    }

    @Override
    public @NotNull NamespaceID getNamespaceId() {
        // 序列化目的所需的命名空间
        return NamespaceID.from("minestom:demo");
    }
}
```

然后你可以选择为每个区块使用一个处理器，或者与多个区块共享。

```java
Block tnt = Block.TNT;
// 创建一个新区块，并指定处理器。
// 请注意，区块对象可以被重用，处理器因此
// 永远不应该假设被分配给单个区块。
tnt = tnt.withHandler(new DemoHandler());

// 与多个区块共享相同的处理器引用
BlockHandler handler = new DemoHandler();
Block stone = Block.STONE.withHandler(handler);
Block grass = Block.GRASS.withHandler(handler);
```
