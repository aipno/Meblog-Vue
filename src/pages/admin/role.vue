<template>
  <div>
    <!-- 角色信息卡片 -->
    <el-card class="mb-5" shadow="never">
      <template #header>
        <div class="flex items-center">
          <span>角色管理</span>
          <el-button class="ml-auto" type="primary" @click="addRole">
            <el-icon class="mr-1">
              <Plus/>
            </el-icon>
            添加角色
          </el-button>
        </div>
      </template>

      <el-table v-loading="tableLoading" :data="roleTableData" border stripe style="width: 100%">
        <el-table-column label="角色ID" prop="id" width="100"/>
        <el-table-column label="角色代码" prop="roleCode" width="200"/>
        <el-table-column label="角色名称" prop="roleName" width="200"/>
        <el-table-column label="描述" prop="description"/>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewRoleUsers(scope.row)">
              查看用户
            </el-button>
            <el-button size="small" @click="manageRolePermissions(scope.row)">
              <el-icon class="mr-1">
                <Setting/>
              </el-icon>
              权限管理
            </el-button>
            <el-button size="small" @click="editRole(scope.row)">
              <el-icon class="mr-1">
                <Edit/>
              </el-icon>
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色用户管理对话框 -->
    <el-dialog v-model="roleUsersDialogVisible" :title="getRoleDialogTitle" width="700px" @close="resetPermissionData">
      <el-table :data="roleUsers" border stripe style="width: 100%">
        <el-table-column label="用户ID" prop="userId" width="130"/>
        <el-table-column label="用户名" prop="username" width="180"/>
        <el-table-column label="昵称" prop="nickname" width="180"/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="changeUserRole(scope.row)">更改角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 角色权限管理对话框 -->
    <el-dialog v-model="rolePermissionDialogVisible" :title="getPermissionDialogTitle" width="800px"
               @close="resetPermissionData">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.roleName" disabled/>
        </el-form-item>

        <el-form-item label="权限设置">
          <el-tabs v-model="activePermissionTab" class="permission-tabs" stretch>
            <el-tab-pane
                v-for="(permissionGroup, index) in permissionGroups"
                :key="index"
                :label="permissionGroup.permissionParentName"
                :name="permissionGroup.permissionParentName"
            >
              <div class="border rounded p-4 mb-4 permission-tab-content">
                <el-checkbox
                    v-for="permission in permissionGroup.permissionList"
                    :key="permission.permissionId"
                    v-model="permission.status"
                    :label="permission.permissionName"
                    class="permission-checkbox"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rolePermissionDialogVisible = false">取消</el-button>
          <el-button :loading="permissionSaving" type="primary" @click="saveRolePermissions">保存权限</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更改用户角色对话框 -->
    <el-dialog v-model="changeUserRoleDialogVisible" title="更改用户角色" width="500px">
      <el-form :model="changeRoleForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="selectedUser.username" disabled/>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input v-model="currentRole.roleName" disabled/>
        </el-form-item>
        <el-form-item label="新角色">
          <el-select v-model="changeRoleForm.newRoleId" placeholder="请选择角色">
            <el-option
                v-for="role in roleTableData"
                :key="role.id"
                :label="role.roleName"
                :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changeUserRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmChangeUserRole">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog v-model="addRoleDialogVisible" :title="editingRole ? '编辑角色' : '添加角色'" width="500px">
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="100px">
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色代码"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" placeholder="请输入角色描述" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {Edit, Plus, Setting} from '@element-plus/icons-vue'
import {getUserList, updateUserRole} from '@/api/admin/user.js'
import {getRole, getRoleUserList, updateRolePermissions} from '@/api/admin/role.js'
import {getRolePermissionList} from '@/api/admin/permission.js'
import {showMessage} from '@/composables/utils'

// 表格加载 Loading
const tableLoading = ref(false)
// 角色表格数据
const roleTableData = ref([])

// 角色用户管理对话框显示控制
const roleUsersDialogVisible = ref(false)
// 角色权限管理对话框显示控制
const rolePermissionDialogVisible = ref(false)
// 添加/编辑角色对话框显示控制
const addRoleDialogVisible = ref(false)

// 当前查看的角色
const currentRole = ref({})

// 角色用户数据
const roleUsers = ref([])

// 计算属性: 用户对话框标题
const getRoleDialogTitle = computed(() => {
  const roleName = currentRole.value?.roleName || '未知角色'
  // 转义双引号以防止XSS风险
  const escapedRoleName = roleName.replace(/"/g, '&quot;')
  return `角色"${escapedRoleName}"的用户`
})

// 计算属性: 权限对话框标题
const getPermissionDialogTitle = computed(() => {
  const roleName = currentRole.value?.roleName || '未知角色'
  // 转义双引号以防止XSS风险
  const escapedRoleName = roleName.replace(/"/g, '&quot;')
  return `角色"${escapedRoleName}"权限管理`
})

// 更改用户角色对话框显示控制
const changeUserRoleDialogVisible = ref(false)
// 选中的用户
const selectedUser = ref({})

// 更改角色表单
const changeRoleForm = reactive({
  newRoleId: ''
})

// 所有用户
const allUsers = ref([])

// 权限标签页
const activePermissionTab = ref('文章管理')

// 权限组数据
const permissionGroups = ref([])

// 是否正在保存权限
const permissionSaving = ref(false)

// 是否正在编辑角色
const editingRole = ref(false)

// 角色表单
const roleForm = reactive({
  roleCode: '',
  roleName: '',
  description: ''
})

// 角色表单验证规则
const roleFormRules = {
  roleCode: [
    {required: true, message: '请输入角色代码', trigger: 'blur'}
  ],
  roleName: [
    {required: true, message: '请输入角色名称', trigger: 'blur'}
  ],
  description: [
    {required: true, message: '请输入角色描述', trigger: 'blur'}
  ]
}

// 表单引用
const roleFormRef = ref()

// 角色列表
const roleList = ref([])

// 获取所有用户
function getAllUsers() {
  tableLoading.value = true
  getUserList().then(res => {
    tableLoading.value = false
    allUsers.value = res.data
  })
}

// 获取角色列表
function getRoleList() {
  getRole().then(res => {
    roleList.value = res.data
    roleTableData.value = res.data
  })
}

// 查看角色用户
const viewRoleUsers = (role) => {
  currentRole.value = role
  // 调用接口获取角色下用户
  tableLoading.value = true
  getRoleUserList(role.id).then(res => {
    tableLoading.value = false
    roleUsers.value = res.data
    roleUsersDialogVisible.value = true
  }).catch(() => {
    tableLoading.value = false
  })
}

// 管理角色权限
const manageRolePermissions = (role) => {
  currentRole.value = role

  // 加载所有权限
  tableLoading.value = true
  getRolePermissionList(role.id).then((res) => {
    tableLoading.value = false

    // 设置所有权限
    permissionGroups.value = res.data

    // 设置当前角色的权限状态
    permissionGroups.value.forEach(permissionGroup => {
      permissionGroup.permissionList.forEach(permission => {
        // 使用响应式方式设置状态
        permission.status = reactive(permission.status)
      })
    })

    // 设置默认标签页为第一个非空的标签页
    const firstNonEmptyTab = permissionGroups.value.find(group => group.permissionList.length > 0)
    if (firstNonEmptyTab) {
      activePermissionTab.value = firstNonEmptyTab.permissionParentName
    }

    rolePermissionDialogVisible.value = true
  })
      .catch(() => {
        tableLoading.value = false
        showMessage('加载权限数据失败', 'error')
      })
}

// 重置权限数据
const resetPermissionData = () => {
  permissionGroups.value = []
  activePermissionTab.value = '文章管理'
}

// 保存角色权限
const saveRolePermissions = () => {
  // 收集选中的权限ID
  const selectedPermissionIds = []
  permissionGroups.value.forEach(permissionGroup => {
    permissionGroup.permissionList.forEach(permission => {
      if (permission.status) {
        selectedPermissionIds.push(permission.permissionId)
      }
    })
  })

  // 保存权限操作
  permissionSaving.value = true
  updateRolePermissions(currentRole.value.id, selectedPermissionIds)
      .then(() => {
        showMessage(`角色"${currentRole.value.roleName}"权限保存成功`, 'success')
        rolePermissionDialogVisible.value = false
      })
      .catch(() => {
        showMessage('权限保存失败', 'error')
      })
      .finally(() => {
        permissionSaving.value = false
      })
}

// 编辑角色
const editRole = (role) => {
  editingRole.value = true
  roleForm.roleCode = role.roleCode
  roleForm.roleName = role.roleName
  roleForm.description = role.description
  currentRole.value = role
  addRoleDialogVisible.value = true
}

// 添加角色
const addRole = () => {
  editingRole.value = false
  roleForm.roleCode = ''
  roleForm.roleName = ''
  roleForm.description = ''
  addRoleDialogVisible.value = true
}

// 保存角色
const saveRole = () => {
  roleFormRef.value.validate((valid) => {
    if (valid) {
      if (editingRole.value) {
        // 模拟编辑角色操作
        showMessage(`角色"${roleForm.roleName}"编辑成功`, 'success')
      } else {
        // 模拟添加角色操作
        showMessage(`角色"${roleForm.roleName}"添加成功`, 'success')
      }
      addRoleDialogVisible.value = false
      // 重新加载角色列表
      getRoleList()
    }
  })
}

// 更改用户角色
const changeUserRole = (user) => {
  selectedUser.value = user
  changeRoleForm.newRoleId = ''
  changeUserRoleDialogVisible.value = true
}

// 确认更改用户角色
const confirmChangeUserRole = () => {
  if (!changeRoleForm.newRoleId) {
    showMessage('请选择新角色', 'error')
    return
  }

  // 更改用户角色操作
  updateUserRole(selectedUser.value.username, changeRoleForm.newRoleId).then((res) => {
    showMessage(`用户"${selectedUser.value.username}"已更改到新角色`, 'success')
  })
      .catch(() => {
        showMessage('用户角色更改失败', 'error')
      })

  changeUserRoleDialogVisible.value = false

  // 重新加载当前角色用户
  viewRoleUsers(currentRole.value)
}

// 初始化加载数据
onMounted(() => {
  getAllUsers()
  getRoleList()
})
</script>

<style scoped>
.permission-tabs {
  width: 100%;
  min-height: 300px;
  height: auto;
}

.permission-tab-content {
  max-height: 300px;
  overflow-y: auto;
}

.permission-checkbox {
  margin-right: 15px;
  margin-bottom: 10px;
  min-width: 200px;
}

:deep(.el-tabs__header) {
  margin-bottom: 15px;
}

:deep(.el-tabs__nav-wrap)::after {
  height: 1px;
}

:deep(.el-tabs__item) {
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  transition: color 0.3s;
}

:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 15px;
}

:deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
  padding-right: 15px;
}

</style>