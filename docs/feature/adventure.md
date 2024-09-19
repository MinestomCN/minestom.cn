# 冒险

冒险是一个用于在 Minecraft 中实现服务器可控用户界面元素的库。有关如何使用冒险的指南，请查看 [冒险文档](https://docs.adventure.kyori.net/)。

## 受众

### 什么是受众？

以下内容摘自冒险文档，描述了 `Audience` 的概念：

> 作为一个 API，`Audience` 旨在为任何可以接收文本、标题、Boss 栏和其他 Minecraft 媒体的玩家、命令发送者、控制台或其他实体提供一个通用接口。这使得扩展受众以覆盖多个个体接收者成为可能——可能的“受众”可以包括一个团队、服务器、世界或满足某些条件的所有玩家（例如拥有特定权限）。通用接口还允许通过优雅降级功能来减少样板代码。

简而言之，每个实现 `Audience` 或其子类型的类都可以访问完整的冒险 API。

在 Minestom 中，以下类是受众：

* `CommandSender`,
* `Player`,
* `Instance`,
* `Scoreboard`, 和
* `Team`.

这意味着如果你有一个这些类的实例，你可以使用完整的冒险 API 来向受众的所有成员显示标题等。这使得你可以更强大和直接地控制与玩家的通信方式。

### 获取受众

如前一节所述，一些 Minestom 类直接实现了 `Audience`。这意味着如果你有一个 `Instance` 的引用，你可以直接在该实例上使用冒险 API。例如，以下代码将向实例中的所有玩家发送一条消息：

```java
instance.sendMessage(Component.text("Hello, instance!"));
```

Minestom 还提供了一种通过 `Audiences` 类获取受众的方式。以下代码展示了如何在项目中使用此类：

```java
Audiences.console().sendMessage(Component.text("Hello, console!"));
Audiences.players().sendMessage(Component.text("Hello, players!"));
Audiences.server().sendMessage(Component.text("Hello, console and players!"));
```

`Audiences` 类还提供了一个 `players(Predicate)` 函数，允许你收集与特定谓词匹配的玩家受众。例如，这可以用于在发送广播之前检查权限。此外，如果你想将每个受众作为可迭代对象访问，你可以使用 `IterableAudienceProvider`，其实例可以通过 `Audiences#iterable()` 获取。

#### 自定义受众

`Audiences` 类还提供了通过 `Key` 添加自定义受众成员的能力。这可以用于添加文件日志记录的受众或表示自定义玩家集合的 `ForwardingAudience`。受众可以通过 `AudienceRegistry` 注册，其实例可以通过 `Audiences#registry()` 获取。例如，如果你想在插件之间共享一个向工作人员发送警报的集合，可以使用以下代码：

```java
// 创建自定义受众
Audiences.registry().register(Key.key("myplugin:staff"), staffMembers);

// 之后，任何人都可以使用该键访问受众
Audiences.custom(Key.key("myplugin:staff")).sendMessage(Component.text("Hello, staff!"));
```

你还可以创建自己的 `Audience`，使用冒险方法 `Audience.audience(Iterable)` 或 Minestom 的 `PacketGroupingAudience.of()` 方法基于可迭代对象创建受众。这意味着你可以注册一个由你继续更新的集合支持的自定义受众，当任何人使用自定义方法时，更改将得到反映。

```java
// 创建自定义受众
Audiences.registry().register(Key.key("myplugin:staff"), PacketGroupingAudience.of(staffMembers));

// 在任何时候，你都可以通过更改集合来更新受众
staffMembers.add(newStaffMember);
```

`all()` 和 `of(Predicate)` 方法将使用流收集每个自定义受众，并将这些受众与服务器受众组合。这种操作相对昂贵，因此应尽可能避免。

### 数据包分组

Minestom 还提供了一种新的 `ForwardingAudience` 实现，称为 `PacketGroupingAudience`。这是由 Minestom 中所有包含多个玩家的受众实现的。与通常的 `ForwardingAudience` 实现不同，后者遍历受众成员，此实现使用 `PacketUtils#sendGroupedPacket(Collection, ServerPacket)` 尝试向此受众中的所有玩家发送分组数据包。

要创建你自己的 `PacketGroupingAudience`，你可以使用类中的静态 `of(Collection)` 和 `of(Iterable)` 方法，当提供一组玩家时，这些方法返回 `PacketGroupingAudience` 的实例。

### 可查看对象

此外，`Viewable` 类包含两个方法，用于将可查看对象的查看者作为受众获取。这意味着你可以对可查看对象的查看者使用完整的冒险 API。例如，在旧 API 中，你可以这样做：

```java
for (Player player : viewable.getViewers()) {
    player.sendMessage(someMessage);
}
```

使用冒险 API，你可以简单地这样做：

```java
viewable.getViewersAsAudience().sendMessage(someMessage);
```

使用 `Viewable` 类提供的受众的额外好处是它实现了 `PacketGroupingAudience`，这意味着传出数据包尽可能分组，与循环发送消息的方法相比，减少了网络开销。

## 颜色

随着 Minestom `ChatColor` 类的弃用，一个新的 `color` 包被创建，以替换 `ChatColor` 类的所有现有用法。这些新类准确地表示了 Minecraft 如何存储某些对象的颜色，并允许进行适当的验证，防止开发者在编译时将样式应用于可着色对象。

基类是 `Color` 类，它是一个通用类，用于表示 RGB 颜色，类似于 `java.awt.Color`。由于该类实现了冒险的 `RGBLike` 接口，因此可以在冒险 API 中需要着色的任何地方使用它（例如组件文本）。该类的一个新增加是 `mixWith` 方法，该方法使用与 Minecraft 混合染料和颜色的相同方法，将此颜色与其他 `RGBLike` 颜色混合，创建一种新颜色。

还有一个额外的颜色类；`DyeColor`。此枚举表示 Minecraft 中不同染料的颜色，并为每种不同的原版染料类型提供值。该类包含一个方法，用于获取染料的 RGB 颜色和等效的烟花颜色。与 `Color` 类一样，该类也实现了 `RGBLike`，因此也可以在整个冒险 API 中使用。

## 翻译

Minestom 中的冒险更新添加了 `SerializationManager` 类，这是一种强大且功能丰富的控制组件翻译流程的方式。冒险提供了 `GlobalTranslator` 的概念。通过提供源，一组键值对，你可以在没有任何额外代码或复杂本地化库的情况下执行服务器端翻译。

要启用自动组件翻译，你需要将常量 `SerializationManager#AUTOMATIC_COMPONENT_TRANSLATION` 设置为 `true`。设置此项后，发送给玩家的任何组件将使用其语言环境自动翻译。

此外，`SerializationManager` 提供了访问序列化器的方法，用于将所有组件转换为 JSON 字符串。默认情况下，序列化器是一个 `Function<Component, String>`，它使用冒险的 `GsonComponentSerializer` 将组件序列化为 JSON 字符串，使用 GSON 库。但是，你可以修改此序列化器或完全更改它。

例如，如果你想在每次序列化组件时将单词“dog”替换为“cat”，你可以使用以下代码：

```java
// 获取管理器和当前序列化器
SerializationManager manager = MinecraftServer.getSerializationManager();
Function<Component, String> oldSerializer = manager.getSerializer();

// 创建文本替换配置并将其转换为函数
TextReplacementConfig config = TextReplacementConfig.builder()
        .matchLiteral("dog")
        .replacement("cat")
        .build();
Function<Component, Component> dogRemover = component -> component.replaceText(config);

// 使用 dog remover 修改旧序列化器
manager.setSerializer(component.andThen(oldSerializer));
```

## 迁移到冒险

Minestom 中的冒险更新替换并弃用了 Minestom 中存在的许多旧功能。本维基的这一部分将解释如何迁移你的代码以使用新的冒险 API。

### Boss 栏

`net.minestom.server.bossbar` 包已被完全弃用。要创建 Boss 栏，你应该使用冒险 `BossBar` 类中的静态构建器方法。例如，在旧 API 中，你可能会这样做：

```java
BossBar bar = new BossBar(text, BarColor.RED, BarDivision.SOLID);
bar.setProgress(0.6f);
bar.setFlag(0x1);
bar.addViewer(player);
```

使用冒险 API，你可以这样做：

```java
BossBar bar = BossBar.bossBar(text, 0.6f, Color.PINK, Division.PROGRESS);
bar.addFlag(Flag.DARKEN_SCREEN);
player.showBossBar(bar);
```

与之前一样，对 Boss 栏所做的任何更改将自动传播给所有已添加到 Boss 栏的成员。

### 书籍

在旧 API 中，你使用 `Player#openBook(WrittenBookMeta)` 向玩家显示 `WrittenBookMeta`。这已被替换为 `Player#openBook(Book)`。`Book` 组件可以使用构建器方法构建，如 [文档](https://docs.adventure.kyori.net/book.html) 中所述。

### 声音

为了防止名称冲突并更准确地表示枚举的内容，生成的 `Sound` 枚举已重命名为 `SoundEvent`。这是因为枚举的值不代表特定的声音，而是代表与一个或多个特定声音相关联的事件。有关声音事件的更多信息，请参阅 Minecraft Wiki 上的 [声音事件](https://minecraft.fandom.com/wiki/Sounds.json#Sound_events) 页面。

Minestom 的 `SoundCategory` 已被弃用，取而代之的是冒险的 `Sound.Source` 枚举。要播放声音，你需要构造一个 `Sound` 对象。这可以使用 [文档](https://docs.adventure.kyori.net/sound.html) 中描述的方法完成。此外，你可以将 `SoundEvent` 传递到冒险声音 API 中接受 `Sound.Type` 供应商的任何地方，而不是使用冒险的 `Key`。声音对象也可以存储并多次使用。

例如，在旧 API 中，你将使用以下代码：

```java
player.playSound(SoundEvent.MUSIC_DISC_11, SoundCategory.RECORDS, 1f, 1f);
```

使用冒险 API，你将使用以下代码：

```java
player.playSound(Sound.sound(SoundEvent.MUSIC_DISC_11, Source.RECORD, 1f, 1f));
```

此外，你现在可以通过构造一个 `SoundStop` 对象并使用 `Player#stopSound` 将其传递给玩家来停止特定声音。此 `StopSound` 对象可用于停止所有声音，使用 `SoundStop#all()`，以及特定声音，使用 `SoundStop#named(SoundEvent)` 或 `SoundStop#named(Key)`，或在特定源中的特定声音，使用前面方法并添加一个 `Sound.Source` 参数。

### 文本

旧聊天 API 和冒险之间最大的区别是，在冒险中，聊天组件是**不可变的**。这意味着在组件上使用的任何方法都不会更改组件，而是返回一个新组件。这在冒险文档中有更详细的解释。

`net.minestom.server.chat` 包已被完全弃用。要构造消息，你应该使用 `Component` 类及其构建器方法，如冒险文档中所述。然而，`JsonMessage` 实现了冒险接口 `ComponentLike`。这意味着你可以在 Minestom 中的冒险 API 中使用 `JsonMessage` 及其所有子类型。你还可以使用 `JsonMessage#fromComponent(Component)` 将冒险组件转换为 `JsonMessage`，从而允许你将新的冒险组件与旧的 Minestom 聊天 API 一起使用。

旧聊天 API 和冒险之间的另一个区别是，你不能在字符串中使用颜色来创建消息。在旧 API 中，你可以这样做 `ChatColor.RED + "some text"`。这在冒险中是不可能的，因为它不能正确表示 Minecraft 中存储文本的方式。相反，你可以使用 `Component` 类中的方法设置组件的样式，例如 `Component.text(String, TextColor)`，或使用 `Style` 方法设置样式。

冒险还将旧 API 的 `ChatColor` 类拆分为 `TextColor` 和 `TextDecoration` 类。`TextDecoration` 也可以被否定，这意味着你可以在嵌套组件中移除样式，而不会影响可能跟随此组件的其他组件。旧的 `ChatColor` 类已被弃用，并在 Minestom 代码库中被新的 `Color` 和 `DyeColor` 类替换。这两个类都实现了 `RgbLike`，可以用于为冒险组件着色。

可以使用 `.hoverEvent()` 和 `.clickEvent` 将悬停和点击事件添加到任何 `Component` 中。你可以直接将 `ItemStack` 放入悬停事件的参数中，而不是使用 `ChatHoverEvent.showItem(ItemStack)`。例如，在旧聊天 API 中，你将这样做：

```java
RichMessage message = RichMessage.of(ColoredText.of("Some Text", ChatColor.RED));
message.setHoverEvent(HoverEvent.showItem(item));
```

然而，使用冒险 API，你可以简单地这样做：

```java
Component message = Component.text("Some Text", NamedTextColor.RED).hoverEvent(item);
```

### 标题

用于向玩家发送标题的方法已被弃用，并替换为冒险方法。多个不同的消息已被替换为两个冒险方法 `#sendTitle(Title)` 和 `#showActionBar(Component)`。

标题可以使用冒险 [文档](https://docs.adventure.kyori.net/title.html) 中记录的方法构建。

例如，在旧 API 中，你将这样做：

```java
player.sendTitleSubtitleMessage(title, subtitle);
player.sendTitleTile(100, 150, 25);
```

然而，使用冒险 API，你将这样做：

```java
player.showTitle(Title.title(title, subtitles, Times.of(100, 150, 25)));
```