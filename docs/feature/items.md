# 物品

## 概述

Minestom中的物品是**不可变的**，这意味着`ItemStack`一旦创建就无法更改。这为我们带来了许多优势：

- 线程安全，因为无法从多个线程修改同一个对象
- 避免了修改物品时会影响所有包含该物品的容器的问题
- 可以在多个地方重用`ItemStack`。例如，如果所有玩家都从同一组物品开始，你可以将它们存储为常量并添加到每个玩家物品栏中，避免大量内存分配
- 与第二点相关，这允许我们在内部缓存物品数据包（如窗口数据包）以持续提升性能

## ItemStack

```java
// 常量空气物品，应该用它代替'null'
ItemStack air = ItemStack.AIR;
// 数量为1的物品
ItemStack stone = ItemStack.of(Material.STONE);
// 自定义数量的物品
ItemStack stoneStack = ItemStack.of(Material.STONE, 64);
```

物品通过`DataComponent`进行配置，完整的组件列表可以在[Wiki](https://minecraft.wiki/w/Data_component_format)上找到。可以使用`with`添加组件，或使用`without`移除组件。

```java
ItemStack item = ItemStack.of(Material.STONE)
        .with(DataComponent.CUSTOM_NAME, Component.text("Item name!", NamedTextColor.GREEN));
```

但由于物品是不可变的，使用构建器创建复杂对象会更简单：

```java
item = ItemStack.builder(Material.STONE)
        .set(DataComponent.CUSTOM_NAME, Component.text("Item name!", NamedTextColor.GREEN))
        .set(DataComponent.LORE, List.of(Component.text("Line 1"), Component.text("Line 2")))
        .build();

// 我们还为常见组件提供了一些实用方法
item = ItemStack.builder(Material.STONE)
        .customName(Component.text("Item name!", NamedTextColor.GREEN))
        .build();
item = ItemStack.of(Material.STONE)
        .withCustomName(Component.text("Item name!", NamedTextColor.GREEN))
```

也提供了创建物品副本的方法：

```java
// 将数量设置为5
item = item.withAmount(5);
// 基于当前数量设置新数量
item = item.withAmount(amount -> amount * 2);
// 其他字段也有类似方法
item = item.with(DataComponent.CUSTOM_NAME, Component.text("New item name!"));

// 开始重建物品
// 如果需要修改多个字段，这比上面的方法更高效
item = item.with(builder -> {
        builder.amount(32)
                .set(DataComponent.CUSTOM_NAME, Component.text("Again..."));
        });
```

## 序列化

可以使用`Codec`将物品序列化为各种格式或从中反序列化：

```java
BinaryTag nbt = ItemStack.CODEC.encode(Transcoder.NBT, item).orElseThrow();
item = ItemStack.CODEC.decode(Transcoder.NBT, nbt).orElseThrow();

JsonElement json = ItemStack.CODEC.encode(Transcoder.JSON, item).orElseThrow();
item = ItemStack.CODEC.decode(Transcoder.JSON, json).orElseThrow();
```
