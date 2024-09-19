# 权限

权限是允许你确定玩家是否能够执行某个操作的功能。

[`Permission`](https://minestom.github.io/Minestom/net/minestom/server/permission/Permission.html) 是一个不可变类，可以添加到任何 [`PermissionHandler`](https://minestom.github.io/Minestom/net/minestom/server/permission/PermissionHandler.html) 中。

一个权限包含两部分，一个唯一的名称（如果你熟悉 Bukkit，这与 Bukkit 相同），以及一个可选的 `NBTCompound`，可以用来为权限添加额外数据（不再有 "my.permission.X"，其中 X 代表一个数字）。

## 处理权限访问

为了将权限添加到 PermissionHandler，你应该使用 `PermissionHandler#addPermission(Permission)`。

要移除权限，可以使用 `PermissionHandler#removePermission(Permission)` 和 `PermissionHandler#removePermission(String)`。

## 检查权限

要验证 PermissionHandler 是否具有某个权限，你可以选择简单地检查处理程序是否具有相同名称的权限，或者验证处理程序是否同时具有权限名称和正确的关联数据。

要检查处理程序是否具有特定名称的权限，应该使用 `PermissionHandler#hasPermission(String)`。如果你想验证处理程序是否具有正确的 NBT 数据，`PermissionHandler#hasPermission(String, PermissionVerifier)` 是正确的选择。

[`PermissionVerifier`](https://minestom.github.io/Minestom/net/minestom/server/permission/PermissionVerifier.html) 是一个简单的函数式接口，用于检查给定的 `NBTCompound` 是否有效。

或者，可以使用 `PermissionHandler#hasPermission(Permission)`。它要求权限名称和数据都相等。

## 为玩家添加权限并检查它们

为了给玩家添加权限，你需要调用 `Player#addPermission(Permission)` 函数，正确使用的示例如下：

```java
player.addPermission(new Permission("operator"));
```

如果你想检查玩家是否具有某个权限，可以使用 `Player#hasPermission(Permission)` 函数，以下是从命令中检查权限的示例：

```java
public class StopCommand extends Command {
    public StopCommand() {
        super("stop");
        setCondition((sender, commandString) -> sender.hasPermission(new Permission("operator")));
        setDefaultExecutor((sender, context) -> MinecraftServer.stopCleanly());
    }
}
```

## 权限通配符匹配

Minestom 支持权限的通配符匹配。
这意味着如果玩家具有类似 `admin.*` 的权限，这将满足任何具有相同格式但通配符内容不同的权限检查。例如，`admin.tp` 将返回 true。

示例：
```java
player.addPermission(new Permission("command.*")); // 给予玩家所有以 'command.' 为前缀的权限

player.hasPermission(new Permission("command.gamemode")); // 这返回 true

// 同样适用于
player.addPermission(new Permission("*")); // 给予玩家所有权限

player.hasPermission(new Permission("user.chat")); // 返回 true
player.hasPermission(new Permission("3i359cvjm.sdfk239c")); // 返回 true
```

## 权限序列化

Minestom 中没有任何内容会自动持久保存，权限也不例外。

如果你想实现这样的功能，必须手动序列化和反序列化权限。幸运的是，`Permission` 类可以很容易地解释为两个字符串，一个是权限名称，另一个是使用 `NBTCompound#toSNBT()` 表示的可选数据（反序列化使用 `SNBTParser#parse()`）。