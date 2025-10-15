# 实例

## 什么是实例

实例是用于替代原版 Minecraft 中“世界”的概念，它们更轻量，并应提供类似的属性。目前有多种实例实现，包括 `InstanceContainer` 和 `SharedInstance`（两者均在下文解释）。

所有实例均可通过 InstanceManager 访问，或从实体实例获取：

```java
InstanceManager instanceManager = MinecraftServer.getInstanceManager()
// 或者
Entity#getInstance
```

在内部，默认的 Instance 类拥有自己的集合来存储其中的实体，但所有基于区块的方法都是抽象的，需要由子类实现。

## InstanceContainer

这里的“Container”表示这是一个可以存储区块的实例。与其他实例一样，它拥有自己的实体集合。

你可以通过以下方式创建 `InstanceContainer`：

```java
InstanceContainer instanceContainer = instanceManager.createInstanceContainer();
```

为了拥有有效的世界生成，你需要为该实例指定一个 `Generator`，否则无法生成任何区块。（查看[此处](https://minestom.net/docs/world/generation)了解如何创建你自己的生成器）

```java
instance.setGenerator(YOUR_GENERATOR);
```

## SharedInstance

`SharedInstance` 需要关联一个 `InstanceContainer`。这里的“Shared”表示该实例的所有区块都来自其父容器实例。

这意味着什么？如果你在实例容器中破坏或放置一个方块，共享实例也会反映该变化（同样，如果你通过共享实例的方法放置方块，变化也会反映在实例容器及其所有共享实例中）

你可以通过以下方式创建 `SharedInstance`：

```java
SharedInstance sharedInstance = instanceManager.createSharedInstance(instanceContainer);
```

## 创建你自己的实例类型

你可以创建自己的类并继承 `Instance`，并向其中添加实体。

在这种情况下，你唯一需要注意的是，所有实例都需要手动注册到实例管理器中。

```java
instanceManager.registerInstance(YOUR_CUSTOM_INSTANCE);
```

此方法**仅**在你手动实例化实例对象时需要使用，`InstanceManager#createInstanceContainer` 和 `InstanceManager#createSharedInstance` 已在内部完成注册。