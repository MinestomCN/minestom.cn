```markdown
---
description: 将Minestom服务器连接到代理
---

# 代理支持

Minestom支持以下代理及其衍生版本：
- [Velocity](https://github.com/PaperMC/Velocity)
- [Gate](https://github.com/minekube/gate)
- [BungeeCord](https://github.com/SpigotMC/BungeeCord)

## 通过代理连接

通过代理连接将*替代*任何使用`MojangAuth#init`的方式。

:::tabs
== Velocity
```java
VelocityProxy.enable("secret_here")
```

```toml
# 是否将IP地址和其他数据转发到后端服务器？
# 可用选项：
# - "none":        不进行转发。所有玩家将显示为从代理连接并使用离线模式UUID
# - "legacy":      以BungeeCord兼容格式转发玩家IP和UUID。适用于1.12或更低版本的Minecraft服务器
# - "bungeeguard": 以BungeeGuard插件支持的格式转发玩家IP和UUID。适用于1.12或更低版本且无法实现网络级防火墙(共享主机)的情况
# - "modern":      使用Velocity原生转发在登录过程中转发玩家IP和UUID。仅适用于1.13或更高版本
player-info-forwarding-mode = "NONE" // [!code --]
player-info-forwarding-mode = "MODERN" // [!code ++]
```

== Gate
```java
VelocityProxy.enable("secret_here")
```

```yaml
# 自定义玩家信息(如IP和UUID)如何转发到服务器
# 详情请参阅文档
forwarding:
  # 选项: legacy, none, bungeeguard, velocity
  mode: legacy # [!code --]
  mode: velocity # [!code ++]
  # velocity模式使用的密钥
  #velocitySecret: secret_here // [!code --]
  velocitySecret: secret_here # [!code ++]
  # bungeeguard模式使用的密钥
  #bungeeGuardSecret: secret_here
```

== BungeeCord
原生BungeeCord不支持令牌验证，因此不建议使用原版。可以通过[BungeeGuard](https://github.com/lucko/BungeeGuard)实现密钥交换，**切勿**在没有BungeeGuard的情况下使用BungeeCord。以下启用BungeeCord和BungeeGuard支持：

```java
BungeeCordProxy.enable()
BungeeCordProxy.setBungeeGuardTokens(Set.of("tokens", "here"))
```

```yaml
ip_forward: false # [!code --]
ip_forward: true # [!code ++]
```
:::

## 服务器间传送

要传送玩家，需要通知代理执行此操作。可以通过[BungeeCord插件消息通道](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/)实现，或通过自定义的插件消息通道、消息队列等方式。

### 使用BungeeCord插件消息通道
所有支持的代理默认都应启用BungeeCord插件消息通道。

:::tabs
== Velocity
```toml
# 在Velocity上启用BungeeCord插件消息通道支持
bungee-plugin-message-channel = true
```

== Gate
```yaml
# 是否支持bungee插件通道
# (如果后端服务器不受信任，请禁用此项)
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
```