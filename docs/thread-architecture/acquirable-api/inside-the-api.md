---
description: >-
  描述了内部如何执行tick以及如何安全地获取对象
---

# 内部机制

## 内部机制

首先，我想说的是，您不需要了解这里写的任何内容来使用acquirable API。然而，它可以教您关于我们的代码结构以及如何实现线程安全。请确保阅读所有前面的页面，以便正确理解这里所说的一切。

### Tick架构

Ticks被分为多个批次。在创建这些批次后，每个批次都会被分配给ThreadDispatcher线程池中的一个线程。

线程的分配取决于`ThreadProvider`，默认情况下使用单个线程。

完成所有这些后，线程开始运行，`UpdateManager`将等待直到所有线程完成。这个循环会一直持续到服务器停止。

### 对象获取

在批次被分配给线程后，同样的事情也会发生在添加到批次中的每个元素上。这意味着每个实体在实际发生之前就知道它将在哪个线程中被tick！

这有什么优势呢？它允许我们知道是否可以安全地访问相关对象！当您执行`Acquirable#acquire`时，它首先会检查当前线程是否与对象将被tick的线程相同，这意味着不需要同步，在这种情况下，开销只是一个简单的`Thread#currentThread`调用。

这显然是最佳场景，但并不总是发生。如果两个线程不同，系统会如何反应？首先，它会向对象的线程发出需要获取的信号，然后阻塞当前线程，其次，它会等待被信号的线程处理获取。获取信号在每个实体tick的开始和线程tick执行的结束时检查。

在获取处理期间，线程会被阻塞，直到所有获取都处理完毕，然后才能安全地继续执行。

### 结论

没有什么是神奇的，这个API也不例外。它在获取受到控制（以限制同步）并且使用特定于您需求的`ThreadProvider`时，有可能使您的应用程序更快。如果您希望每个玩家有一个世界，那么为每个`Instance`使用一个批次可能是最佳解决方案。如果您有一个非常精确的模式，其中每3个区块完全独立于其他区块，请按此方向管理您的批次！