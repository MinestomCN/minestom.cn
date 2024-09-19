# 实体

## 概述

在 Minestom 中，所有实体必须直接或通过其子类扩展 `Entity`。`Entity` 类主要为开发者提供服务器端 API，对客户端影响不大。与 `ItemStack` 类似，有一个名为 `EntityMeta` 的东西，允许你改变客户端看到的内容。本文将详细讨论 `EntityMeta` 的实现。

## 实体类

实体创建从选择实体类开始。无论创建的实体类型如何，你都可以将其实例化为以下类之一：

* `Entity` 是最基础的实体版本。它为你提供了一个最小的 API（和最小的开销），包括生成数据包处理、元数据支持、默认物理。
* `LivingEntity` 扩展了 `Entity`，并允许你赋予实体生命力。实体的类型无关紧要，Minestom 不会限制你使用 Mojang 意图的类型。如果你给它生命值，它就会有生命值。这个子类还提供了一个 API 来修改实体的装备和属性。
* `EntityCreature` 扩展了 `LivingEntity`，并为你提供了导航和 AI API。

如果上述类都不符合你的要求，你可以自由地使用这些类中的任何一个作为你自己的实体类实现的祖先。在需要处理物理或覆盖已呈现方法的情况下，这可能是可行的。Minestom 仓库本身有几个例子：`Player` 扩展了 `LivingEntity` 并处理装备和其他一堆事情；`EntityProjectile` 扩展了 `Entity` 并有自己的物理和碰撞代码。

### 示例

创建和生成一个基础的马：

```java
Instance instance = ...; // 要在其中生成马的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // 实际生成马
```

创建一个具有生命力和可操作 AI 和导航的船。例如，我们可以给它添加一些目标，使其具有攻击性并攻击玩家。

```java
Instance instance = ...; // 要在其中生成船的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
EntityCreature boat = new EntityCreature(EntityType.BOAT);
// 修改 AI 使船具有攻击性
boat.setInstance(instance, spawnPosition); // 实际生成船
```

## 实体元数据

一旦你为实体选择了类并实例化它，你可以使用 `Entity#getEntityMeta()` 检索其元数据。根据实例化时指定的实体类型，将其转换为适当的类型，允许你改变实体在客户端上的显示方式。

### 示例

为第一个示例中的马设置颜色：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

使船看起来具有威胁性：

```java
BoatMeta meta = (BoatMeta) boat.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("危险的船", NamedTextColor.RED));
```

## 有用的方法

### 实体存在

在实例化后，实体不被视为活动状态，因此不会出现在任何实例中。要实际生成它，你必须调用 `Entity#setInstance(Instance, Position)`。

还有一个方便的 `Entity#setAutoViewable(boolean)`，它会自动跟踪该实体是否在实例中玩家的可见范围内，并向它们发送生成/销毁数据包。所有实体默认都是自动可见的。

要移除实体，只需调用 `Entity#remove()`。

### 切换实体类型

作为开发者，你可以切换已存在实体的实体类型。可以使用 `Entity#switchEntityType(EntityType)` 执行此操作，并将使实体之前的所有元数据失效。

如果你想知道它在内部是如何工作的，一个销毁数据包会发送给该实体的所有观察者，然后一个新的生成数据包会取代它。如果你正在改变玩家实体类型，除了玩家自己之外的所有观察者都会收到这些数据包，因此不可能在玩家自己的客户端上以不同的实体类型渲染玩家。

### 高效地批量更新元数据

在某些情况下，你可能需要一次性修改 `EntityMeta` 的多个属性。这里有一个问题，因为每次修改元数据时，都会向其所有观察者发送一个数据包。为了减少网络带宽并一次性发送所有更新，有一个 `EntityMeta#setNotifyAboutChanges(boolean)` 方法。在第一次元数据更新之前调用它并传递 `false`，然后在最后一次更新之后立即传递 `true`：所有执行的更改将一次性发送。如果你需要更多关于此主题的信息，请查看相关方法的文档：它很丰富。

例如，我们可以采用更新船元数据的代码：如果在船生成后执行它，将导致向船的每个观察者发送 3 个元数据数据包。为了避免这种情况，我们只需要添加两行简单的代码：

```java
BoatMeta meta = (BoatMeta) boat.getEntityMeta();
meta.setNotifyAboutChanges(false); // 这行
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("危险的船", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // 和这行
```