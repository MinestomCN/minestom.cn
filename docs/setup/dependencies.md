---
description: 描述了如何在您的项目中添加Minestom作为依赖项。
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

# 依赖项

::: info
Minestom 需要 Java 21 或更高版本才能运行。如果您使用 Gradle，必须使用 8.5 或更高版本。
:::

将 Minestom 添加到您的 Java 项目中就像添加普通库一样。

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

## 依赖项

:::tabs
== Gradle (Groovy)

```groovy-vue
dependencies {
    implementation 'net.minestom:minestom-snapshots:{{ version }}'
}
```

== Gradle (Kotlin)

```kotlin-vue
dependencies {
    implementation("net.minestom:minestom-snapshots:{{version}}")
}
```

== Maven

```xml-vue
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom-snapshots</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

:::

版本字符串始终是提交哈希的前10个字符。您可以在[这里](https://github.com/Minestom/Minestom/commits/master/)查看提交。

Minestom 的 PR 分支也会发布，可以用来预览即将推出的功能。对于这些分支，版本字符串是 `{branch}-{first 10 chars of commit}`。例如，1_20_5 分支可以使用版本字符串 `1_20_5-dd965f4bb8`。