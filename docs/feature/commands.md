# 命令

命令是服务器与玩家之间主要的通信方式。与当前的替代方案不同，Minestom充分利用了自动补全/建议功能，因此具有相当严格的API。

## 概述

所有可自动补全的命令都应该扩展 `Command`，每个命令由零个或多个语法组成，每个语法由一个或多个参数组成。

如果你觉得这很混乱，这里有一些例子：

```java
/health // 这是一个命令
/health set 50; // 这是一个命令及其语法
set // 这是一个字面参数
~ ~ ~ // 这是一个位置参数
```

## 创建你的第一个命令

首先，创建你的命令类！

```java
package demo.commands;

import net.minestom.server.command.builder.Command;

public class TestCommand extends Command {

    public TestCommand() {
        super("my-command", "hey");
        // "my-command" 是命令的主名称
        // "hey" 是一个别名，你可以有无限多个别名
    }
}
```

完成后，你需要注册这个命令。

```java
MinecraftServer.getCommandManager().register(new TestCommand());
```

到目前为止，没有什么复杂的，让我们在命令没有任何参数时创建一个回调，并为我们的自定义语法创建另一个回调。

```java
package demo.commands;

import net.minestom.server.command.builder.Command;
import net.minestom.server.command.builder.arguments.ArgumentType;

public class TestCommand extends Command {

    public TestCommand() {
        super("command", "alias");

        // 如果没有其他执行器可以使用，则执行此操作
        setDefaultExecutor((sender, context) -> {
            sender.sendMessage("你执行了命令");
        });

        // 所有默认参数都可以在 ArgumentType 类中找到
        // 每个参数都有一个标识符，该标识符应该是唯一的。它用于内部创建节点
        var numberArgument = ArgumentType.Integer("my-number");

        // 最后，使用回调和无限数量的参数创建语法
        addSyntax((sender, context) -> {
            final int number = context.get(numberArgument);
            sender.sendMessage("你输入了数字 " + number);
        }, numberArgument);

    }
}
```

![命令执行效果](/docs/feature/commands/number-command.png)

## 参数回调

假设你有一个命令 "/set \<number>"，而玩家输入了 "/set text"，你可能希望警告玩家参数需要一个数字而不是文本。这就是参数回调的作用！

当命令解析器检测到错误输入的参数时，它会首先检查给定的参数是否有错误回调来执行，如果没有，则使用默认执行器。

这里是一个检查整数参数正确性的例子：

```java
package demo.commands;

import net.minestom.server.command.builder.Command;
import net.minestom.server.command.builder.arguments.ArgumentType;

public class TestCommand extends Command {

    public TestCommand() {
        super("command");

        setDefaultExecutor((sender, context) -> {
            sender.sendMessage("用法: /command <number>");
        });

        var numberArgument = ArgumentType.Integer("my-number");

        // 如果参数使用错误，则执行此回调
        numberArgument.setCallback((sender, exception) -> {
            final String input = exception.getInput();
            sender.sendMessage("数字 " + input + " 无效!");
        });

        addSyntax((sender, context) -> {
            final int number = context.get(numberArgument);
            sender.sendMessage("你输入了数字 " + number);
        }, numberArgument);

    }
}
```

![参数回调检测到无效数字](/docs/feature/commands/number-command-validation.png)

## 命令数据

命令API的一个重要特性是每个语法都可以返回可选数据。这些数据以类似于Map的结构呈现（实际上，它只是一个围绕它的轻量级包装器）。

```java
addSyntax((sender, context) -> {
    final int number = context.get("number");
    sender.sendMessage("你输入了数字 " + number);

    // 将参数数据放入返回的命令数据中
    context.setReturnData(new CommandData().set("value", number));
}, Integer("number"));
```

每次调用语法时都会创建并返回数据。然后可以从 `CommandResult` 中检索它。`CommandManager#executeServerCommand(String)` 允许你以 `ServerSender` 的身份执行命令（这具有不在 `CommandSender#sendMessage(String)` 上打印任何内容的好处，并允许区分此发送者与玩家或控制台）。

```java
CommandResult result = MinecraftServer.getCommandManager().executeServerCommand("command 5");
if (result.getType() == CommandResult.Type.SUCCESS) {
    final CommandData data = result.getCommandData();
    if (data != null && data.has("value")) {
        System.out.println("命令给了我们值 " + data.get("value"));
    } else {
        System.out.println("命令没有给我们任何值!");
    }
} else {
    System.out.println("命令没有成功!");
}
```

这个工具开启了许多可能性，包括强大的脚本、远程调用以及所有API的易于使用的接口。