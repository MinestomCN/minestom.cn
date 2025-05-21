# 实体系统

## 概述

在Minestom中，所有实体都必须直接或间接继承`Entity`类。Entity类主要为开发者提供服务器端API，对客户端影响有限。与`ItemStack`类似，系统通过`EntityMeta`来改变客户端显示的实体外观。本文将详细讲解`EntityMeta`的实现。

## 实体类体系

创建实体时首先需要选择实体类。无论创建何种类型的实体，都可以选择以下类进行实例化：

* `Entity`是最基础的实体类，提供最小化API（和最小开销），包括生成包处理、元数据支持和基础物理系统
* `LivingEntity`继承自`Entity`，赋予实体生命特征。虽然Minestom不做限制，但某些实体类型若作为LivingEntity会导致客户端断开连接。该类还提供装备和属性修改API
* `EntityCreature`继承自`LivingEntity`，额外提供导航和AI系统API
* `ItemEntity`继承自`Entity`，专门用于在世界中生成物品

如果以上类都不满足需求，开发者可以自由继承这些类来实现自定义实体。Minestom源码中有多个示例：继承`LivingEntity`的`Player`类处理装备系统；继承`Entity`的`EntityProjectile`类实现自定义物理和碰撞系统。

### 示例代码

基础马匹生成：
```java
Instance instance = ...; // 生成实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // 生成马匹
```

创建可配置AI的敌对马匹：
```java
EntityCreature horse = new EntityCreature(EntityType.HORSE);
// 配置攻击性AI
horse.addAIGroup(List.of(
    new MeleeAttackGoal(horse, 4.0, Duration.ofSeconds(2)) // 近战攻击
), List.of(
    new ClosestEntityTarget(horse, 10.0, entity -> entity instanceof Player) // 目标选择
));
horse.setInstance(instance, spawnPosition);
```

生成物品实体：
```java
ItemEntity item = new ItemEntity(ItemStack.of(Material.DIAMOND_SWORD));
item.setInstance(instance, spawnPosition);
```

> 更多物品实体功能请参考[demo示例](https://github.com/Minestom/Minestom/blob/fb895cb89956e256f52f84d6abe267bd9233ca3f/demo/src/main/java/net/minestom/demo/PlayerInit.java#L75-L93)。

## 实体元数据

通过`Entity#getEntityMeta()`获取元数据后，可根据实体类型转换为特定元数据类来修改客户端显示效果。

### 示例

设置马匹外观：
```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

创建危险马匹效果：
```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("危险马匹", NamedTextColor.RED));
```

## 实用方法

### 实体管理

新创建的实体默认不活跃，需调用`Entity#setInstance(Instance, Position)`生成。`Entity#setAutoViewable(boolean)`可自动处理玩家视距内的实体生成/销毁包发送（默认开启）。调用`Entity#remove()`移除实体。

### 动态切换实体类型

通过`Entity#switchEntityType(EntityType)`可改变现有实体的类型（会重置所有元数据）。内部实现是先发送销毁包，再发送生成包。注意玩家实体切换类型时，客户端自身视角不会改变。

### 元数据批量更新

为避免频繁发送网络包，可使用`EntityMeta#setNotifyAboutChanges(boolean)`进行批量更新：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setNotifyAboutChanges(false); // 开始批量更新
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("危险马匹", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // 结束批量更新
```
