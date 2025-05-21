import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import bracketed_spans_plugin from "markdown-it-bracketed-spans"
import container_plugin from "markdown-it-container"

export default defineConfig({
  title: "Minestom",
  description: "一个多线程、开源的库，用于开发高性能Minecraft服务器",
  markdown: {
    breaks: true,
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(bracketed_spans_plugin)
      md.use(container_plugin, 'alert', {
        render(tokens, idx) {
          const token = tokens[idx]
          const type = token.info.trim().split(' ')[1] || 'info'
          if (token.nesting === 1) {
            return `<div class="alert alert-${type}">
                      <div class="alert-header">${type.toUpperCase()}</div>
                        <div class="alert-content">\n`
          } else {
            return `</div></div>\n`
          }
        }
      })
    }
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#ff6c32" }],
  ],
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: "local"
    },
    logo: "/minestom-logo.png",
    nav: [
      { text: "库", link: "/libraries" },
      // { text: "案例展示", link: "/showcase/introduction" },
      { text: "Wiki文档", link: "/docs/introduction" },
      { text: "Javadoc", link: "https://javadoc.minestom.net" },
    ],

    sidebar: {
      // "/showcase": [
      //   {
      //     text: "介绍",
      //     link: "/showcase/introduction",
      //   },
      //
      //   // 案例展示示例
      //   {
      //     text: "案例展示",
      //     items: [{ text: "示例服务器", link: "/showcase/example" }],
      //   },
      // ],
      "/docs/": [
        {
          text: "介绍",
          link: "/docs/introduction",
        },
        {
          text: "设置",
          items: [
            { text: "依赖管理", link: "/docs/setup/dependencies" },
            {
              text: "你的第一个服务器",
              link: "/docs/setup/your-first-server",
            },
          ],
        },
        {
          text: "世界",
          items: [
            { text: "实例", link: "/docs/world/instances" },
            {
              text: "区块管理",
              link: "/docs/world/chunk-management",
              items: [
                { text: "Anvil加载器", link: "/docs/world/anvilloader" },
                { text: "光照系统", link: "/docs/world/lightloader" },
              ],
            },
            { text: "方块", link: "/docs/world/blocks" },
            { text: "坐标系统", link: "/docs/world/coordinates" },
            { text: "世界生成", link: "/docs/world/generation" },
            { text: "批量操作", link: "/docs/world/batch" },
          ],
        },
        {
          text: "功能特性",
          items: [
            { text: "冒险模式", link: "/docs/feature/adventure" },
            { text: "物品系统", link: "/docs/feature/items" },
            {
              text: "事件系统",
              link: "/docs/feature/events",
              items: [
                {
                  text: "实现原理",
                  link: "/docs/feature/events/implementation",
                },
                {
                  text: "服务器列表Ping",
                  link: "/docs/feature/events/server-list-ping",
                },
              ],
            },
            {
              text: "玩家能力",
              link: "/docs/feature/player-capabilities",
            },
            {
              text: "实体系统",
              link: "/docs/feature/entities",
              items: [{ text: "AI系统", link: "/docs/feature/entities/ai" }],
            },
            { text: "标签系统", link: "/docs/feature/tags" },
            { text: "调度器", link: "/docs/feature/schedulers" },
            { text: "命令系统", link: "/docs/feature/commands" },
            { text: "物品栏系统", link: "/docs/feature/inventories" },
            { text: "玩家UUID", link: "/docs/feature/player-uuid" },
            { text: "玩家皮肤", link: "/docs/feature/player-skin" },
            { text: "进度系统", link: "/docs/feature/advancements" },
            {
              text: "地图渲染",
              link: "/docs/feature/map-rendering",
              items: [
                {
                  text: "GLFW地图渲染",
                  link: "/docs/feature/map-rendering/glfwmaprendering",
                },
              ],
            },
            { text: "查询系统", link: "/docs/feature/query" },
            { text: "局域网开放", link: "/docs/feature/open-to-lan" },
          ],
        },
        {
          text: "兼容性",
          items: [
            { text: "代理支持", link: "/docs/compatibility/proxies" },
            { text: "不支持的版本", link: "/docs/compatibility/unsupported-versions" }
          ]
        },
        {
          text: "线程架构",
          items: [
            {
              text: "JVM中的线程安全",
              link: "/docs/thread-architecture/thread-safety",
            },
            {
              text: "可获取API",
              link: "/docs/thread-architecture/acquirable-api",
              items: [
                {
                  text: "内部实现",
                  link: "/docs/thread-architecture/acquirable-api/inside-the-api",
                },
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/minestom/Minestom",
      },
      {
        icon: "discord",
        link: "https://discord.gg/pkFRvqB",
      },
    ],
  },
});
