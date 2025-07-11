<template>
  <div class="content-container">
    <div class="standard-card">
      <h2 class="page-title">个人中心</h2>
      <p class="desc">这里是个人中心页面内容示例。</p>
      <el-descriptions title="用户信息" :column="1" border>
        <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
        <el-descriptions-item label="角色">普通用户</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || '用户'
})
</script>

<style scoped>
/* 删除原有 .profile-card 样式 */
.desc {
  color: #666;
  margin-bottom: 18px;
}
@media (max-width: 600px) {
  .profile-card {
    padding: 18px 4px 16px 4px;
    max-width: 98vw;
  }
}
</style>