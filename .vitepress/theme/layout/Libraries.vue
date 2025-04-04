<template>
    <div class="VPDoc px-[32px] py-[48px]">
        <div class="flex flex-col gap-2 relative mx-auto max-w-[948px]">
            <h1 class="text-vp-c-text-1 text-3xl font-semibold mb-4">
                库
            </h1>
            <p class="text-vp-c-text-3 font-normal text-md mb-4">
                在这里你可以找到有用的库和工具来加速你的Minestom开发。
                <br>
                要提交你的库，只需在你的GitHub仓库中添加<code class="font-bold mx-1">minestom-library</code>主题。
            </p>

            <input
                v-model="searchText"
                class="rounded-lg px-3 py-2 w-[calc(100%-2px)] translate-x-[1px] bg-vp-c-bg focus:ring-vp-c-brand-2 text-vp-c-text-2 transition-colors font-base ring-vp-c-border ring-1"
                placeholder="搜索..."
            />
            <div v-if="loading" class="my-3 text-center">加载中...</div>
            <ul
                v-else-if="filteredLibraries.length > 0"
                class="grid grid-cols-1 lg:grid-cols-2 gap-2"
            >
                <a
                    v-for="item in filteredLibraries"
                    :key="item.name"
                    :href="item.url"
                    class="p-4 group bg-vp-c-bg transition-all flex flex-col rounded-lg border border-vp-c-border hover:border-vp-c-brand-2 animate-in fade-in-40 relative"
                >
                    <h2 class="font-bold">
                        {{ item.name }}
                        <span class="font-normal"> 由 </span>
                        <span>{{ item.owner }}</span>
                    </h2>
                    <p class="text-vp-c-text-2 mb-2">
                        {{ item.description }}
                    </p>
                    <p class="text-vp-c-text-3 mt-auto flex flex-row">
                        <span class="mr-auto">{{ item.stars }} 星</span>
                        <span
                            class="group-hover:text-vp-c-brand-2 transition-colors"
                            >在GitHub上查看</span
                        >
                    </p>
                </a>
            </ul>
            <p v-else class="my-3">未找到库。</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "LibrariesList",
    data() {
        return {
            libraries: [],
            searchText: "",
            loading: false,
        };
    },
    created() {
        this.fetchLibraries();
    },
    methods: {
        async fetchLibraries() {
            this.loading = true;
            try {
                const response = await axios.get("https://api.minestom.cn/api/libraries");
                if (!Array.isArray(response.data)) {
                    console.error(
                        "从服务器请求库时返回格式错误",
                    );
                    return;
                }
                this.libraries = response.data;
            } catch (error) {
                console.error("获取库时出错:", error);
                this.libraries = [];
            } finally {
                this.loading = false;
            }
        },
    },
    computed: {
        filteredLibraries() {
            return this.libraries.filter((item) =>
                item.name.toLowerCase().includes(this.searchText.toLowerCase()),
            );
        },
    },
};
</script>