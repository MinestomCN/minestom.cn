# Adventure

Adventure 是一个用于 _Minecraft：Java 版_ 中服务器可控用户界面元素的库。有关如何使用 Adventure 的指南，请查看 [Adventure 文档](https://docs.adventure.kyori.net/ )。

## 受众群体

### 什么是受众群体？

以下内容摘自 Adventure 文档，描述了 `Audience` 的概念：

> 作为 API，`Audience` 被设计为任何玩家、命令发送者、控制台或其他可以接收文本、标题、计分板和其他 Minecraft 媒体的通用接口。这使得受众群体可以扩展到覆盖多个个体接收者——可能的“受众群体”包括团队、服务器、世界或满足某些条件（例如拥有特定权限）的所有玩家。通用接口还可以通过在不适用时优雅地降级功能来减少样板代码。

简单来说，实现 `Audience` 或其子类型的每个类都提供了对完整 Adventure API 的访问。

在 Minestom 中，以下类是受众群体：

* `CommandSender`，
* `Player`，
* `Instance`，
* `Scoreboard`，以及
* `Team`。

这意味着如果你拥有这些类中的任何一个实例，你可以使用完整的 Adventure API，例如，向受众群体的每个成员显示标题。这使得你能够更强大且直接地控制与玩家的沟通方式。

### 获取受众群体

正如前一节提到的，一些 Minestom 类直接实现了 `Audience`。这意味着如果你拥有例如一个 `Instance` 的引用，你就可以直接在该实例上使用 Adventure API。例如，以下代码用于向实例中的所有玩家发送消息：

```java
instance.sendMessage(Component.text("Hello, instance!"));
```

Minestom 还通过 `Audiences` 类提供了一种获取受众群体的方式。以下代码展示了如何在你的项目中使用这个类：

```java
Audiences.console().sendMessage(Component.text("Hello, console!"));
Audiences.players().sendMessage(Component.text("Hello, players!"));
Audiences.server().sendMessage(Component.text("Hello, console and players!"));
```

`Audiences` 类还提供了一个 `players(Predicate)` 函数，允许你收集符合特定谓词的玩家受众群体。例如，这可以用于在广播前检查权限。此外，如果你想将每个受众群体作为可迭代对象访问，你可以使用 `IterableAudienceProvider`，可以通过 `Audiences#iterable()` 获得其实例。

#### 自定义受众群体

`Audiences` 类还提供了通过 `Key` 添加自定义受众群体成员的能力。这可以用于添加文件日志的受众群体或代表一组玩家的 `ForwardingAudience`。受众群体可以通过 `AudienceRegistry` 注册，其实例可以通过 `Audiences#registry()` 获得。例如，如果你想在插件之间共享一组工作人员以发送警报，可以使用以下代码：

```java
// 创建自定义受众群体
Audiences.registry().register(Key.key("myplugin:staff"), staffMembers);

// 后续，任何人都可以通过键访问受众群体
Audiences.custom(Key.key("myplugin:staff")).sendMessage(Component.text("Hello, staff!"));
```

你还可以创建自己的 `Audience`，使用 Adventure 方法 `Audience.audience(Iterable)` 或 Minestom 的 `PacketGroupingAudience.of()` 方法创建基于可迭代对象的受众群体。这意味着你可以注册一个基于你持续更新的集合的自定义受众群体，并且当任何人使用自定义方法时，更改将被反映出来。

```java
// 创建自定义受众群体
Audiences.registry().register(Key.key("myplugin:staff"), PacketGroupingAudience.of(staffMembers));

// 在任何时候，你都可以通过更改集合来更新受众群体
staffMembers.add(newStaffMember);
```

`all()` 和 `of(Predicate)` 方法将使用流收集每个自定义受众群体，并将其与服务器受众群体合并。这种操作相对成本较高，因此应尽可能避免。

### 数据包分组

Minestom 还提供了一个名为 `PacketGroupingAudience` 的新 `ForwardingAudience` 实现。Minestom 中每个拥有多个玩家的受众群体都实现了这个类。与正常迭代受众群体成员的 `ForwardingAudience` 实现不同，这个实现使用 `PacketUtils#sendGroupedPacket(Collection, ServerPacket)` 尝试向该受众群体中的所有玩家发送分组数据包。

要创建自己的 `PacketGroupingAudience`，你可以使用该类中的静态 `of(Collection)` 和 `of(Iterable)` 方法，当提供一组玩家时，这些方法将返回一个 `PacketGroupingAudience` 实例。

### 可视化

此外，`Viewable` 类包含两个方法，用于将可视对象的查看者作为受众群体获取。这意味着你可以在可视对象的查看者上使用完整的 Adventure API。例如，在旧 API 中，要向可以查看玩家的每个人发送消息，你会这样做：

```java
for (Player player : viewable.getViewers()) {
    player.sendMessage(someMessage);
}
```

使用 Adventure API，你可以简单地这样做：

```java
viewable.getViewersAsAudience().sendMessage(someMessage);
```

使用 `Viewable` 类提供的受众群体的额外好处是，它实现了 `PacketGroupingAudience`，这意味着在可能的情况下，传出的数据包会被分组，与循环发送消息的方法相比，减少了网络开销。

## 颜色

基础类是 `Color` 类，这是一个用于表示 RGB 颜色的通用类，类似于 `java.awt.Color`。由于这个类实现了 Adventure 的 `RGBLike` 接口，因此可以在 Adventure API 中任何需要着色的地方使用（例如组件文本）。这个类的一个新添加是 `mixWith` 方法，它将这种颜色与其他一系列 `RGBLike` 颜色混合，使用与原版 Minecraft 混合染料和颜色相同的方法创建新颜色。

在 `Color` 的基础上，`AlphaColor` 表示一个 RGBA 颜色（带有 alpha 通道）。这个类也实现了 `RGBALike`，用于文本组件中的 `ShadowColor`。

还有一个额外的颜色类：`DyeColor`。这个枚举代表 Minecraft 中染料的不同颜色，并为每种不同的原版染料类型提供值。这个类包含一个方法，用于获取染料的 RGB 颜色和等效的烟花颜色。与 `Color` 类一样，这个类也实现了 `RGBLike`，因此也可以在整个 Adventure API 中使用。

## 翻译

Minestom 中的 Adventure 更新添加了 `MinestomAdventure` 类，这是一种强大且功能丰富的控制组件翻译流程的方式。Adventure 提供了 `GlobalTranslator` 的概念。通过提供源和一组键值对，你可以在服务器端进行翻译，而无需任何额外的代码或复杂的本地化库。

要启用自动组件翻译，你需要将常量 `MinestomAdventure#AUTOMATIC_COMPONENT_TRANSLATION` 设置为 `true`。设置后，发送给玩家的任何组件都将根据他们的语言环境自动进行翻译。

## 资源包

Adventure 在受众群体上暴露了用于推送、弹出和清除资源包的方法。

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(myUuid, myUrl, myHash))
        .prompt(Component.text("Please accept the resource pack"))
        .required(true)
        .build();
audience.sendResourcePacks(request);

audience.removeResourcePacks(myUuid);

audience.clearResourcePacks();
```

在通过 Adventure 应用资源包时，也可以监听资源包状态：

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(myUuid, myUrl, myHash))
        .callback((uuid, status, theAudience) -> {
            theAudience.sendMessage(Component.text("Resource pack " + uuid + " status: " + status));
        })
        .build();
```
