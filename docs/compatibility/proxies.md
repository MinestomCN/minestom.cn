---
description: 将 Minestom 服务器连接到代理
---
# 代理服务器

Minestom 支持以下代理服务器及其衍生版本：
- [Velocity](https://github.com/PaperMC/Velocity)
- [Gate](https://github.com/minekube/gate)
- [BungeeCord](https://github.com/SpigotMC/BungeeCord)




## 通过代理连接

通过代理连接会取代对MojangAuth#init的任何使用。

:::tabs
== Velocity
```java
VelocityProxy.enable("secret_here")
```

```toml
# 是否将IP地址和其他数据转发到后端服务器？
# 可用选项：
# - "none":        不进行任何转发。所有玩家看起来都是从代理连接的，并且将拥有离线模式的UUID。
# - "legacy":      以兼容BungeeCord的格式转发玩家IP和UUID。如果你运行的是Minecraft 1.12或更低版本的服务器，请使用此选项。
# - "bungeeguard": 以BungeeGuard插件支持的格式转发玩家IP和UUID。如果你运行的是Minecraft 1.12或更低版本的服务器，并且无法实现网络级别防火墙（例如在共享主机上），请使用此选项。
# - "modern":      使用Velocity的原生转发功能，在登录过程中转发玩家IP和UUID。仅适用于Minecraft 1.13或更高版本。
player-info-forwarding-mode = "NONE" // [!code --]
player-info-forwarding-mode = "MODERN" // [!code ++]
```

== Gate
```java
VelocityProxy.enable("secret_here")
```

```yaml
# 这允许你自定义玩家信息（如IP和UUID）如何被转发到你的服务器。
# 查看文档以获取更多信息。
forwarding:
  # 选项：legacy, none, bungeeguard, velocity
  mode: legacy // [!code --]
  mode: velocity // [!code ++]
  # 如果模式是velocity，则使用的密钥。
  #velocitySecret: secret_here // [!code --]
  velocitySecret: secret_here // [!code ++]
  # 如果模式是bungeeguard，则使用的密钥。
  #bungeeGuardSecret: secret_here
```
== BungeeCord
原版BungeeCord不支持令牌，因此不建议使用原版。可以使用[BungeeGuard](https://github.com/lucko/BungeeGuard)来实现密钥交换，**绝对不要**在没有它的情况下使用BungeeCord。以下内容启用BungeeCord和BungeeGuard的支持：

```java
BungeeCordProxy.enable()
BungeeCordProxy.setBungeeGuardTokens(Set.of("tokens", "here"))
```

```yaml
ip_forward: false // [!code --]
ip_forward: true // [!code ++]
```
:::
## 在服务器之间转移

要转移玩家，你需要通知代理去做这件事。你可以通过[BungeeCord插件消息通道](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/)来实现，或者通过你自己的方式，比如使用你自己的插件消息通道或消息队列。

### 使用BungeeCord插件消息通道
所有支持的代理默认应该已经启用了BungeeCord插件消息通道。

:::tabs
== Velocity

```toml
# 在Velocity上启用BungeeCord插件消息通道支持。
bungee-plugin-message-channel = true
```

== Gate
```yaml
# 代理是否应该支持Bungee插件通道。
# （如果后端服务器不可信，请禁用此选项。）
bungeePluginChannelEnabled: true
```
:::

```java
final String server = "lobby"
player.sendPluginMessage("bungeecord:main", NetworkBuffer.makeArray(buffer -> {
    buffer.write(NetworkBuffer.STRING_IO_UTF8, "Connect");
    buffer.write(NetworkBuffer.STRING_IO_UTF8, server);
}));
```