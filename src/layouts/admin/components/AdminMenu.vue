<template>
  <div :style="{ width: menuStore.menuWidth }"
       class="fixed overflow-y-auto bg-slate-800 h-screen text-white menu-container transition-all">
    <!-- 顶部 Logo, 指定高度为 64px, 和右边的 Header 头保持一样高 -->
    <div class="flex items-center justify-center h-[64px]">
      <div v-if="menuStore.menuWidth  === '250px'" alt="" class=" h-[60px] rounded-lg" :src="blogSettingsStore.blogSettings.logo">
        <div class="flex items-center justify-center h-[60px]">
          <img alt="" class="h-[60px] rounded-lg" :src="blogSettingsStore.blogSettings.logo">
          <p class="text-white px-5 text-xl">{{ blogSettingsStore.blogSettings.name }}</p>
        </div>
      </div>
      <img v-else alt="" class="h-[60px] rounded-lg" :src="blogSettingsStore.blogSettings.logo">
    </div>

    <!-- 下方菜单 -->
    <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="defaultActive" @select="handleSelect">
      <template v-for="(item,index) in menus" :key="index">
        <el-menu-item :index="item.path">
          <el-icon>
            <!-- 动态图标 -->
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>

  </div>
</template>

<style>
/* 设置菜单栏的样式 */
.el-menu {
  /* 菜单栏背景色设置为深色主题 */
  background-color: rgb(30 41 59 / 1);
  /* 移除菜单栏右侧边框 */
  border-right: 0;
}

/* 设置子菜单标题的样式 */
.el-sub-menu__title {
  /* 子菜单标题颜色设置为白色，以提高在深色背景下的可读性 */
  color: #fff;
}

/* 设置子菜单标题悬停时的样式 */
.el-sub-menu__title:hover {
  /* 悬停时背景色略微变浅，以提供用户反馈 */
  background-color: #ffffff10;
}

/* 设置活动菜单项的样式 */
.el-menu-item.is-active {
  /* 活动菜单项背景色使用主题primary颜色，以突出显示选中项 */
  background-color: var(--el-color-primary);
  /* 文字颜色设置为白色，以提高对比度和可读性 */
  color: #fff;
}

/* 设置活动菜单项悬停时的样式 */
.el-menu-item.is-active:hover {
  /* 悬停时保持主题primary颜色背景，以确保选中项始终突出 */
  background-color: var(--el-color-primary);
}

/* 设置菜单项的样式 */
.el-menu-item {
  /* 菜单项颜色设置为白色，以适应深色背景 */
  color: #fff;
}

/* 设置菜单项悬停时的样式 */
.el-menu-item:hover {
  /* 悬停时背景色略微变浅，增强用户交互体验 */
  background-color: #ffffff10;
}

</style>

<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useMenuStore} from '@/stores/menu.js'
import {useBlogSettingsStore} from "@/stores/blogsettings.js";

// 引入博客设置信息 store
const blogSettingsStore = useBlogSettingsStore()

const route = useRoute();
const router = useRouter();

// 根据路由地址判断哪个菜单被选中
const defaultActive = ref(route.path)

// 菜单选择事件
const handleSelect = (path) => {
  router.push(path)
}

const menuStore = useMenuStore()

// 是否折叠
const isCollapse = computed(() => !(menuStore.menuWidth === '250px'))


const menus = [
  {
    'name': '仪表盘',
    'icon': 'Monitor',
    'path': '/admin/index'
  },
  {
    'name': '文章管理',
    'icon': 'Document',
    'path': '/admin/article/list',
  },
  {
    'name': '分类管理',
    'icon': 'FolderOpened',
    'path': '/admin/category/list',
  },
  {
    'name': '标签管理',
    'icon': 'PriceTag',
    'path': '/admin/tag/list',
  },
  {
    'name': '知识库管理',
    'icon': 'Collection',
    'path': '/admin/wiki/list',
  },
  {
    'name': '用户管理',
    'icon': 'User',
    'path': '/admin/user',
  },
  {
    'name': '角色管理',
    'icon': 'HomeFilled',
    'path': '/admin/role',
  },
  {
    'name': '文件管理',
    'icon': 'Files',
    'path': '/admin/file',
  },
  {
    'name': '博客设置',
    'icon': 'Setting',
    'path': '/admin/blog/setting',
  },
]
</script>
