# AI

## 概述

实体AI通过给实体一个有序的目标列表来实现，如果条件被验证，实体将执行这些目标。一旦找到一个动作，实体将受到该动作的影响，直到被要求停止。

例如，一个非常简单的攻击性生物可能会有：

1. 攻击目标
2. 随机走动
3. 什么都不做

每个tick，实体将根据其优先级找到要遵循的目标。如果实体有目标，将使用第一个目标，其余目标将被忽略。

## 组

你可能会发现自己希望同时执行多个目标。例如，一个实体在攻击目标的同时游泳以避免死亡。这是通过向实体添加多个`EntityAIGroup`来实现的，每个组包含一个独立执行的目标列表。

## 示例

在这个示例中，ZombieCreature的实例将根据附近是否有玩家来攻击附近的玩家或四处走动。

```java
package demo.entity;

import net.minestom.server.entity.ai.EntityAIGroupBuilder;
import net.minestom.server.entity.ai.goal.RandomLookAroundGoal;
import net.minestom.server.entity.type.monster.EntityZombie;
import net.minestom.server.entity.EntityType;

public class ZombieCreature extends EntityCreature {

    public ZombieCreature() {
        super(EntityType.ZOMBIE);
        addAIGroup(
            List.of(
                new MeleeAttackGoal(this, 1.6, 20, TimeUnit.SERVER_TICK), // 攻击目标
                new RandomStrollGoal(this, 20) // 四处走动
            ),
            List.of(
                new LastEntityDamagerTarget(this, 32), // 首先瞄准最后攻击你的实体
                new ClosestEntityTarget(this, 32, entity -> entity instanceof Player) // 如果没有，瞄准最近的玩家
            )
        );
    }
}
```