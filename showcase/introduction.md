# Minestom 服务器展示

在这里，您可以找到其他服务器或提交一个服务器进行展示。

## 提交服务器

### 要求

- 必须使用 Minestom（显然）
- 必须公开可用以供审查。

### 提交服务器

1. 首先，在这里分叉网站仓库 [here](https://github.com/Minestom/minestom.net)。
2. 接下来，在 `/showcase` 目录下添加您的服务器 markdown 文件。要存储媒体，请将其上传到 `/public/showcase/(server)` 目录。要使用图像，请在您的 markdown 中使用 `![Image Alt](/showcase/(server)/(image)`。
3. 要添加服务器到侧边栏，请编辑 `themeConfig.sidebar./showcase`，在 `/.vitepress/config.mts` 中。可以在配置中看到一个示例。
4. 最后，提交并推送您的更改，并创建一个拉取请求！
5. 等待有人审查 PR 并进行任何更改/更新。