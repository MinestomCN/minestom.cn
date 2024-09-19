# 玩家能力

Minestom 提供了多种玩家交互方法。其中许多方法如下所述，但此列表并不详尽。

在阅读本部分之前，建议先查看 [Adventure API](adventure)，因为这些系统严重依赖 `Component`。

## 侧边栏（记分板）

`Sidebar` 可用于在玩家的记分板上显示最多 16 行内容。它们通过标题创建如下：

```java
Sidebar#<init>(Component /* 标题 */);
```

> 侧边栏标题不支持 JSON 聊天组件，但提供的组件将使用 Adventure 的旧版序列化器进行序列化。

创建后，记分板可以按如下方式添加和从玩家中移除：

```java
Sidebar#addViewer(Player);
Sidebar#removeViewer(Player);
```

### 侧边栏行

侧边栏上的行由 `ScoreboardLine` 组成。它们按行号（分数）顺序在记分板上渲染，其中垂直最高的行代表最高的行号（分数）。如果两行具有相同的行号（分数），它们将按字母顺序排序。

`ScoreboardLine` 可以使用其构造函数创建：

```java
Sidebar.ScoreboardLine#<init>(String /* 唯一ID */, Component /* 内容 */, int /* 行号 */);

// 例如
Sidebar.ScoreboardLine line = new Sidebar.ScoreboardLine(
        "some_line_0",
        Component.text("Hello, Sidebar!", NamedTextColor.RED),
        0
);
```

创建后，记分板行可以按如下方式添加到 `Sidebar` 中：

```java
Sidebar#createLine(Sidebar.ScoreboardLine);
```

行按其唯一ID索引，并可以使用它进行修改：

```java
Sidebar#getLine(String /* 唯一ID */);
Sidebar#updateLineContent(String /* 唯一ID */, Component /* 新内容 */);
Sidebar#updateLineScore(String /* 唯一ID */, Int /* 新分数 */);
```

## 通知

`Notification` 是一种系统，用于以通知的形式向玩家发送进展完成提示。

它们是 `Advancement` 的包装器，因此您不需要创建任何进展即可使用它们，只需一个 `Notification`。有关进展的更多信息，请参阅 [进展](advancements) 页面。

```java
Notification#<init>(Component /* 标题 */, FrameType, ItemStack /* 图标 */);

// 例如
Notification notification = new Notification(
        Component.text("Hello, Notifications!", NamedTextColor.GREEN),
        FrameType.GOAL,
        ItemStack.of(Material.GOLD_INGOT)
);
```

要发送通知，请使用 `NotificationCenter` 上的静态方法之一：

```java
NotificationCenter.send(Notification, Player);
NotificationCenter.send(Notification, Collection<Player>);
```

示例如下所示：

![](/docs/feature/player-capabilities/notification.png)