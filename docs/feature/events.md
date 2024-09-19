# 事件

## 概述

事件监听是一个相当难以保持简单同时又能清晰理解执行流程的部分。在 Minestom 中，我们使用树结构来定义继承关系，以实现过滤和扩展性。树的每个节点包含：

- 事件类，只允许子类进入（如 `Event`/`PlayerEvent` 等）
- 过滤条件
- 监听器列表
- 用于识别的名称
- 优先级

![所有节点都被执行的事件树](/docs/feature/events/event-tree.gif)

树结构为我们提供了许多优势：

- 由于节点过滤而具有上下文感知的监听器
- 清晰的执行顺序
- 能够将事件树存储为图像以用于文档目的
- 将监听器注入现有节点

## API

### 节点

```java
// 可以监听任何事件，没有任何条件
EventNode<Event> node = EventNode.all("demo");
// 只能监听实体事件
EventNode<EntityEvent> entityNode = EventNode.type("entity-listener", EventFilter.ENTITY);
// 只能监听玩家事件
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
// 监听玩家事件，且玩家处于创造模式
EventNode<PlayerEvent> creativeNode = EventNode.value("creative-listener", EventFilter.PLAYER, Player::isCreative);
```

每个节点都需要一个名称以便于调试并在之后检索，一个包含事件类型目标和获取其执行者（例如从 `PlayerEvent` 中获取 `Player`）的 `EventFilter`。所有工厂方法都接受一个谓词，以提供额外的过滤条件。

### 监听器

```java
EventNode<Event> node = EventNode.all("demo");
node.addListener(EntityTickEvent.class, event -> {
    // 内联监听器
});
node.addListener(EventListener.builder(EntityTickEvent.class)
    .expireCount(50) // 在执行 50 次后停止
    .expireWhen(event -> event.getEntity().isGlowing()) // 当谓词返回 true 时停止
    .handler(entityTickEvent ->
        System.out.println("实体 tick!"))
    .build());

EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
// playerNode.addListener(EntityTickEvent.class, event -> {}); -> 不起作用，因为 playerNode 只接受玩家事件
playerNode.addListener(PlayerTickEvent.class, event -> {});
```

### 子节点

子节点继承父节点的条件，并能够附加到它。

```java
EventNode<Event> node = EventNode.all("demo");
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);

node.addChild(playerNode); // 有效，因为 PlayerEvent 也是 Event

// playerNode.addChild(node); -> 无法编译，因为父节点会比子节点更严格
```

### 事件执行

事件可以从任何地方执行，而不仅仅是从根节点。

```java
EventNode<Event> node = EventNode.all("demo");
node.call(new MyEvent());
```

## 实践应用

现在你已经熟悉了 API，以下是如何在你的 Minestom 项目中使用它。

### 使用的节点

#### 服务器 JAR

可以通过 `MinecraftServer#getGlobalEventHandler()` 获取服务器的根节点，你可以安全地插入新节点。

```java
var handler = MinecraftServer.getGlobalEventHandler();
handler.addListener(PlayerChatEvent.class,
        event -> event.getPlayer().sendMessage("你发送了一条消息!"));
var node = EventNode.all("demo");
node.addListener(PlayerMoveEvent.class,
        event -> event.getPlayer().sendMessage("你移动了!"));
handler.addChild(node);
```

### 结构

强烈建议为你的树结构创建一个图像，以便于文档目的并确保最佳的过滤路径。然后可以使用包来表示主要节点，使用类来表示次要过滤。

```java
Server/
   Global.java
   Lobby/
      Rank/
         - AdminRank.java
         - VipRank.java
      - DefaultRank.java
   Game/
      Bedwars/
         Kit/
            PvpKit.java
            BuildKit.java
         Bedwars.java
      Skywars/
         Kit/
            PvpKit.java
            BuildKit.java
         Skywars.java
```

### 自定义事件

`Event` 是一个你可以自由实现的接口，像 `CancellableEvent`（在某个点停止执行）和 `EntityEvent`（告诉调度器事件包含一个实体执行者）这样的特性也存在，以确保你的代码与现有逻辑兼容。然后你可以选择从任意节点运行你的自定义事件（参见 [示例](#event-execution)），或者从根节点使用 `EventDispatcher#call(Event)`。