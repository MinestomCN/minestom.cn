---
description: 包括您运行第一个服务器所需的一切。
---

# 您的第一个服务器

在能够连接到您的Minestom服务器之前，需要准备一些事情。

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

    // 注册事件（设置出生实例，将玩家传送到出生点）
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

    // 注册事件（设置出生实例，将玩家传送到出生点）
    // 启动服务器
    minecraftServer.start("0.0.0.0", 25565)
}
```

===
:::

然而，即使在这些步骤之后，您也无法连接，因为我们缺少一个实例。

_如果您对如何创建/监听实例有疑问，请查看_ [实例](/docs/world/instances) _和_ [事件](/docs/feature/events) _页面。_

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

以下是一个运行中的Minestom服务器的示例

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

        // 设置ChunkGenerator
        instanceContainer.setGenerator(unit -> unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK));

        // 添加事件回调以指定出生实例（和出生位置）
        GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
        globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
            final Player player = event.getPlayer();
            event.setSpawningInstance(instanceContainer);
            player.setRespawnPoint(new Pos(0, 42, 0));
        });

        // 在端口25565上启动服务器
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

fun main() {
    // 初始化
    val minecraftServer = MinecraftServer.init();

    // 创建实例
    val instanceManager = MinecraftServer.getInstanceManager();
    val instanceContainer = instanceManager.createInstanceContainer();

    // 设置ChunkGenerator
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
}
```

===
:::

一旦您创建了Minestom服务器，您可能希望将其构建为单个JAR。

## 构建服务器JAR（Gradle）

这可以通过Gradle的`shadow`插件实现。您可以在[这里](https://gradleup.com/shadow/)找到这个插件的完整文档。

首先，让我们将`shadow`插件添加到我们的Gradle项目中。

::: tabs
=== Gradle (Groovy)

```groovy
plugins {
    id 'com.gradleup.shadow' version "8.3.0"
}
```

=== Gradle (Kotlin)

```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.0"
}
```

:::
完成所有这些后，我们只需要运行`shadowJar`任务即可为Gradle创建一个工作的uber（胖）jar！（默认情况下，jar将放在`/build/libs/`中）。

以下是一个添加了一些额外功能的完整`build.gradle`/`build.gradle.kts`文件。

:::tabs
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
    // 将其更改为最新版本
    implementation 'net.minestom:minestom-snapshots:<version>'
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom的最低Java版本为21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // 将其更改为您的主类
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // 阻止在shadowjar文件上添加-all后缀。
    }
}

```

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
    // 将其更改为最新版本
    implementation("net.minestom:minestom-snapshots:<version>")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom的最低Java版本为21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // 将其更改为您的主类
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // 阻止在shadowjar文件上添加-all后缀。
    }
}

```

:::

## 构建服务器JAR（Maven）

首先，为我们的jar添加一个执行属性和`jar-with-dependencies`标签（它将输出在`/target/`中）。

您可以使用`assembly`插件使用`clean package`命令构建jar。该插件的文档可以在[这里](https://maven.apache.org/plugins/maven-assembly-plugin/)找到。

以下是一个添加了一些额外功能的完整`pom.xml`文件。

```xml
<project>
    <groupId>org.example</groupId>
    <artifactId>Main</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>21</java.version> <!--Minestom的最低Java版本为21-->
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>net.minestom</groupId>
            <artifactId>minestom-snapshots</artifactId>
            <version>version</version> <!--将此更改为您使用的Minestom版本-->
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
                            <mainClass>org.example.Main</mainClass> <!--将其更改为您的主类-->
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

<sub>_汉化由 [CyanBukkit](https://www.cyanbukkit.net) 提供_</sub>
