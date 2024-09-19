# 物品

## 概述

Minestom 中的物品是**不可变的**，这意味着 `ItemStack` 一旦构建就不能更改。这为我们提供了许多好处：

- 线程安全，因为你不能从多个线程更改同一个对象。
- 没有副作用，即对物品的更改不会修改所有包含相同对象的库存。
- 能够在多个地方重用 `ItemStack`。例如，如果你的所有玩家都从同一组物品开始，你可以将这些物品存储为常量，并将它们添加到每个玩家的库存中，以避免大量分配。
- 与第二点相关，它允许我们内部缓存物品数据包（例如：窗口数据包）以保持性能提升。

## API

::: warning
在 Minestom 的早期版本中，存在诸如 `displayName` 等方法，因为它们是物品元数据的一部分。在 1.20.5 中，Mojang 切换到了组件系统，现在需要我们使用 ItemComponent 和值。
:::

```java
// 常量空气物品，应使用而不是 'null
ItemStack air = ItemStack.AIR;
// 数量设置为 1 的物品
ItemStack stone = ItemStack.of(Material.STONE);
// 自定义数量的物品
ItemStack stoneStack = ItemStack.of(Material.STONE, 64);
```

然而，由于物品是不可变的，创建复杂对象需要使用构建器：

```java
ItemStack item = ItemStack.builder(Material.STONE)
        .set(ItemComponent.ITEM_NAME, Component.text("物品名称!", NamedTextColor.GREEN))
        .set(ItemComponent.LORE, Arrays.asList(Component.text("第一行"), Component.text("第二行")))
        .build();
```

还存在创建物品副本的方法：

```java
// 将数量设置为 5
item = item.withAmount(5);
// 基于当前数量设置数量
item = item.withAmount(amount -> amount * 2);
// 其他字段同理
item = item.with(ItemComponent.ITEM_NAME, Component.text("新物品名称!"));

// 开始重建物品
// 如果你需要修改多个字段，这比上面的方法更高效
item = item.with(builder -> {
        builder.amount(32)
                .set(ItemComponent.ITEM_NAME, Component.text("再次..."));
        });
```