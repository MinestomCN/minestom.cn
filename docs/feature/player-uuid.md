# 玩家 UUID

正如 UUID 所暗示的，它必须是一个唯一的标识符。默认情况下，这个标识符在连接时随机生成，因此是唯一的但不是持久的。

你通常想要的是一个即使在断开连接或服务器关闭后仍然保持不变的唯一标识符，这可以通过使用玩家的 Mojang UUID 通过他们的 API 获取，或者将你的自定义 UUID 链接到你网站上的注册系统来实现，我们默认不实现这一点，因此你可以自由选择你喜欢的方案。

以下是如何注册你自己的 UUID 提供者：

```java
connectionManager.setUuidProvider((playerConnection, username) -> {
   // 这个方法将在玩家连接时被调用以设置他们的 UUID
   return UUID.randomUUID(); /* 在这里设置你的自定义 UUID 注册系统 */
});
```

:::alert warning
如果你启用了 IP 转发（Velocity/Bungee），UUID 提供者是不必要的，并且不会工作
:::

## 启用Mojang认证

如果你想在服务器启动后启用Mojang认证，可以使用以下代码：
启用Mojang认证将验证会话令牌，设置玩家的皮肤，并提供一个“可信”的UUID。
你可以通过`MojangAuth#init`来启用这个功能。

```java
public static void main(String[] args) {
    
    MinecraftServer minecraftServer = MinecraftServer.init();

    // 启用Mojang认证
    MojangAuth.init();
    
    minecraftServer.start("0.0.0.0", 25565);
}
```
