<script setup>
import AdminFooter from "@/layouts/admin/components/AdminFooter.vue";
import AdminHeader from "@/layouts/admin/components/AdminHeader.vue";
import AdminMenu from "@/layouts/admin/components/AdminMenu.vue";
import AdminTagList from "@/layouts/admin/components/AdminTagList.vue";

import { useMenuStore } from "@/stores/menu.js";
import { onMounted } from 'vue';

const menuStore = useMenuStore();

onMounted(() => {
  // 移除 html 标签中的 class="dark"
  document.documentElement.classList.remove('dark');
})
</script>

<template>
  <!-- 外层容器 -->
  <el-container class="min-h-screen flex flex-col"> <!-- min-h-screen：确保容器至少占满整个屏幕高度-->
    <!-- 左侧导航栏 -->
    <el-aside :width="menuStore.menuWidth" class="transition-all">
      <AdminMenu/>
    </el-aside>

    <el-container class="flex flex-col flex-grow"> <!-- flex flex-col：使用Flexbox垂直布局 flex-grow：使主内容区域占据所有可用空间 -->
      <!-- 顶栏容器 -->
      <el-header>
        <AdminHeader/>
      </el-header>

      <el-main class="flex-grow">
        <!-- 标签导航栏-->
        <AdminTagList/>

        <!-- 主内容（根据路由动态展示不同页面） -->
        <router-view v-slot="{ Component }">
          <Transition name="fade">
            <!-- max 指定最多缓存 10 个组件 -->
            <div>
              <KeepAlive :max="10">
                <component :is="Component"></component>
              </KeepAlive>
            </div>
          </Transition>
        </router-view>
      </el-main>

      <!-- 底栏容器 -->
      <el-footer class="flex-shrink-0"> <!-- flex-shrink-0：防止footer被压缩 -->
        <AdminFooter/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  padding: 0!important;
}
.el-footer {
  padding: 0!important;
}

/* 内容区域过渡动画：淡入淡出效果 */
/* 刚开始进入时 */
.fade-enter-from {
  /* 透明度 */
  opacity: 0;
}

/* 刚开始结束 */
.fade-enter-to {
  opacity: 1;
}

/* 刚开始离开 */
.fade-leave-from {
  opacity: 1;
}

/* 离开已结束 */
.fade-leave-to {
  opacity: 0;
}

/* 离开进行中 */
.fade-leave-active {
  transition: all 0.3s;
}

/* 进入进行中 */
.fade-enter-active {
  transition: all 0.3s;
  transition-delay: 0.3s;
}
</style>