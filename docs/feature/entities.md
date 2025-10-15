# 实体

## 概述

在Minestom中，所有实体必须直接或间接扩展`Entity`类。Entity类主要为开发者提供服务器端API，对客户端影响较小。与`ItemStack`类似，存在一个名为`EntityMeta`的机制，允许你改变客户端看到的内容。本文将详细介绍`EntityMeta`的实现。

## 实体类

实体创建始于选择实体类。无论创建何种类型的实体，你都可以实例化为以下任意类：

- `Entity`是实体的最基础版本。它提供最小化的API（及最小开销），包括生成包处理、元数据支持、默认物理。
- `LivingEntity`扩展`Entity`，并允许你赋予实体生命。尽管Minestom不限制你使用原版服务器设定，某些实体类型无法成为Living Entities，否则会导致客户端断开连接。此子类还提供API修改实体装备与属性。
- `EntityCreature`扩展`LivingEntity`，并提供导航与AI API。
- `ItemEntity`扩展`Entity`，允许你在世界中生成物品。

若以上均不符合需求，你可自由使用这些类作为自定义实体类的祖先。这在需要处理物理或覆盖已有方法时可能可行。Minestom仓库本身有几个示例：`Player`扩展`LivingEntity`并处理装备及其他事项；`EntityProjectile`扩展`Entity`并拥有独立物理与碰撞代码。

### 示例

最简生成并生成马：

```java
Instance instance = ...; // 要生成马的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // 实际生成马
```

创建具有生命且可操纵AI与导航的马。例如，我们可为其添加目标使其具有攻击性并攻击玩家。

```java
Instance instance = ...; // 要生成船的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
EntityCreature horse = new EntityCreature(EntityType.HORSE);
// 修改AI使马具有攻击性
horse.addAIGroup(List.of(
    // 添加近战攻击目标，范围4，延迟2秒
    new MeleeAttackGoal(horse, 4.0, Duration.ofSeconds(2))
), List.of(
    // 添加目标为10格内最近的Player实体
    new ClosestEntityTarget(horse, 10.0, entity -> entity instanceof Player)
));
horse.setInstance(instance, spawnPosition); // 实际生成马
```

创建物品实体：

```java
Instance instance = ...; // 要生成物品的实例
Pos spawnPosition = new Pos(0D, 42D, 0D);
ItemEntity item = new ItemEntity(ItemStack.of(Material.DIAMOND_SWORD));
item.setInstance(instance, spawnPosition); // 实际生成物品
```

> 有关为物品实体添加功能的更多信息，查看[demo](https://github.com/Minestom/Minestom/blob/fb895cb89956e256f52f84d6abe267bd9233ca3f/demo/src/main/java/net/minestom/demo/PlayerInit.java#L75-L93)。

## 实体元数据

选择并实例化实体类后，你可使用`Entity#getEntityMeta()`检索其元数据。根据实例化时指定的实体类型，将其转换为适当类型，允许你改变实体在客户端上的显示方式。

### 示例

为第一个示例的马设置颜色：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

使马看起来有威胁：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
```

## 有用方法

### 实体存在

实例化后，实体不会立即被视为活跃，因此不会出现在任何实例中。要实际生成它，你必须调用`Entity#setInstance(Instance, Position)`。

还有一个方便的`Entity#setAutoViewable(boolean)`，它会自动追踪此实体是否在其所在实例的玩家可视范围内，并向他们发送生成/销毁包。所有实体默认可自动查看。

要移除实体，只需调用`Entity#remove()`。

### 切换实体类型

作为开发者，你可以切换已有实体的实体类型。此操作可使用`Entity#switchEntityType(EntityType)`执行，并将清空实体之前拥有的所有元数据。

若你想了解其内部工作原理，会向该实体的所有观看者发送销毁包，然后新的生成包取而代之。若你更改玩家的实体类型，除他自己外的所有观看者将接收这些包，因此无法在他自己的客户端上以不同实体类型渲染玩家。

### 高效批量更新元数据

可能存在需要同时修改`EntityMeta`的多个属性的情况。这里存在一个问题，因为每次修改元数据时，都会向其所有观看者发送包。为减少网络带宽并一次性发送所有更新，存在`EntityMeta#setNotifyAboutChanges(boolean)`方法。在首次元数据更新前使用`false`调用它，然后在最后一次更新后使用`true`：所有执行的更改将一次性发送。若你需要更多关于此主题的信息，查看相关方法文档：它很丰富。

例如，我们可以获取更新马元数据的代码：若我们在马生成后执行它，将导致向每个马的观看者发送3个元数据包。为避免此情况，我们只需添加两行简单代码：

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setNotifyAboutChanges(false); // 此
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // 与此
```

### 玩家实体（NPCs/人体模型）

自1.21.9起，现在存在一种人体模型实体类型。这是创建NPC的既定且首选方式。然而旧方法在某些情况下仍更好。

这里是一个示例人体模型类，创建了一个游泳的Minestom npc。

```java-vue

public class Mannequin extends EntityCreature {

    public Mannequin() {
        super(EntityType.MANNEQUIN);

        editEntityMeta(MannequinMeta.class, meta -> {
            meta.setDescription(Component.text("I'm an NPC"));

            ResolvableProfile profile = new ResolvableProfile(
                    PlayerSkin.fromUsername("Minestom")
            );
//            或你可以替换资源包中的皮肤元素
//            ResolvableProfile profile = new ResolvableProfile(
//                    new ResolvableProfile.Partial("Minestom", null, List.of()),
//                    new PlayerSkin.Patch(
//                            Key.key("minecraft", "entity/player/wide/steve"), // 从原版资源包覆盖皮肤为steve
//                            null,
//                            null,
//                            false
//                    )
//            );

            meta.setProfile(profile);
            meta.setCustomNameVisible(true);
            meta.setPose(EntityPose.SWIMMING);
        });

        this.set(DataComponents.CUSTOM_NAME, Component.text("Minestom", NamedTextColor.GOLD));
    }

}

```

若你想使用旧方法，请阅读以下内容。

当创建看起来像玩家的NPC时，重要的是将它们实现为`Entity`类的扩展，而非使用`Player`类或创建“虚拟连接”。此方法可防止潜在的自定义`Player`类实现问题，并提供对NPC行为的更好控制。

参考实现可在**mworzala**的[gist](https://gist.github.com/mworzala/2c5da51204c45c70db771d0ce7fe9412)中找到，它演示了如何创建一个基本的玩家NPC。

> **重要提示：**
>
> - 用户名必须为16个字符或更少。更长的用户名将导致`DecoderException`，消息为"Failed to decode packet 'clientbound/minecraft:player_info_update'"
> - 此实现作为参考与起点提供。你可能需要根据自己的具体需求扩展它