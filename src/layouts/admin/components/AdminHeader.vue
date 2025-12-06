<template>
  <!-- 固钉组件，通过设置 offset 属性来改变吸顶距离，默认值为 0。 -->
  <el-affix :offset="0">
    <!-- 设置背景色为白色、高度为 64px，padding-right 为 4， border-bottom 为 slate 100 -->
    <div class="bg-white h-[64px] flex pr-4 border-b border-slate-100">
      <!-- 左边栏收缩、展开-->
      <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200"
        @click="handleMenuWidth">
        <el-icon>
          <Fold v-if="menuStore.menuWidth === '250px'" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- 左边容器，通过 ml-auto 让其在父容器的右边 -->
      <div class="ml-auto flex">
        <!-- 点击跳转前台首页 -->
        <el-tooltip class="box-item" content="跳转前台" effect="dark" placement="bottom">
          <div class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-200"
            @click="router.push('/')">
            <el-icon>
              <Monitor />
            </el-icon>
          </div>
        </el-tooltip>

        <!-- 点击刷新页面 -->
        <el-tooltip class="box-item" content="刷新" effect="dark" placement="bottom">
          <div
            class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200"
            @click="handleRefresh">
            <el-icon>
              <Refresh />
            </el-icon>
          </div>
        </el-tooltip>

        <!-- 点击全屏展示 -->
        <el-tooltip class="box-item" content="全屏" effect="dark" placement="bottom">
          <div
            class="w-[42px] h-[64px] cursor-pointer flex items-center justify-center text-gray-700 mr-2 hover:bg-gray-200"
            @click="toggle">
            <el-icon>
              <FullScreen v-if="!isFullscreen" />
              <Aim v-else />
            </el-icon>
          </div>
        </el-tooltip>

        <!-- 登录用户头像 -->
        <el-dropdown class="flex items-center justify-center" @command="handleCommand">
          <span class="el-dropdown-link flex items-center justify-center text-gray-700 text-xs">
            <!--  用户头像 -->
            <el-avatar :size="25" class="me-2" :src="userInfo.avatar" />
            {{ userStore.userInfo.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>

          <template #dropdown>
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </template>
        </el-dropdown>

      </div>
    </div>
  </el-affix>

  <!-- 修改密码 -->
  <FormDialog ref="formDialogRef" destroyOnClose title="修改密码" @submit="onSubmit">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="用户名" label-width="120px" prop="username">
        <!-- 输入框组件 -->
        <el-input v-model="form.username" clearable disabled placeholder="请输入用户名" size="large" />
      </el-form-item>
      <el-form-item label="密码" label-width="120px" prop="password">
        <el-input v-model="form.password" clearable placeholder="请输入密码" show-password size="large" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" label-width="120px" prop="rePassword">
        <el-input v-model="form.rePassword" clearable placeholder="请确认密码" show-password size="large" type="password" />
      </el-form-item>
    </el-form>
  </FormDialog>
</template>

<style scoped></style>


<script setup>
import { Aim, ArrowDown, Expand, Fold, FullScreen, Monitor, Refresh } from "@element-plus/icons-vue";
import { useMenuStore } from '@/stores/menu.js'
import { reactive, ref, watch } from "vue";
import FormDialog from "@/components/FormDialog.vue";
// 引入 useFullscreen
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { useRouter } from "vue-router";
import { showMessage, showModel } from "@/composables/utils.js";
import { getUserInfo, updateAdminPassword } from "@/api/admin/user.js";

// 引入了菜单 store
const menuStore = useMenuStore()

// icon 点击事件
const handleMenuWidth = () => {
  // 动态设置菜单的宽度大小
  menuStore.handleMenuWidth()
}

// isFullscreen 表示当前是否处于全屏；toggle 用于动态切换全屏、非全屏
const { isFullscreen, toggle } = useFullscreen()

// 引入了用户 Store
const userStore = useUserStore()
// 引入路由
const router = useRouter()

// 对话框是否显示
const formDialogRef = ref(null)

// 下拉菜单事件处理
const handleCommand = (command) => {
  // 更新密码
  if (command === 'updatePassword') {
    // 显示修改密码对话框
    formDialogRef.value.open()
  } else if (command === 'logout') { // 退出登录
    logout()
  }
}

// 退出登录
function logout() {
  showModel('是否确认要退出登录？').then(() => {
    userStore.logout()
    showMessage('退出登录成功！')
    // 跳转登录页
    router.push('/login')
  })
}

// 表单引用
const formRef = ref(null)

// 修改用户密码表单对象
const form = reactive({
  username: userStore.userInfo.username || '',
  password: '',
  rePassword: ''
})

const onSubmit = () => {
  // 先验证 form 表单字段
  formRef.value.validate((valid) => {
    if (!valid) {
      console.log('表单验证不通过')
      return false
    }

    if (form.password !== form.rePassword) {
      showMessage('两次密码输入不一致，请检查！', 'warning')
      return
    }

    // 调用修改用户密码接口
    updateAdminPassword(form).then((res) => {
      console.log(res)
      // 判断是否成功
      if (res.success === true) {
        showMessage('密码重置成功，请重新登录！')
        // 退出登录
        userStore.logout()

        // 隐藏对话框
        formDialogRef.value.close()

        // 跳转登录页
        router.push('/login')
      } else {
        // 获取服务端返回的错误消息
        let message = res.message
        // 提示消息
        showMessage(message, 'error')
      }
    }).finally(() => formDialogRef.value.closeBtnLoading())
  })
}

// 规则校验
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
  rePassword: [
    {
      required: true,
      message: '确认密码不能为空',
      trigger: 'blur',
    },
  ]
}

// 刷新页面
const handleRefresh = () => {
  location.reload()
}

// 获取用户信息
const userInfo = ref({})
getUserInfo().then(res => {
  userInfo.value = res.data
})

// 监听 Pinia store 中的某个值的变化
watch(() => userStore.userInfo.username, (newValue, oldValue) => {
  // 在这里处理变化后的值
  console.log('新值:', newValue);
  console.log('旧值:', oldValue);

  // 可以在这里执行任何你需要的逻辑
  // 重新将新的值，设置会 form 对象中
  form.username = newValue
});
</script>
