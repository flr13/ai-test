<template>
  <div class="content-container">
    <div class="standard-card">
      <h2 class="page-title">首页内容区域</h2>
      <!-- 原有统计卡片内容保持不变 -->
      <div class="stats-grid">
        <el-card class="stat-card">
          <div class="stat-title">设备总数</div>
          <div class="stat-value">24</div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-title">在线设备</div>
          <div class="stat-value">20</div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-title">告警数量</div>
          <div class="stat-value">3</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 删除原有 .welcome-container 和 .content-section 样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.stat-card {
  text-align: center;
}
.stat-title {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}
.welcome-center {
  /* 线性渐变背景 - 从蓝色到浅蓝色 */
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>