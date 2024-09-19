import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config 
export default defineConfig({
  title: "Minestom",
  description:
    "一个多线程的、开源的库，用于开发高性能的Minecraft服务器。",
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#ff6c32" }],
  ],
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config 
    search: {
      provider: "local"
    },
    logo: "/minestom-logo.png",
    nav: [
      { text: "库", link: "/libraries" },
      // { text: "展示", link: "/showcase/introduction" },
      { text: "教程百科", link: "/docs/introduction" },
      { text: "Javadoc", link: "https://javadoc.minestom.net"  },
    ],

    sidebar: {
      // "/showcase": [
      //   {
      //     text: "介绍",
      //     link: "/showcase/introduction",
      //   },
      //
      //   // 展示示例
      //   {
      //     text: "展示",
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
            { text: "依赖", link: "/docs/setup/dependencies" },
            {
              text: "你的第一个服务器",
              link: "/docs/setup/your-first-server",
            },
          ],
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
                  text: "API内部",
                  link: "/docs/thread-architecture/acquirable-api/inside-the-api",
                },
              ],
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
                { text: "照明", link: "/docs/world/lightloader" },
              ],
            },
            { text: "方块", link: "/docs/world/blocks" },
            { text: "坐标", link: "/docs/world/coordinates" },
            { text: "生成", link: "/docs/world/generation" },
            { text: "批量", link: "/docs/world/batch" },
          ],
        },
        {
          text: "特性",
          items: [
            { text: "冒险", link: "/docs/feature/adventure" },
            {
              text: "玩家能力",
              link: "/docs/feature/player-capabilities",
            },
            {
              text: "事件",
              link: "/docs/feature/events",
              items: [
                {
                  text: "实现",
                  link: "/docs/feature/events/implementation",
                },
                {
                  text: "服务器列表 Ping",
                  link: "/docs/feature/events/server-list-ping",
                },
              ],
            },
            { text: "物品", link: "/docs/feature/items" },
            {
              text: "实体",
              link: "/docs/feature/entities",
              items: [{ text: "AI", link: "/docs/feature/entities/ai" }],
            },
            { text: "标签", link: "/docs/feature/tags" },
            { text: "调度器", link: "/docs/feature/schedulers" },
            { text: "命令", link: "/docs/feature/commands" },
            { text: "库存", link: "/docs/feature/inventories" },
            { text: "玩家 UUID", link: "/docs/feature/player-uuid" },
            { text: "玩家皮肤", link: "/docs/feature/player-skin" },
            { text: "权限", link: "/docs/feature/permissions" },
            { text: "成就", link: "/docs/feature/advancements" },
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
            { text: "对局域网开放", link: "/docs/feature/open-to-lan" },
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