# 坐标

## 概览

Minestom中的所有坐标类都是不可变的（像许多其他类一样），`Point` 是通用接口，实现类有 `Pos` 和 `Vec`。

`Vec` 包含 x, y & z 坐标，并增加了一些向量方法。`Pos` 包含 3 个坐标 + 视角的偏航/俯仰。当类型不重要时，应使用 `Point`。

## 不可变性性能

有些人可能会对使用不可变类进行数学运算的性能损失表示担忧。这是我们的推理：

* 不可变性保证了坐标对象可以被重用，减少了分配
* 在某些特定情况下（构建器模式）可能发生 [标量替换](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/)
* [原始对象](https://openjdk.java.net/jeps/401) 最终会到来，彻底消除了这一担忧，并与可变等价物相比提高了性能

## API

### 初始化

所有坐标都可以通过它们各自的构造函数创建

```java
Vec vec1 = new Vec(3, 0, 1); // [3;0;1] -> x;y;z
Vec vec2 = new Vec(1, 1); // [1;0;1]
Vec vec3 = new Vec(5); // [5;5;5]

Pos pos1 = new Pos(1,2,3,4,5); // [1;2;3;4;5] -> x;y;z;yaw;pitch
Pos pos2 = new Pos(1,2,3); // [1;2;3;0;0]
Pos pos3 = new Pos(new Vec(1)); // [1;1;1;0;0]
Pos pos4 = new Pos(new Vec(1),2,3); // [1;1;1;2;3]
```

### Vec

```java
Vec vec = new Vec(1, 2, 1);
vec = vec.add(0, 5, 0) // 在 y 上加 5
   .apply(Vec.Operator.FLOOR) // 向下取整所有坐标
   .neg() // -x -y -z
   .withX(x -> x * 2); // 将 x 翻倍
```

### Pos

与 `Vec` 非常相似。

```java
Pos pos = new Pos(0, 0, 0);
pos = pos.withView(50, 90)
        .add(0, 5, 0)
        .mul(5);
```

### 方块坐标

```java
Point point = new Vec(1);
final int blockX = point.blockX();
final int blockY = point.blockY();
final int blockZ = point.blockZ();
```

