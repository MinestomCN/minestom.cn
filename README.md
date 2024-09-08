这是 Minestom 官方网站的代码仓库。欢迎创建 PR（Pull Request，即合并请求）来提交服务器、更新文档或总体上更新网站。

## 提交服务器

### 要求

- 必须使用 Minestom（显然）
- 必须公开可用以供审查。

### 提交服务器

1. 首先，在这里[fork](https://github.com/MinestomCN/minestom.cn)（即复制）网站代码仓库。
2. 接下来，在 `/showcase` 目录下添加你的服务器 markdown 文件。要存储媒体文件，请上传至 `/public/showcase/(server)` 目录。请注意，由于托管限制，包含过大媒体的 PR 可能会被拒绝。如果出现这种情况，你可以使用其他服务，如 Dropbox 或 Imgur 来托管图片。要在 markdown 中使用图片，请使用 `![Image Alt](/showcase/(server)/(image)`。
3. 要将服务器添加到侧边栏，编辑 `/.vitepress/config.mts` 中的 `themeConfig.sidebar./showcase`。配置文件中可以看到示例。
4. 最后，提交、推送你的更改，并创建一个 pull request！
5. 等待有人审查 PR 并进行任何更改/更新。

请注意，由于网络原因，我无法解析你提供的链接。这可能是链接的问题，也可能是网络连接的问题。请检查链接是否正确，并在网络状况良好时重试。如果你有其他问题或需要进一步的帮助，请告诉我。
