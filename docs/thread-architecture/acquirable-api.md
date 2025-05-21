# 可访问 API

### 介绍

`Acquirable<T>` 表示一个类型为 `T` 的对象，您可以检索它，但其线程安全访问并不确定。

举个例子，想象两个相距很远的实体，因此它们在不同的线程中被tick。假设实体A想要与实体B交易物品，这需要同步以确保交易成功。从实体A的线程中，您可以检索一个包含实体B的 `Acquirable<Entity>`，然后从中获取它以在不同线程中安全地访问实体。

该API提供了多个好处：

- 使用同步代码实现线程安全
- 无论您是使用每个区块一个线程还是整个服务器一个线程，代码都相同
- 更好地控制您的数据以识别瓶颈

以下是acquirable API在实践中的样子：

```java
Acquirable<Entity> acquirableEntity = ...;
System.out.println("开始获取...");
acquirableEntity.sync(entity -> {
    // 您可以在这个消费者中安全地使用 "entity"！
});
System.out.println("获取成功");
```

`Acquirable#sync` 将阻塞当前线程，直到 `acquirableEntity` 变得可访问，并在情况允许时在**同一个线程**中执行消费者。

重要的是要理解消费者是在同一个线程中调用的，这是Acquirable API的全部魔力，您的代码保持完全相同。

然而，消费者中的实体对象**只能**在消费者内部使用。这意味着如果您需要将实体保存到某个地方以供进一步处理，您应该使用acquirable对象而不是已获取的对象。

```java
    private Acquirable<Entity> myEntity; // <- 好
    // private Entity myEntity <- 不好，不要这样做

    public void randomMethod(Acquirable<Entity> acquirableEntity) {
        this.myEntity = acquirableEntity;
        acquirableEntity.sync(entity -> {
            // "myEntity = entity" 不安全，始终缓存acquirable对象
        });
    }
```

现在，如果您不需要同步获取，您可以选择创建请求并在稍后处理它（在tick结束时），为此您只需“安排”获取。

```java
Acquirable<Entity> acquirableEntity = getAcquiredElement();
System.out.println("嘿，我开始获取");
acquirableEntity.async(entity -> {
    System.out.println("你好");
});
System.out.println("嘿，我安排了获取");
```

将打印：

```
嘿，我开始获取
嘿，我安排了获取
你好
```

还有其他一些选项：

```java
Acquirable<Player> acquirable = getAcquirable();

// #local() 允许您仅在当前线程中检索元素
Optional<Player> local = acquirable.local();
local.ifPresent(player -> {
    // 运行代码...
});

// #lock() 允许您手动控制何时解锁获取
// 如果您不能使用 #sync()
Acquired<Player> acquiredPlayer = acquirable.lock();
Player player = acquiredPlayer.get();
// 运行代码...
acquiredPlayer.unlock();
```

### Acquirable集合

假设您有一个 `AcquirableCollection<Player>`，并且您想要**安全地**访问其中包含的所有玩家。您有多种解决方案，各有优缺点。

#### 朴素循环

您可能想到的是：

```java
// 朴素获取循环
AcquirableCollection<Player> acquirablePlayers = getOnlinePlayers();
for(Acquirable<Player> acquirablePlayer : acquirablePlayers){
    acquirablePlayer.sync(player -> {
        // 做点什么...
    });
}
```

它确实有效，但效率非常低，因为您必须逐个获取每个元素。

#### AcquirableCollection#forEachSync

这是遍历集合的最有效方式，回调函数为每个单独的元素执行，并且只有在所有元素都被获取后才会停止。

```java
AcquirableCollection<Player> acquirablePlayers = getOnlinePlayers();
acquirablePlayers.acquireSync(player -> {
    // 做点什么...
});
acquirablePlayers.acquireAsync(player -> {
    // 做点异步的事情...
});
```

这是最常用的，因为它不会像前面的方法那样产生太多开销。消费者中的元素在不需要等待其他元素的情况下直接释放。

### 不获取直接访问acquirable对象

我可以理解，即使您知道自己正在做什么，到处都有回调函数并不理想。您也可以选择直接解包acquirable对象以检索其中的值。

```java
Acquirable<Entity> acquirableEntity = ...;
Entity entity = acquirableEntity.unwrap();
```

集合也有类似的方法。

```java
AcquirableCollection<Player> acquirablePlayers = getOnlinePlayers();
Stream<Player> players = acquirablePlayers.unwrap();
```

:::alert warning
这些是不安全的操作，请务必阅读[线程安全](thread-safety)页面以了解其影响。
:::

我个人建议在您使用这些不安全方法的任何地方添加注释，以表明为什么此操作不会影响应用程序的安全性。如果您找不到任何理由，您可能不应该这样做。

### 访问当前线程中的所有实体

```java
Stream<Entity> entities = Acquirable.currentEntities();
```

### 在方法中请求和返回的类型

您显然有权选择您喜欢的类型。但作为一般规则，您应该返回 `Acquirable<T>` 对象并请求 `T`。

这样选择的原因是您可以确保（除非使用不安全的方法）您将对给定的参数进行安全访问，但您不知道用户在返回后会对其做什么。