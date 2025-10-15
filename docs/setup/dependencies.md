---
description: 描述如何在项目中添加 Minestom 依赖。
---

<script setup>
import axios from "axios";
import { ref, onMounted } from 'vue'

const version = ref("<--version-->");

const fetchVersion = async () => {
  try {
    const response = await axios.get("/api/latest-version");
    const ver = response.data.latestVersion;
    if (ver != null) {
      version.value = ver;
    }
  } catch (error) {
    console.error("Error fetching libraries:", error);
  }
}

onMounted(() => {
  fetchVersion();
});
</script>

# 依赖

:::alert info
Minestom 需要 Java 25 或更高版本才能运行。如果你使用 Gradle，必须使用 9.1 或更高版本。如果你使用 IntelliJ IDEA，必须使用 2025.2 或更高版本。
:::

将 Minestom 添加到 Java 项目中的方式与添加普通库相同。

## 仓库

:::tabs
== Gradle (Groovy)

```groovy
repositories {
    mavenCentral()
}
```

== Gradle (Kotlin)

```kotlin
repositories {
    mavenCentral()
}
```

:::

## 依赖

:::tabs
== Gradle (Groovy)

```groovy-vue
dependencies {
    implementation 'net.minestom:minestom:{{ version }}'
}
```

== Gradle (Kotlin)

```kotlin-vue
dependencies {
    implementation("net.minestom:minestom:{{version}}")
}
```

== Maven

```xml-vue
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

:::

master 分支的版本字符串始终为最新的 GitHub 发布名称。

Minestom 的 PR 分支也会发布，可用于预览即将推出的功能。你可以通过以下方式启用它们：

:::tabs

== Gradle (Kotlin)

```kotlin-vue
repositories {
    maven(url = "https://central.sonatype.com/repository/maven-snapshots/ ") {
        content { // 此过滤为可选项，但建议使用
            includeModule("net.minestom", "minestom")
            includeModule("net.minestom", "testing")
        }
    }
    mavenCentral()
}

dependencies {
    implementation("net.minestom:minestom:<branch>-SNAPSHOT")
    testImplementation("net.minestom:testing:<branch>-SNAPSHOT")
}
```

:::