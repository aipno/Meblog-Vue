<script setup>
import {ref, onMounted, reactive} from 'vue'
import {getUserList, updateUserStatus} from "@/api/admin/user.js";
import {showMessage} from '@/composables/utils'

// 表格加载 Loading
const tableLoading = ref(false)
// 表格数据
const tableData = ref([])

function getAllUsers() {
  tableLoading.value = true
  getUserList().then(res => {
    tableLoading.value = false
    tableData.value = res.data
  })
}

// 更改用户状态
function changeUserStatus(user, status) {
  updateUserStatus(user.id, status).then(res => {
    if (res.success) {
      showMessage(`用户已${status === 1 ? '启用' : '禁用'}`)
      console.log(user.id, status)
      // 更新本地数据状态
      user.status = status
    } else {
      showMessage(res.message || `用户${status === 1 ? '启用' : '禁用'}失败`, 'error')
    }
  })
}

// 初始化加载数据
onMounted(() => {
  getAllUsers()
})
</script>

<template>
  <div>
    <!-- 用户信息卡片 -->
    <el-card class="mb-5" shadow="never">
      <template #header>
        <div class="flex items-center">
          <span>用户信息</span>
        </div>
      </template>

      <el-table v-loading="tableLoading" :data="tableData" border stripe style="width: 100%">
        <el-table-column label="用户ID" prop="id" width="100"/>
        <el-table-column label="用户名" prop="username" width="200"/>
        <el-table-column label="昵称" prop="nickname" width="200"/>
        <el-table-column label="创建时间" prop="createTime" width="200"/>
        <el-table-column label="用户状态" prop="status" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
                v-if="scope.row.status === 0"
                type="success"
                size="small"
                @click="changeUserStatus(scope.row, 1)">
              启用该用户
            </el-button>
            <el-button
                v-else
                type="danger"
                size="small"
                @click="changeUserStatus(scope.row, 0)">
              禁用该用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
/* 可以添加一些自定义样式 */
</style>