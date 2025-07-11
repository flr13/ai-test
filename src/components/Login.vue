<template>
  <div class="login-bg">
    <div class="login-center">
      <div class="login-card login-card-right">
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="登录" name="login">
            <el-form :model="form" :rules="rules" ref="loginFormRef" label-width="0" class="login-form" @submit.prevent="handleLogin">
              <el-form-item prop="username">
                <el-input v-model="form.username" placeholder="请输入账号" size="large" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLogin" :loading="loading" size="large" style="width:100%">立即登录</el-button>
              </el-form-item>
              <div class="login-form-footer">
                <el-checkbox v-model="remember">记住密码</el-checkbox>
                <a class="forgot" href="#">忘记密码?</a>
              </div>
              <el-alert v-if="error" :title="error" type="error" show-icon class="login-error" />
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <div class="register-placeholder">注册功能暂未开放</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const error = ref('')
const activeTab = ref('login')
const remember = ref(false)

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  error.value = ''
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        if (remember.value) {
          localStorage.setItem('remember', '1')
        } else {
          localStorage.removeItem('remember')
        }
        ElMessage.success('登录成功')
        router.push('/')
      } else {
        error.value = data.message || '登录失败'
      }
    } catch (e) {
      error.value = '网络错误'
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
:global(html, body, #app) {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.login-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80') center center/cover no-repeat fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.login-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 380px;
  min-height: 420px;
  margin: 0;
  z-index: 1;
}
.login-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10);
  padding: 48px 40px;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 340px;
  box-sizing: border-box;
}
.login-card-right {
  width: 100%;
  background: #fff;
  color: #222;
  align-items: center;
}
.login-tabs {
  width: 100%;
}
.login-form {
  margin-top: 24px;
}
.login-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}
.forgot {
  color: #409eff;
  text-decoration: none;
  margin-left: 8px;
}
.login-error {
  margin-top: 10px;
}
.register-placeholder {
  text-align: center;
  color: #bbb;
  padding: 40px 0;
}
@media (max-width: 600px) {
  .login-center {
    padding: 0 4vw;
    margin: 0;
    width: 100vw;
    max-width: 100vw;
  }
  .login-card {
    padding: 24px 8px;
    min-height: 320px;
    max-width: 98vw;
  }
}
</style> 