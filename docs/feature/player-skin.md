# 玩家皮肤

定义玩家皮肤有三种方式：

- 将玩家UUID（参见[这里](player-uuid)）设置为他们的Mojang UUID，客户端默认根据此值获取皮肤。这是由`MojangAuth.init()`自动完成的。
- 在`PlayerSkinInitEvent`事件中更改皮肤
- 使用`Player#setSkin(PlayerSkin)`方法

## 如何从Mojang获取皮肤数据

### 使用PlayerSkin方法

`PlayerSkin`提供了一些实用方法，可以通过简单的信息（如Mojang UUID或Minecraft用户名）获取皮肤。

```java
PlayerSkin skinFromUUID = PlayerSkin.fromUuid(MOJANG_UUID_AS_STRING);

PlayerSkin skinFromUsername = PlayerSkin.fromUsername("Notch");
```

::: warning
这些方法直接向Mojang API发出请求，建议缓存这些值。
:::

### 手动获取纹理值和签名

我所说的大部分内容在这里有描述：[https://wiki.vg/Mojang_API#Username\_-.3E_UUID_at_time](https://wiki.vg/Mojang_API#Username_-.3E_UUID_at_time)

首先，你需要获取你的Mojang UUID，这可以通过基于用户名的请求来完成：

```
 GET https://api.mojang.com/users/profiles/minecraft/<username>
```

然后，获取UUID后：

```
 GET https://sessionserver.mojang.com/session/minecraft/profile/<uuid>?unsigned=false
```

你将在这里获得纹理值和签名。这些值用于创建一个`PlayerSkin`。

### PlayerSkinInitEvent

该事件在玩家连接时被调用，用于首次定义发送给玩家的皮肤。非常简单：

```java
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(PlayerSkinInitEvent.class, event -> {
   PlayerSkin skin = new PlayerSkin(textureValue, signature);
   event.setSkin(skin);
});
```

### Player#setSkin

```java
PlayerSkin skin = new PlayerSkin(textureValue, signature);
player.setSkin(skin);
```