/*
 * @Author: 吴莉蓉 wulr@eastcom-sw.com
 * @Date: 2025-07-10 17:05:08
 * @LastEditors: 吴莉蓉 wulr@eastcom-sw.com
 * @LastEditTime: 2025-07-11 10:29:11
 * @FilePath: \ai-test\server\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 模拟用户数据
const users = [
  { username: 'admin', password: '123456' }
];

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // 简单返回一个 token
    res.json({ success: true, token: 'mock-token-123', username });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 模拟网络设备数据
// 修复变量名错误并添加CRUD接口
const networkDevices = [
  { index: 1, business: '核心网', manufacturer: '华为', resourceId: 'resource001', status: '启用', omcId: '48119', omcName: '广州VIVO_OMC', collectionPort: '22' },
  { index: 2, business: '核心网', manufacturer: '华为', resourceId: 'resource002', status: '启用', omcId: '48119', omcName: '广州VIVO_OMC', collectionPort: '22' },
  { index: 3, business: '核心网', manufacturer: '华为', resourceId: 'resource003', status: '停用', omcId: '48211', omcName: '广州VIVO_OMC3', collectionPort: '22' },
  { index: 4, business: '核心网', manufacturer: '华为', resourceId: 'resource004', status: '启用', omcId: '48222', omcName: '广州VIVO_OMC4', collectionPort: '22' }
];

// 获取网络设备列表接口 - 修复变量名错误
app.get('/api/network-devices', (req, res) => {
  const { name, ip, page = 1, limit = 10 } = req.query;
  let filteredDevices = [...networkDevices]; // 修复变量名从mockNetworkDevices为networkDevices

  // 筛选逻辑
  if (name) {
    filteredDevices = filteredDevices.filter(device => 
      device.resourceId.toLowerCase().includes(name.toLowerCase()) ||
      device.omcName.toLowerCase().includes(name.toLowerCase())
    );
  }

  // 分页逻辑
  const total = filteredDevices.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const devices = filteredDevices.slice(startIndex, endIndex);

  res.json({
    code: 200,
    data: {
      devices,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

// 新增设备接口
// 新增设备接口
app.post('/api/network-devices', (req, res) => {
  try {
    const newDevice = req.body;
    
    // 基本数据验证
    const requiredFields = ['business', 'manufacturer', 'resourceId', 'omcId', 'collectionPort'];
    const missingFields = requiredFields.filter(field => !newDevice[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: `缺少必填字段: ${missingFields.join(', ')}`
      });
    }

    // 生成新的index
    newDevice.index = networkDevices.length > 0 ? Math.max(...networkDevices.map(d => d.index)) + 1 : 1;
    networkDevices.push(newDevice);
    res.json({
      code: 200,
      message: '设备添加成功',
      data: newDevice
    });
  } catch (error) {
    console.error('新增设备错误:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误，新增设备失败'
    });
  }
});

// 更新设备接口
app.put('/api/network-devices/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const updatedDevice = req.body;
  const deviceIndex = networkDevices.findIndex(d => d.index === index);

  if (deviceIndex === -1) {
    return res.status(404).json({ code: 404, message: '设备不存在' });
  }

  networkDevices[deviceIndex] = { ...networkDevices[deviceIndex], ...updatedDevice };
  res.json({
    code: 200,
    message: '设备更新成功',
    data: networkDevices[deviceIndex]
  });
});

// 删除设备接口
app.delete('/api/network-devices/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const deviceIndex = networkDevices.findIndex(d => d.index === index);

  if (deviceIndex === -1) {
    return res.status(404).json({ code: 404, message: '设备不存在' });
  }

  networkDevices.splice(deviceIndex, 1);
  res.json({
    code: 200,
    message: '设备删除成功'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});