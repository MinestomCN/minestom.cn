# 标签

## 概述

一个 `Tag` 代表一个键，以及一种读取/写入特定类型数据的方式。通常作为常量公开，你可以使用它来对任何 `TagReadable`（例如 `Entity`、`ItemStack`，以及即将支持的 `Block`）应用或读取数据。它们是使用 NBT 实现的，这意味着将标签应用于 `ItemStack` 将修改其 NBT，同样适用于 `Block`，因此可以将其发送到客户端。

```java
Tag<String> myTag = Tag.String("key");
Entity entity = ...;
String data = entity.getTag(myTag);
```

标签的优势在于：

* 通过 `TagReadable`/`TagWritable` 独立控制可读性和可写性，非常适合不可变类。
* 隐藏转换复杂性，你的代码不需要关心 `List<ItemStack>` 是如何序列化的。
* 自动序列化支持（由 NBT 支持），简化数据持久化和调试。

## API

首先，建议将标签作为常量并重复使用。所有 `Tag` 方法都应该是纯函数，并允许指定附加信息来处理数据。

所有标签都可以作为 `Tag` 类中的静态工厂方法使用。

#### 映射

标签映射允许你转换检索到的值。

```java
Tag<String> stringTag = Tag.String("my-string");
// 你还应该确保字符串是一个有效的 UUID！
Tag<UUID> mappedTag = stringTag.map(UUID::fromString, UUID::toString);
UUID uuid = instance.getTag(mappedTag);
```

#### 默认值

```java
Tag<String> stringTag = Tag.String("my-string");
instance.getTag(stringTag.defaultValue("default"));
```

#### TagSerializer

`TagSerializer` 类似于 `#map` 方法，但你可以与多个标签进行交互。

#### 结构

结构标签是围绕 NBT 复合（映射）的包装器，独立于所有其他标签。

#### 视图

视图可以访问每个标签，因此大多数情况下是不安全的，应仅在最后手段时使用。