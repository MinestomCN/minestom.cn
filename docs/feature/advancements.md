# 进度

进度 API 围绕 `AdvancementTab` 展开，这些 `AdvancementTab` 代表一个或多个玩家的 `Advancement` 树。每个查看单个 `AdvancementTab` 的玩家将看到与其他玩家相同的进度。如果需要每个玩家的 `Advancement`，则需要创建单独的 `AdvancementTab`。

`Advancement` 代表 `AdvancementTab` 中的一个可完成的进度。

## AdvancementTab

`AdvancementTab` 可以从 `AdvancementManager` 创建和获取。

```java
// 创建
AdvancementManager#createTab(String /* 命名空间ID */, AdvancementRoot);

// 获取
AdvancementManager#getTab(String /* 命名空间ID */);
```

> 命名空间ID遵循 `namespace:id` 的格式，并且不能有任何大写字母。

`AdvancementRoot` 是选项卡的起始 `Advancement`，其创建方法与常规 `Advancement` 相同（见下文），除了背景。背景是客户端上纹理文件的引用，例如 `minecraft:textures/block/stone.png` 表示石头块。

```java
AdvancementRoot#<init>(Component /* 标题 */, Component /* 描述 */, Material, FrameType, int /* x */, int /* y */, String /* 背景 */);
```

创建后，`AdvancementTab` 可以按如下方式添加和从玩家中移除：

```java
AdvancementTab#addViewer(Player);
AdvancementTab#removeViewer(Player);
```

## Advancement

`Advancement` 可以使用其构造函数创建，并使用关联的父级添加到 `AdvancementTab` 中。

```java
Advancement#<init>(Component /* 标题 */, Component /* 描述 */, Material, FrameType, int /* x */, int /* y */);

AdvancementTab#createAdvancement(String /* 命名空间ID */, Advancement /* 要添加的 */, Advancement /* 父级 */);
```

> `Advancement` 的父级不能为空，并且必须已经添加到选项卡中。`AdvancementRoot` 是一个有效的父级。

一旦 `Advancement` 被注册，它可以被完成。

```java
Advancement#setAchieved(Boolean);
```

> 要使进度显示一个提示，请在设置为已完成之前使用 `Advancement#showToast(Boolean)`。