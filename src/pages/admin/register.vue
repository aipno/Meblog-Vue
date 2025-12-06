<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400  p-4">
    <el-card class="w-full max-w-md rounded-xl shadow-2xl bg-white/90 backdrop-blur-lg">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">用户注册</h2>
      </div>

      <el-form ref="formRef" :model="registerForm" :rules="registerRules" label-width="80px" class="space-y-4">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable class="rounded-lg" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password
            class="rounded-lg" />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password
            class="rounded-lg" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" clearable class="rounded-lg" />
        </el-form-item>

        <el-form-item :inline="true" label="验证码" prop="code" class="code-item">
          <el-input v-model="registerForm.code" placeholder="请输入验证码" clearable class="rounded-lg flex-grow mr-2" />
          <el-button 
            :disabled="countdown > 0" 
            type="primary" 
            @click="getCode"
            class="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md text-white font-bold"
          >
            {{ countdown > 0 ? countdown + '秒后重新获取' : '获取验证码' }}
          </el-button>
        </el-form-item>

        <el-form-item class="mt-6 flex justify-between space-x-4">
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleRegister" 
            class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-lg font-bold text-white flex items-center justify-center"
          >
            <span v-if="!loading">注册</span>
          </el-button>
          <el-button 
            @click="resetForm" 
            class="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 font-bold flex items-center justify-center"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <div class="text-center mt-6 text-gray-600">
        已有账号？
        <el-link type="primary" @click="goToLogin" class="font-medium hover:underline">
          立即登录
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { showMessage } from '@/composables/utils'
import { useRouter } from 'vue-router'
import { getEmailCode } from '@/api/admin/email'
import { register } from '@/api/admin/user'

const router = useRouter()

// 表单引用
const formRef = ref(null)

// 表单数据模型
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  code: '',
})

const loading = ref(false)

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '用户名长度必须在 3 到 10 个字符', trigger: 'blur' },
  ],
  password: [
    { min: 6, max: 12, message: '密码长度必须在 6 到 12 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { min: 6, max: 12, message: '密码长度必须在 6 到 12 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
}

// 倒计时
const countdown = ref(0);
// 定时器
const timer = ref(null);

// 获取验证码
const getCode = () => {
  getEmailCode({
    email: registerForm.email
  }).then(res => {
    if (res.success === true) {
      showMessage('验证码已发送')
    } else {
      showMessage('验证码发送失败','error')
    }
  }).catch(err => {
    showMessage('验证码发送失败','error')
  })

  // 禁用按钮并启动倒计时
  countdown.value = 60;
  timer.value = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      countdown.value = 0;
    }
  }, 1000);
}

// 注册功能
const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 调用注册接口
      register(registerForm).then(res => {
        if (res.success === true) {
          loading.value = false
          showMessage('注册成功！')
          // 注册成功后跳转到登录页面
          router.push('/admin/login')
        } else {
          loading.value = false
          showMessage('注册失败','error')
        }
      }).catch(err => {
        loading.value = false
        showMessage('注册失败','error')
      })
    } else {
      showMessage('请检查表单填写是否正确','error')
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}

// 跳转登录页
const goToLogin = () => {
  router.push('/admin/login')
}
// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
/* 移除了旧的样式，使用Tailwind CSS类来实现样式 */

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #4b5563;
  /* Tailwind gray-600 */
}

:deep(.el-input__inner) {
  border-radius: 0.5rem;
  /* Tailwind rounded-lg */
  border-color: #d1d5db;
  /* Tailwind gray-300 */
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
}

:deep(.el-input__inner:focus) {
  border-color: #3b82f6;
  /* Tailwind blue-500 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

:deep(.el-button) {
  border-radius: 0.5rem;
  /* Tailwind rounded-lg */
  padding: 0.5rem 1rem;
  font-weight: 500;
}

/* 验证码区域样式 */
.code-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

.code-item :deep(.el-input) {
  flex: 1;
  margin-right: 0.5rem;
  /* Tailwind mr-2 */
}
</style>