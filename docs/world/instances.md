# 实例

## 实例是什么

实例是替代 Minecraft 原版中的“世界”的，它们是轻量级的，并且应该提供类似的属性。目前有多种实例实现方式，包括 `InstanceContainer` 和 `SharedInstance`（下面将解释两者）

所有实例都可以通过使用 InstanceManager 或者获取实体实例来访问

```java
InstanceManager instanceManager = MinecraftServer.getInstanceManager()
// 或者
Entity#getInstance
```

在内部，默认的实例类有自己的集合来存储其中的实体，但所有基于区块的方法都是抽象的，意味着需要由子类来实现

## InstanceContainer

这里的“容器”意味着这是一个可以存储区块的实例。和每个实例一样，它拥有自己的实体集合

你可以通过调用以下方法来创建一个 `InstanceContainer`：

```java
InstanceContainer instanceContainer = instanceManager.createInstanceContainer();
```

为了有一个有效的世界生成，你需要指定实例应该使用哪个 `ChunkGenerator`，没有它就无法生成区块。（查看[这里](https://minestom.net/docs/world/generation) 来创建你自己的）

```java
instance.setChunkGenerator(YOUR_GENERATOR);
```

## SharedInstance

`SharedInstance` 需要有一个 `InstanceContainer` 与其关联。“共享”意味着这是一个从其父实例容器中获取所有区块的实例

这是什么意思？这意味着如果你在实例容器中破坏或放置一个方块，共享实例也会反映这个变化（如果你使用共享实例方法放置方块，变化也会反映在实例容器及其所有共享实例中）

你可以使用以下方法创建一个 `SharedInstance`：

```java
SharedInstance sharedInstance = instanceManager.createSharedInstance(instanceContainer);
```

## 创建你自己的实例类型

你可以创建你自己的类来扩展 `Instance` 并向其中添加实体。

在这种情况下，你唯一需要注意的是，所有实例都需要在实例管理器中手动注册。

```java
instanceManager.registerInstance(YOUR_CUSTOM_INSTANCE);
```

如果你手动实例化你的实例对象，这个方法是**唯一**需要的，`InstanceManager#createInstanceContainer` 和 `InstanceManager#createSharedInstance` 已经在内部注册了实例。
