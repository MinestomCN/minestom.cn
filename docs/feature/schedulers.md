# 调度器

`Scheduler` 是一个能够根据条件（时间、刻率、未来等）以与其刻率相关的精度调度任务的对象。因此，重要的是要记住，Minestom 的调度 API 并不旨在取代 JDK 的执行服务，如果你不需要我们的调度保证（在调用线程中执行、基于刻的执行、更少的开销），仍然应该使用 JDK 的执行服务。

这些任务调度可以使用 `TaskSchedule` 对象进行配置，定义任务应该在何时执行。

```java
Scheduler scheduler = MinecraftServer.getSchedulerManager();
scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
scheduler.submitTask(() -> {
    System.out.println("Running directly and then every second!");
    return TaskSchedule.seconds(1);
});
```

任务默认是同步执行的（在对象的刻线程中）。异步执行是可能的，但你可能需要考虑使用第三方解决方案。

调度将为你提供一个 `Task` 对象，让你了解任务的状态，并允许一些修改，例如取消。

```java
Scheduler scheduler = player.scheduler();
Task task = scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
task.cancel();
```