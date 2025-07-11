<template>
  <div class="layout-root">
    <header class="layout-header">
      <div class="logo">AI-Test 系统</div>
      <div class="header-right">
        <div class="user-info">欢迎，{{ username }}！</div>
        <el-button type="text" class="logout-btn" @click="logout">退出</el-button>
      </div>
    </header>
    <!-- 删除系统状态提示区域 -->
    <div class="layout-body">
      <!-- 恢复侧边栏导航 -->
      <aside class="layout-aside">
        <el-menu 
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item v-for="item in menus" :key="item.index" :index="item.index">
            {{ item.title }}
          </el-menu-item>
        </el-menu>
      </aside>
      <main class="layout-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-root {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f8f9fb;
  margin: 0; /* 添加：移除默认margin */
  padding: 0; /* 添加：移除默认padding */
}

/* 确保布局主体占满剩余空间 */
.layout-body {
  display: flex;
  flex: 1; /* 添加：占满剩余空间 */
  min-height: calc(100vh - 60px);
}

/* 主内容区添加溢出控制 */
.layout-main {
  flex: 1;
  padding: 20px 32px;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow-y: auto; /* 添加：内容溢出时显示滚动条 */
}
.layout-header {
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 修改为两端对齐 */
  height: 60px;
  font-size: 18px;
  padding: 0 32px;
  width: 100vw;
  box-sizing: border-box;
  border-radius: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.user-info {
  font-size: 14px;
}
.logout-btn {
  color: #fff;
}
/* 删除系统状态相关样式 */
/* .system-status {
  padding: 10px 32px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
} */

/* 调整布局主体高度计算 */
.layout-body {
  display: flex;
  min-height: calc(100vh - 60px); /* 修改：从120px改为60px（仅减去header高度） */
}
/* 删除或注释掉top-nav相关样式 */
/* .top-nav {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 32px;
} */

/* 恢复侧边栏样式 */
.layout-aside {
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  width: 200px;
  min-width: 180px;
  max-width: 220px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: calc(100vh - 60px); /* 修改：从120px改为60px */
}

/* 调整主内容区样式 */
.layout-main {
  flex: 1; /* 让主内容区占满剩余空间 */
  padding: 20px 32px;
  min-height: calc(100vh - 60px); /* 修改：从120px改为60px */
  box-sizing: border-box; /* 添加：确保padding不会增加总高度 */
}

/* 调整响应式样式 */
@media (max-width: 700px) {
  .layout-body {
    flex-direction: column;
  }
  .layout-aside {
    width: 100vw;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }
  .el-menu-vertical-demo {
    flex-direction: row;
  }
}
.layout-body {
  display: flex; /* 添加Flex布局 */
  min-height: calc(100vh - 120px); /* 确保有足够高度 */
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const username = ref('')
const activeMenu = ref('/')
const isMobile = ref(false)

const menus = ref([
  { index: '/', title: '首页' },
  { index: '/profile', title: '个人中心' },
  { index: '/network-management', title: '网络管理' }
])

function checkMobile() {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  username.value = localStorage.getItem('username') || '用户'
  setActiveMenu(route.path)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

watch(() => route.path, (val) => {
  setActiveMenu(val)
})

function setActiveMenu(path: string) {
  if (path === '/' || path === '') {
    activeMenu.value = '/'
  } else if (path.startsWith('/profile')) {
    activeMenu.value = '/profile'
  } else {
    activeMenu.value = path
  }
}

const handleMenuSelect = (index: string) => {
  router.push(index)
  activeMenu.value = index
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>