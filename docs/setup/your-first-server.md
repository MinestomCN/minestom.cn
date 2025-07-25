---
description: 包括了让你的第一个服务器运行所需的一切。
---

# 你的第一台服务器

在能够连接到你的 Minestom 服务器之前，需要一些步骤。

- 初始化服务器
- 注册事件/命令
- 在指定的端口和地址启动服务器

以下是一个正确的示例：

::: tabs
=== Java

```java
public static void main(String[] args) {
    // 初始化服务器
    MinecraftServer minecraftServer = MinecraftServer.init();

    // 注册事件（设置出生点实例，将玩家传送到出生点）
    // 启动服务器
    minecraftServer.start("0.0.0.0", 25565);
}
```

===
=== Kotlin

```kotlin
fun main() {
    // 初始化服务器
    val minecraftServer = MinecraftServer.init()

    // 注册事件（设置出生点实例，将玩家传送到出生点）
    // 启动服务器
    minecraftServer.start("0.0.0.0", 25565)
}
```

===
:::

然而，即使在这些步骤之后，你仍然无法连接，因为我们缺少一个实例。

_如果你对如何创建/监听实例有疑问，请查看_ [_instances_](/docs/world/instances) _和_ [_events_](/docs/feature/events) _页面。_

::: tabs
=== Java

```java
Instance instance = // 创建实例
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
   event.setSpawningInstance(instance);
});
```

===
=== Kotlin

```kotlin
val instance = // 创建实例
val globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent::class.java) { event ->
    event.spawningInstance = instance
}
```

===
:::

这里有一个工作的 Minestom 服务器的示例

::: tabs
=== Java

```java
package demo;

import net.minestom.server.MinecraftServer;
import net.minestom.server.entity.Player;
import net.minestom.server.event.GlobalEventHandler;
import net.minestom.server.event.player.AsyncPlayerConfigurationEvent;
import net.minestom.server.instance.*;
import net.minestom.server.instance.block.Block;
import net.minestom.server.coordinate.Pos;

public class MainDemo {
    public static void main(String[] args) {
        // 初始化
        MinecraftServer minecraftServer = MinecraftServer.init();

        // 创建实例
        InstanceManager instanceManager = MinecraftServer.getInstanceManager();
        InstanceContainer instanceContainer = instanceManager.createInstanceContainer();

        // 设置 ChunkGenerator
        instanceContainer.setGenerator(unit -> unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK));

        // 添加事件回调以指定出生实例（和出生位置）
        GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
        globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
            final Player player = event.getPlayer();
            event.setSpawningInstance(instanceContainer);
            player.setRespawnPoint(new Pos(0, 42, 0));
        });

        // 在端口 25565 上启动服务器
        minecraftServer.start("0.0.0.0", 25565);
    }
}
```

===
=== Kotlin

```kotlin
package demo

import net.minestom.server.MinecraftServer
import net.minestom.server.instance.block.Block
import net.minestom.server.coordinate.Pos
import net.minestom.server.event.player.AsyncPlayerConfigurationEvent

fun main() {
    // 初始化
    val minecraftServer = MinecraftServer.init()

    // 创建实例
    val instanceManager = MinecraftServer.getInstanceManager()
    val instanceContainer = instanceManager.createInstanceContainer()

    // 设置 ChunkGenerator
    instanceContainer.setGenerator { unit ->
        unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK)
    }

    // 添加事件回调以指定出生实例（和出生位置）
    val globalEventHandler = MinecraftServer.getGlobalEventHandler()
    globalEventHandler.addListener(AsyncPlayerConfigurationEvent::class.java) { event ->
        val player = event.getPlayer()
        event.spawningInstance = instanceContainer
        player.respawnPoint = Pos(0.0, 42.0, 0.0)
    }

    minecraftServer.start("0.0.0.0", 25565)
}
```

===
:::

一旦你创建了你的 Minestom 服务器，你可能会想将其构建为一个单独的 JAR 文件。

## 构建服务器 JAR (Gradle)

这可以通过 Gradle 的 `shadow` 插件实现。你可以在这个 [链接](https://gradleup.com/shadow/) 找到这个插件的完整文档。

首先，让我们将 `shadow` 插件添加到我们的 Gradle 项目中。

::: tabs
=== Gradle (Groovy)

```groovy
plugins {
    id 'com.gradleup.shadow' version "8.3.0"
}
```

===
=== Gradle (Kotlin)

```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.0"
}
```

===
:::
完成所有这些后，我们只需要运行 `shadowJar` 任务就可以为 Gradle 创建一个工作的正常（胖）jar 文件了！（默认情况下，jar 文件会被放在 `/build/libs/` 目录下）。

这里是一个完整的 `build.gradle`/`build.gradle.kts` 文件，添加了一些额外的便利功能。

::: tabs
=== Gradle (Groovy)

```groovy
plugins {
    id 'java'
    id 'com.gradleup.shadow' version "8.3.0"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    // 将这个更改为最新版本
    implementation 'net.minestom:minestom:<version>'
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom 的最低 Java 版本是 21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // 将这个更改为你的主类
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // 防止在 shadowjar 文件上添加 -all 后缀。
    }
}

```

===
=== Gradle (Kotlin)

```kts
plugins {
    id("java")
    id("com.gradleup.shadow") version "8.3.0"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // 将这个更改为最新版本
    implementation("net.minestom:minestom:<version>")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom 的最低 Java 版本是 21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // 将这个更改为你的主类
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // 防止在 shadowjar 文件上添加 -all 后缀。
    }
}

```

===
:::

## 构建服务器 JAR (Maven)

首先，为我们的 jar 添加一个执行属性和 `jar-with-dependencies` 标签（它将被输出在 `/target/` 目录下）。

你可以使用 `assembly` 插件来构建 jar，使用 `clean package` 命令。该插件的文档可以在 [这里](https://maven.apache.org/plugins/maven-assembly-plugin/) 找到。

这里是一个完整的 `pom.xml` 文件，添加了一些额外的便利功能。

```xml
<project>
    <groupId>org.example</groupId>
    <artifactId>Main</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>21</java.version> <!--Minestom 的最低 Java 版本是 21-->
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>net.minestom</groupId>
            <artifactId>minestom</artifactId>
            <version>version</version> <!--将这个更改为你使用的 Minestom 版本-->
        </dependency>
    </dependencies>

    <build>
        <defaultGoal>clean package</defaultGoal>
        <resources>
            <resource>
                <directory>${project.basedir}/src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal> <!--防止依赖项多次阴影化-->
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>org.example.Main</mainClass> <!--将这个更改为你的主类-->
                        </manifest>
                    </archive>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <appendAssemblyId>false</appendAssemblyId>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

<sub>_示例由 [AlexDerProGamer](https://github.com/AlexDerProGamer) 提供_</sub>

