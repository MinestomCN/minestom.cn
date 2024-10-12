---
description: 连接 Minestom 服务器到代理
---

# 代理支持
Minestom 支持连接到 [Velocity](https://papermc.io/software/velocity)、[Gate](https://gate.minekube.com/) 和 [Bungee](https://github.com/SpigotMC/BungeeCord) 代理，尽管推荐使用 Velocity 或 Gate，因为它们支持 [现代转发](https://docs.papermc.io/velocity/security#velocity-modern-forwarding)。

## 连接到代理
### Velocity 或 Gate
要使用 Velocity 或 Gate（或任何其他现代转发代理），你可以在 `MinecraftServer#init` 和 `MinecraftServer#start` 之间添加以下代码：
```java
VelocityProxy.enable("我非常机密的秘密，不是硬编码的")
```

### Bungee
Bungee 可以以类似 Velocity 的方式使用。由于其年代久远，它默认不使用现代转发，因此默认情况下是不安全的。可以通过 [BungeeGuard](https://www.spigotmc.org/resources/bungeeguard.79601/) 实现类似的机制，你应该 **绝不** 在没有它的情况下使用 Bungee。以下代码块启用了 Bungee 和 BungeeGuard：
```java
BungeeCordProxy.enable()
BungeeCordProxy.setBungeeGuardTokens(Set.of("tokens", "here"))
```

## 服务器间传输
要传输玩家，你需要向 BungeeCord 频道发送一个 [插件消息](https://docs.papermc.io/paper/dev/plugin-messaging#what-did-we-just-do)。以下是如何实现这一点（或任何其他插件消息）的方法。
```java
String connectTo = "你想要连接到的服务器"
player.sendPluginMessage("BungeeCord", NetworkBuffer.makeArray(buffer -> {
  buffer.write(NetworkBuffer.STRING, "Connect");
  buffer.write(NetworkBuffer.STRING, connectTo);
}));
```
