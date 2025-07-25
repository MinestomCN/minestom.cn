---
description: 在一个地方响应所有类型的服务器列表ping。
---

# 服务器列表ping

Minestom 支持在同一位置自定义对五种不同服务器列表ping类型的响应。简单来说，要监听所有类型的服务器列表ping事件，只需监听`ServerListPingEvent`并修改事件中的`Status`无论ping的来源是什么，响应数据都会以对应来源所需的正确格式返回。

## Ping类型

不同的ping类型可以在 `ServerListPingType` 枚举中找到。可以通过 `ServerListPingEvent` 使用 `getPingType()` 方法获取类型。这允许你根据传入的ping更改响应，从而只填充所需的信息或根据ping类型自定义响应。

使用 `ServerListPingEvent` 响应的不同ping类型可以分为三个不同的类别。

### 现代

由 `MODERN_FULL_RGB` 和 `MODERN_NAMED_COLORS` 常量覆盖，这个类别代表了最常见的响应类型，用于Minecraft 1.7及以上版本。这包括名称、协议、版本、描述、图标、在线玩家数量、最大在线玩家数量和在线玩家样本。

描述支持颜色和样式，以及一些更复杂的组件类型。Minecraft 1.16及以上版本可以使用完整的RGB颜色代码。对于较旧的版本，颜色会自动降采样为命名颜色。

玩家示例表示为UUID到名称的映射列表，这些映射不必是服务器上真实存在的玩家。`NamedAndIdentified`接口用于保存这种映射，并允许玩家和自定义映射在`Status`类中互换使用。关于如何使用此接口的示例，参见下方代码块。

```java
// 你可以直接添加玩家
byte[] favicon; // 一段原始PNG数据的byte数组；可以从文件加载
int onlinePlayers = MinecraftServer.getConnectionManager().getOnlinePlayerCount();

event.setStatus(Status.builder()
        .description(Component.text("Welcome to my Minecraft server!", NamedTextColor.GOLD))
        .favicon(favicon)
        .playerInfo(Status.PlayerInfo.builder()
                .onlinePlayers(onlinePlayers)
                .maxPlayers(500)
                .sample(somePlayer)
                .sample(NamedAndIdentified.named("Notch"))
        .sample(NamedAndIdentified.named(Component.text("Herobrine", NamedTextColor.AQUA)))
        .build())
        .playerInfo(onlinePlayers, 500) // simpler alternative to set player count only
        .versionInfo(new Status.VersionInfo("1.8.9", 47)) // set some fake version info
        .build());
```

不带UUID的方法将使用随机UUID，允许你创建任意数量的玩家而不会使用冲突的UUID。此外，每个条目可以使用组件或字符串。使用组件允许你为每个条目使用颜色和样式。在原版Minecraft客户端中显示的玩家列表支持旧版§颜色编码，每个条目的名称会自动转换为此格式。

在现代分类中，通过将`playerInfo`设为`null`，可以完全隐藏玩家示例以及在线和最大玩家数。在vanilla客户端中，在线/最大玩家数会被替换为`???`


### 旧版

由 `LEGACY_VERSIONED` 和 `LEGACY_UNVERSIONED` 常量覆盖，这个类别代表了由1.6及以下版本客户端发送的服务器列表ping。这些ping类型仅支持描述和当前/最大玩家数量。`LEGACY_VERSIONED` 类型还支持服务器版本。

描述使用旧版§颜色编码格式化，并自动转换为此格式。

### 局域网开放

由 `OPEN_TO_LAN` 常量覆盖，这个类别代表了当服务器模拟单人世界并开放到局域网时，从服务器发送的服务器列表ping。这种类型仅支持描述。与旧版类型一样，描述使用旧版§颜色编码格式化，并自动转换为此格式。

有关开放服务器到局域网的更多信息，请参阅 [局域网开放](../open-to-lan) 页面。

## Ping

在接收到服务器列表ping响应后，现代客户端发送一个额外的数据包，旨在计算延迟。Minestom 提供了 `ClientPingServerEvent` 来处理这个。

可以取消该事件，在这种情况下不会发送响应数据包。然而，各种延迟方法会影响明显的延迟：

```java
event.setDelay(new UpdateOption(5, TimeUnit.SECOND));
event.addDelay(new UpdateOption(200, TimeUnit.MILLISECOND));

// 当然，客户端和服务器之间仍然有一些延迟
event.noDelay();
```

最后，就像 `ServerListPingEvent` 一样，底层 `PlayerConnection` 是可访问的。