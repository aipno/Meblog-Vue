<template>
  <div class="no-permission-container">
    <!-- 装饰性图标 -->
    <div class="icon-wrapper">
      <svg class="lock-icon" viewBox="0 0 24 24">
        <path d="M12 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm5-8.5V6c0-2.76-2.24-5-5-5S7 3.24 7 6v3H6v12h12V9h-1zM8.8 6c0-1.71 1.39-3.1 3.2-3.1s3.2 1.39 3.2 3.1v3H8.8V6z"/>
      </svg>
    </div>

    <!-- 提示信息 -->
    <div class="content-wrapper">
      <h1 class="title">无访问权限</h1>
      <p class="description">
        {{ message || '您暂时没有权限访问此页面' }}<br>
        <template v-if="requiredPermission">
          需要权限：<span class="permission-tag">{{ requiredPermission }}</span>
        </template>
      </p>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="goBack" icon="ArrowLeft">
          返回上一页
        </el-button>
        <el-button @click="goHome" icon="House">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  message: String,          // 自定义提示信息
  requiredPermission: String, // 需要的权限标识
  showContact: {            // 是否显示联系按钮
    type: Boolean,
    default: true
  }
})

const router = useRouter()

const goBack = () => router.go(-1)
const goHome = () => router.push('/')
</script>

<style scoped>
.no-permission-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}

.icon-wrapper {
  margin-right: 4rem;
}

.lock-icon {
  width: 120px;
  height: 120px;
  fill: #909399;
}

.content-wrapper {
  max-width: 500px;
}

.title {
  color: #303133;
  font-size: 24px;
  margin-bottom: 1rem;
}

.description {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.permission-tag {
  display: inline-block;
  padding: 0.2em 0.6em;
  background-color: #f4f4f5;
  border-radius: 4px;
  color: #909399;
  font-size: 0.9em;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .no-permission-container {
    flex-direction: column;
    text-align: center;
  }

  .icon-wrapper {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .action-buttons {
    justify-content: center;
  }
}
</style>