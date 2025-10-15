# 玩家 UUID

UUID 意味着必须是一个唯一标识符。默认情况下，这个标识符在连接时随机生成，因此是唯一的但不是持久的。

通常你需要的是一个即使在断开连接或服务器关闭后仍然保持不变的唯一标识符，这可以通过使用 Mojang API 获取玩家的 Mojang UUID，或者使用与你网站注册系统绑定的自定义 UUID 来实现。我们默认没有实现这些，因此你可以自由选择你喜欢的方式。

要更改玩家的 UUID：

```java
MinecraftServer.getConnectionManager().setPlayerProvider((connection, gameProfile) -> {
    // 这个方法在玩家连接时被调用，用于更改玩家的 provider
    return new Player(connection, new GameProfile(UUID.randomUUID() /* 在这里设置你的自定义 UUID 注册系统 */, gameProfile.name(), gameProfile.properties()));
});
```

## 自定义 Player 类

设置 Player Provider 允许你创建一个自定义的 `Player` 类，如果你想覆盖默认行为，这会很有用。

例如：

```java
public class CustomPlayer extends Player {
    public CustomPlayer(@NotNull PlayerConnection playerConnection, @NotNull GameProfile gameProfile) {
        super(playerConnection, gameProfile);
    }
}
```

```java
MinecraftServer.getConnectionManager().setPlayerProvider(CustomPlayer::new);
```

:::alert warning
如果你启用了 IP forwarding（Velocity/Bungee），UUID provider 是不必要的，也不会生效
:::

## 启用 Mojang 认证

如果你想在服务器启动后启用 Mojang 认证，可以使用以下代码：
启用 Mojang 认证将验证会话令牌，设置玩家的皮肤，并提供一个“可信”的 UUID。
你可以通过将 `new Auth.Online()` 传递给 `MinecraftServer#init()` 来启用它。

```java
public static void main(String[] args) {

    // new Auth.Online() 启用 mojang 认证
    MinecraftServer minecraftServer = MinecraftServer.init(new Auth.Online());

    minecraftServer.start("0.0.0.0", 25565);
}
```