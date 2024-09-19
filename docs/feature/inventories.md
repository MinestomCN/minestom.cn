# 库存

Minestom 有一个改进的库存系统！这包括准确的点击行为（除了像合成这样的情况），改进的库存事件 API，以及其他一些变化。

## 使用

为了创建一个库存，你可以简单地通过指定 InventoryType 和标题来调用其构造函数。

```java
// 创建库存
ContainerInventory inventory = new ContainerInventory(InventoryType.CHEST_1_ROW, Component.text("标题"));

// 为玩家打开库存
// （为多个玩家打开相同的库存将导致共享界面）
player.openInventory(inventory);

// 关闭当前玩家库存
player.closeInventory();
```

添加回调就像向 EventNode 注册监听器一样简单

```java
EventNode.type("click", EventFilter.INVENTORY, (event, inv) -> inventory == inv)
.addListener(InventoryClickEvent.class, event -> {
	event.getPlayer().sendMessage("点击了!");
})
```

## 最近的变化

- 库存类已被重命名。`AbstractInventory` 现在是 `Inventory`，而原来的 `Inventory` 现在是 `ContainerInventory`。这使得层次结构更加清晰。明确地说，`ContainerInventory` 代表所有命名的库存（例如：箱子库存、铁砧库存、合成库存）。

- 带有 `#getClickedItem()`、`#getClickType()`、`#getSlot()` 等的点击事件已被 `Click.Info` 类型取代。这是一个接口，允许一堆子类，包括 `Left`、`Right`、`RightShift` 等，每个子类都存储相关的槽位。在监听事件时，你可以简单地检查点击类型：
  `if (event.getClickInfo() instanceof Click.Info.Left left) { /* 逻辑 */ }`

- 库存点击事件已被重构为以下结构：

  - InventoryPreClickEvent
    - 允许通过 `event.getClickInfo()` 修改点击的原始信息（例如：点击的槽位、点击类型、使用的按钮等）。
    - 这发生在点击处理之前。
  - InventoryClickEvent
    - 允许通过 `event.getChanges()` 修改点击导致的槽位变化和副作用，而不仅仅是点击信息。
    - 这发生在点击处理之前。
  - InventoryPostClickEvent
    - 允许查看点击信息和结果，但不能修改它们。
    - 这发生在点击处理之后。

- 当玩家点击他们自己的库存时，每个事件中的 `event.getInventory()` 现在是玩家的库存。以前，它是 `null`。

- `InventorySwapItemEvent` 现在被视为点击，因此你可以监听点击事件，其中 `event.getClickInfo() instanceof OffhandSwap`。

- `InventoryCloseEvent` 不再有 `#setNewInventory(Inventory)`。相反，在需要时使用 `event.getPlayer().openInventory` 或 `event.setCancelled(true)`。

- `PlayerInventoryItemChangeEvent` 现在在 `InventoryItemChangeEvent` 下。如果你只想要 `PlayerInventory` 实例，请过滤事件。

- `InventoryClickEvent` 已被重命名为 `InventoryPostClickEvent`
- `InventoryCondition` 已被转换为事件。

  ```Java
  // 旧
  inventory.addInventoryCondition((player, slot, clickType, inventoryConditionResult) -> {
  	player.sendMessage("点击了!");
  });

  // 新
  EventNode.type("click", EventFilter.INVENTORY, (event, inv) -> inventory == inv)
  .addListener(InventoryClickEvent.class, event -> {
  	event.getPlayer().sendMessage("点击了!");
  })
  ```

## Click.Info

`Click.Info` 中的点击槽位以一种不直观的方式存储。槽位 ID 既代表点击的库存槽位，也代表玩家库存槽位。要从槽位 ID 获取物品，你可以使用以下代码：

```Java
Inventory inventory = event.getInventory();
if (slot < inventory.getSize()) {
    return inventory.getItemStack(slot);
} else {
    int converted = PlayerInventoryUtils.protocolToMinestom(slot, inventory.getSize());
    return event.getPlayerInventory().getItemStack(converted);
}
```

如果你有更好的处理方法，请告诉 [@GoldenStack](https://github.com/GoldenStack)。