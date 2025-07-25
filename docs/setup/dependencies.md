---
description: 描述如何在你的项目中添加Minestom依赖。
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

# 依赖管理

:::alert info
Minestom需要Java 21或更高版本才能运行。如果使用Gradle，必须使用8.5或更高版本。
:::

将Minestom添加到你的Java项目就像添加普通库一样简单。

## 仓库配置

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

## 依赖声明

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

版本号始终是提交哈希的前10个字符。你可以在这里查看提交记录：
[GitHub提交记录](https://github.com/Minestom/Minestom/commits/master/)

Minestom的PR分支也会发布，可用于预览即将推出的功能。对于这些分支，版本号格式为`{分支名}-{提交哈希前10位}`。例如，1_20_5分支可以使用版本号`1_20_5-dd965f4bb8`。
