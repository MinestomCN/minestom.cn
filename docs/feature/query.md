---
description: Minestom对GameSpy4协议的实现。
---

# 查询系统

## 概述

与原版服务器一样，Minestom支持GameSpy4协议的服务器监听器。这可以用于通过查询软件（如[https://mcsrvstat.us/](https://mcsrvstat.us/)或Dinnerbone的[mcstatus](https://github.com/Dinnerbone/mcstatus)程序）从服务器获取信息。

有关查询系统的更多信息，请参阅[https://wiki.vg/Query](https://wiki.vg/Query)。

## 设置

要启动查询系统，只需在`Query`类中运行其中一个`start`方法。如果查询端口尚未打开，它将在指定的端口上开始监听查询。

要停止查询系统，可以调用`stop`方法。

## 修改响应

默认情况下，此系统将尽可能接近原版和其他服务器实现的响应。

如果你希望自定义响应，可以监听在每个响应创建时调用的两个查询事件。这两个事件都允许你访问发送者的`SocketAddress`以及他们发起请求时使用的会话ID。这些信息可用于识别谁在发送请求。此外，每个事件都是可取消的，这意味着如果你不想发送响应，可以简单地取消事件。这是一个强大的系统，使你能够在不向所有人开放查询系统的情况下，保持查询系统开放以从服务器获取任意信息。

### 基本查询

当请求者请求有关服务器的基本信息时，会调用`BasicQueryEvent`。此事件使用`BasicQueryResponse`类来写入一组固定的数据，每个数据都需要填写，以便正确解析响应。

### 完整查询

当请求者请求有关服务器的完整信息时，会调用`FullQueryEvent`。此事件使用`FullQueryResponse`类来写入一组任意的键值格式数据，以及在线玩家列表。有一些键应按标准填写。这些键默认设置，可以使用接受`QueryKey`的`put`方法进行编辑，`QueryKey`是一个包含默认键值映射的枚举。其他任意的映射可以使用其他`put`方法插入。