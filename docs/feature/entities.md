# 实体

## 概述

在 Minestom 中，所有实体都必须直接或通过其子类继承 `Entity`。`Entity` 类主要为开发者提供了一个服务器端 API，该 API 对客户端的影响不大。与 `ItemStack` 类似，存在一个名为 `EntityMeta` 的东西，它允许你更改客户端看到的内容。本文将详细介绍 `EntityMeta` 的实现。

## 实体类

实体的创建始于选择一个实体类。无论要创建什么类型的实体，都可以将其实例化为以下任一类别：

* `Entity` 是实体的最基本版本。它为你提供了一个最小化的 API（以及最小化的开销），包括生成数据包处理、元数据支持和默认物理特性。
* `LivingEntity` 继承自 `Entity`，并且允许你赋予实体生命特征。尽管 Minestom 并不强制你按照原版服务器的方式设置它们，但某些实体类型无法成为 `LivingEntity`，因为这会导致客户端断开连接。这个子类还提供了一个 API 来修改实体的装备和属性。
* `EntityCreature` 继承自 `LivingEntity`，并且还为你提供了导航和 AI API。
* `ItemEntity` 继承自 `Entity`，它为你提供了在世界中生成物品的能力。

如果以上类别都不符合你的需求，你可以自由地将这些类中的任何一个作为你自己的实体类实现的祖先类。在你需要处理物理特性或覆盖已有的方法时，这可能是可行的。Minestom 仓库本身就有几个例子：`Player` 继承自 `LivingEntity`，并且处理了装备和其他许多事情；`EntityProjectile` 继承自 `Entity`，并且拥有自己的物理和碰撞代码。

### 示例

创建并生成一个基础的马：

```java
Instance instance = ...; // 要生成马的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // 实际生成一匹马
```

创建一匹有生命特征并且可以操作 AI 和导航的马。例如，我们可以给它添加一些目标，使其具有攻击性并攻击玩家。

```java
Instance instance = ...; // 要生成船的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
EntityCreature horse = new EntityCreature(EntityType.HORSE);
// 修改 AI 使马具有攻击性
horse.addAIGroup(List.of(
    // 添加一个近战攻击目标，范围为 4，延迟为 2 秒
    new MeleeAttackGoal(horse, 4.0, Duration.ofSeconds(2))
), List.of(
    // 添加一个目标，针对距离最近的玩家实体，范围为 10 块
    new ClosestEntityTarget(horse, 10.0, entity -> entity instanceof Player)
));
horse.setInstance(instance, spawnPosition); // 实际生成一匹马
```

创建一个物品实体：

```java
Instance instance = ...; // 要生成物品的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
ItemEntity item = new ItemEntity(ItemStack.of(Material.DIAMOND_SWORD));
item.setInstance(instance, spawnPosition); // 实际生成一个物品
```

> 关于为物品实体添加功能的更多信息，请查看 [演示](https://github.com/Minestom/Minestom/blob/fb895cb89956e256f52f84d6abe267bd9233ca3f/demo/src/main/java/net/minestom/demo/PlayerInit.java#L75-L93 )。

## 实体元数据

一旦你为实体选择了一个类并实例化了它，你可以通过 `Entity#getEntityMeta()` 获取它的元数据。根据你在实例化时指定的实体类型，将其强制转换为适当的类型，这将允许你更改实体在客户端上的显示方式。

### 示例

为第一个示例中的马设置颜色：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

让马看起来很吓人：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
```

## 有用的方法

### 实体存在

实例化后，实体不会被计为活跃状态，因此也不会出现在你的任何实例中。要实际生成它，你必须调用 `Entity#setInstance(Instance, Position)`。

还有一个方便的 `Entity#setAutoViewable(boolean)` 方法，它会自动跟踪该实体是否在它所在的实例的玩家的可视范围内，并向他们发送生成/销毁数据包。所有实体默认都是自动可视的。

要移除实体，只需调用 `Entity#remove()`。

### 切换实体类型

作为开发者，你可以切换已存在实体的实体类型。这种操作可以通过 `Entity#switchEntityType(EntityType)` 来完成，并且会清除实体之前所有的元数据。

如果你想知道它是如何在内部工作的，一个销毁数据包会被发送给该实体的所有观众，然后一个新的生成数据包会取代它。如果你正在更改玩家的实体类型，除了他自己之外的所有观众都会收到这些数据包，因此不可能在自己的客户端上以不同的实体类型渲染玩家。

### 高效地对元数据进行批量更新

可能会出现你需要一次性修改 `EntityMeta` 的多个属性的情况。这里存在一个问题，因为每次你修改元数据时，都会向它的所有观众发送一个数据包。为了减少网络带宽并一次性发送所有更新，有一个 `EntityMeta#setNotifyAboutChanges(boolean)` 方法。在你的第一次元数据更新之前将其调用为 `false`，然后在最后一次更新之后将其调用为 `true`：所有执行的更改将一次性发送。如果你需要更多关于这个主题的信息，请查看相关方法的文档：它非常丰富。

例如，我们可以采用更新马元数据的代码：如果我们是在马生成之后执行它，那么将导致向马的每个观众发送 3 个元数据数据包。为了避免这种情况，我们只需要添加两行简单的代码：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setNotifyAboutChanges(false); // 这行
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // 和这行
```