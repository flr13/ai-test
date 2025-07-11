<template>
  <div class="content-container">
    <div class="standard-card">
      <h2 class="page-title">网络设备管理</h2>
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="输入设备名称或OMC名称搜索" style="width: 300px; margin-right: 10px;"></el-input>
        <el-button type="primary" @click="fetchDevices">搜索</el-button>
        <el-button type="success" @click="openAddDialog">新增设备</el-button>
      </div>

      <el-table :data="devices" style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="business" label="业务类型"></el-table-column>
        <el-table-column prop="manufacturer" label="厂商"></el-table-column>
        <el-table-column prop="resourceId" label="资源ID"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="omcId" label="OMC ID"></el-table-column>
        <el-table-column prop="omcName" label="OMC名称"></el-table-column>
        <el-table-column prop="collectionPort" label="采集端口"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteDevice(scope.row.index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" style="margin-top: 10px; text-align: right;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>

      <!-- 新增/编辑设备对话框 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="业务类型" prop="business">
            <el-input v-model="form.business"></el-input>
          </el-form-item>
          <el-form-item label="厂商" prop="manufacturer">
            <el-input v-model="form.manufacturer"></el-input>
          </el-form-item>
          <el-form-item label="资源ID" prop="resourceId">
            <el-input v-model="form.resourceId"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status">
              <el-option label="启用" value="启用"></el-option>
              <el-option label="停用" value="停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="OMC ID">
            <el-input v-model="form.omcId"></el-input>
          </el-form-item>
          <el-form-item label="OMC名称">
            <el-input v-model="form.omcName"></el-input>
          </el-form-item>
          <el-form-item label="采集端口">
            <el-input v-model="form.collectionPort"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDevice">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>

<script setup lang="ts">
// Remove the unused defineComponent import
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
// Add missing Element Plus component imports
import { ElMessage, ElMessageBox } from 'element-plus';

const devices = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');
const dialogVisible = ref(false);
const dialogTitle = ref('新增设备');
const form = ref({
  business: '',
  manufacturer: '',
  resourceId: '',
  status: '启用',
  omcId: '',
  omcName: '',
  collectionPort: ''
});
const editingIndex = ref(null);

// 获取设备列表
const fetchDevices = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/network-devices', {
      params: {
        name: searchQuery.value,
        page: currentPage.value,
        limit: pageSize.value
      }
    });
    devices.value = response.data.data.devices;
    total.value = response.data.data.total;
  } catch (error) {
    console.error('获取设备列表失败:', error);
    ElMessage.error('获取设备列表失败');
  }
};

// 新增设备
const openAddDialog = () => {
  dialogTitle.value = '新增设备';
  form.value = {
    business: '',
    manufacturer: '',
    resourceId: '',
    status: '启用',
    omcId: '',
    omcName: '',
    collectionPort: ''
  };
  editingIndex.value = null;
  dialogVisible.value = true;
};

// 编辑设备
const openEditDialog = (device) => {
  dialogTitle.value = '编辑设备';
  form.value = { ...device };
  editingIndex.value = device.index;
  dialogVisible.value = true;
};

// 添加表单验证规则
const rules = ref({
  business: [{ required: true, message: '请输入业务类型', trigger: 'blur' }],
  manufacturer: [{ required: true, message: '请输入厂商', trigger: 'blur' }],
  resourceId: [{ required: true, message: '请输入资源ID', trigger: 'blur' }],
  omcId: [{ required: true, message: '请输入OMC ID', trigger: 'blur' }],
  collectionPort: [{ required: true, message: '请输入采集端口', trigger: 'blur' }]
});

// 获取表单实例
const formRef = ref(null);
const { proxy } = getCurrentInstance();

// 修改保存设备方法
const saveDevice = async () => {
  try {
    // 表单验证
    await proxy.$refs.formRef.validate();
    
    if (editingIndex.value !== null) {
      // 更新设备
      await axios.put(`http://localhost:3001/api/network-devices/${editingIndex.value}`, form.value);
      ElMessage.success('设备更新成功');
    } else {
      // 新增设备
      const response = await axios.post('http://localhost:3001/api/network-devices', form.value);
      ElMessage.success('设备添加成功');
    }
    dialogVisible.value = false;
    fetchDevices();
  } catch (error) {
    if (error.name === 'Error') {
      // 表单验证失败
      return;
    }
    console.error('保存设备失败:', error.response || error);
    // 显示更详细的错误信息
    ElMessage.error(`保存失败: ${error.response?.data?.message || error.message || '未知错误'}`);
  }
};

// 删除设备
const deleteDevice = async (index) => {
  try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await axios.delete(`http://localhost:3001/api/network-devices/${index}`);
    ElMessage.success('设备删除成功');
    fetchDevices();
  } catch (error) {
    if (error.name !== 'Error') {
      console.error('删除设备失败:', error);
      ElMessage.error('删除设备失败');
    }
  }
};

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchDevices();
};

onMounted(() => {
  fetchDevices();
});
</script>