<template>
  <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="destroyOnClose"
      :draggable="true"
      :title="title"
      :width="width"
      align-center
      class="meblog-dialog"
  >
    <!-- 内容区域 -->
    <div class="dialog-content">
      <slot></slot>
    </div>

    <!-- 底部操作栏 -->
    <template #footer>
      <div class="dialog-footer flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <el-button v-if="showCancel" @click="close">{{ cancelText }}</el-button>
        <el-button v-if="showConfirm" :loading="btnLoading" type="primary" @click="submit">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from 'vue'

// 对外暴露的属性值
const props = defineProps({
  title: String,
  width: {
    type: [String, Number],
    default: '40%'
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '提交'
  },
  cancelText: { // 新增：自定义取消按钮文字
    type: String,
    default: '取消'
  },
  showCancel: { // 新增：是否显示取消按钮
    type: Boolean,
    default: true
  },
  showConfirm: { // 新增：是否显示确认按钮
    type: Boolean,
    default: true
  }
})

const dialogVisible = ref(false)
const btnLoading = ref(false)

const showBtnLoading = () => btnLoading.value = true
const closeBtnLoading = () => btnLoading.value = false

const open = () => dialogVisible.value = true
const close = () => dialogVisible.value = false

const emit = defineEmits(['submit'])
const submit = () => emit('submit')

defineExpose({
  open,
  close,
  showBtnLoading,
  closeBtnLoading
})
</script>

<style scoped>
/* 深度选择器覆盖 Element Plus 样式 */
:deep(.meblog-dialog) {
  border-radius: 1rem; /* rounded-2xl */
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
}

/* 头部样式 */
:deep(.meblog-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 1.25rem 1.5rem; /* p-5 */
  border-bottom: 1px solid #f3f4f6; /* border-gray-100 */
}

:deep(.dark .meblog-dialog .el-dialog__header) {
  border-bottom-color: #374151; /* dark:border-gray-700 */
}

:deep(.meblog-dialog .el-dialog__title) {
  font-weight: 600;
  color: #1f2937; /* text-gray-800 */
}

:deep(.dark .meblog-dialog .el-dialog__title) {
  color: #f3f4f6; /* dark:text-gray-100 */
}

/* 内容区域样式 */
:deep(.meblog-dialog .el-dialog__body) {
  padding: 1.5rem; /* p-6 */
}

/* 底部样式 */
:deep(.meblog-dialog .el-dialog__footer) {
  padding: 0 1.5rem 1.25rem 1.5rem;
}

/* 移动端响应式适配 */
@media (max-width: 640px) {
  :deep(.meblog-dialog) {
    width: 90% !important; /* 在小屏幕上强制宽度为 90% */
  }
}
</style>