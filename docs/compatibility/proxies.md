---
description: 将Minestom服务器连接到代理
---

# 代理

Minestom支持以下代理及其衍生版本：
- [Velocity](https://github.com/PaperMC/Velocity )
- [Gate](https://github.com/minekube/gate )
- [BungeeCord](https://github.com/SpigotMC/BungeeCord )

## 通过代理连接

通过代理连接会*替换* `MinecraftServer.init()` 中的auth参数。

:::tabs
== Velocity
```java
new Auth.Velocity("secret_here")

// 示例
MinecraftServer server = MinecraftServer.init(new Auth.Velocity("secret_here"));
```

```toml
# 是否将IP地址和其他数据转发到后端服务器？
# 可用选项：
# - "none":        不转发任何内容。所有玩家看起来都是从代理连接，
#                  并使用离线模式的UUID。
# - "legacy":      以BungeeCord兼容格式转发玩家IP和UUID。适用于
#                  Minecraft 1.12或更低版本。
# - "bungeeguard": 以BungeeGuard插件支持的格式转发玩家IP和UUID。适用于
#                  Minecraft 1.12或更低版本，且无法实现网络层防火墙（共享主机）。
# - "modern":      在登录过程中使用Velocity原生转发方式转发玩家IP和UUID。仅适用于
#                  Minecraft 1.13或更高版本。
player-info-forwarding-mode = "NONE" // [!code --]
player-info-forwarding-mode = "MODERN" // [!code ++]
```

== Gate
```java
new Auth.Velocity("secret_here")

// 示例
MinecraftServer server = MinecraftServer.init(new Auth.Velocity("secret_here"));
```

```yaml
# 允许自定义如何向服务器转发玩家信息（如IP和UUID）。
# 更多信息请参见文档。
forwarding:
  # 选项：legacy, none, bungeeguard, velocity
  mode: legacy # [!code --]
  mode: velocity # [!code ++]
  # 如果模式为velocity，使用的密钥。
  #velocitySecret: secret_here // [!code --]
  velocitySecret: secret_here # [!code ++]
  # 如果模式为bungeeguard，使用的密钥。
  #bungeeGuardSecret: secret_here
```

== BungeeCord
原版BungeeCord不支持令牌，因此不建议使用原版。可通过[BungeeGuard](https://github.com/lucko/BungeeGuard )实现密钥交换，**绝对不要**在没有BungeeGuard的情况下使用BungeeCord。以下配置启用BungeeCord和BungeeGuard支持：

```java
new Auth.Bungee(Set.of("secret", "here"))

// 示例
MinecraftServer server = MinecraftServer.init(new Auth.Bungee(Set.of("secret", "here")));
```

```yaml
ip_forward: false # [!code --]
ip_forward: true # [!code ++]
```
:::

## 在服务器间转移玩家

要转移玩家，需要通知代理执行。可通过 [BungeeCord插件消息通道](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/ ) 或自定义插件消息通道/消息队列实现。

### 使用BungeeCord插件消息通道
所有支持的代理默认启用BungeeCord插件消息通道。

:::tabs
== Velocity
```toml
# 在Velocity上启用BungeeCord插件消息通道支持。
bungee-plugin-message-channel = true
```

== Gate
```yaml
# 是否启用bungee插件通道支持。
# （如果后端服务器不可信，请禁用。）
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