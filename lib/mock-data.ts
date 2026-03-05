// Mock data generators for BMS demo

export interface AlarmData {
  id: string
  type: 'warning' | 'alarm' | 'info'
  module: string
  message: string
  time: string
  active: boolean
}

export interface EnergyData {
  timestamp: string
  electricity: number
  heat: number
  water: number
}

export interface SystemStatus {
  module: string
  status: 'normal' | 'warning' | 'alarm' | 'offline'
  value: string
  unit: string
}

export interface RoomData {
  id: string
  name: string
  temperature: number
  humidity: number
  co2: number
  occupancy: number
  lighting: number
}

// Generate mock alarms
export function generateAlarms(count: number = 10): AlarmData[] {
  const alarmTypes = [
    { type: 'alarm' as const, module: '供暖系统', message: '供水温度异常 (78°C)' },
    { type: 'warning' as const, module: '通风系统', message: '过滤器需要更换' },
    { type: 'warning' as const, module: '空调系统', message: '能耗高于阈值' },
    { type: 'info' as const, module: '照明系统', message: '自动模式已启用' },
    { type: 'alarm' as const, module: '能耗监测', message: '电表读数异常' },
    { type: 'warning' as const, module: '遮阳系统', message: '西侧百叶窗卡滞' },
    { type: 'info' as const, module: '系统', message: '自动备份完成' },
    { type: 'alarm' as const, module: '接口管理', message: 'BACnet 连接中断' },
  ]

  const alarms: AlarmData[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const alarm = alarmTypes[i % alarmTypes.length]
    alarms.push({
      id: `A${String(i + 1).padStart(4, '0')}`,
      ...alarm,
      time: new Date(now - i * 30 * 60 * 1000).toLocaleString('zh-CN'),
      active: i < 3
    })
  }

  return alarms
}

// Generate mock energy data (last 24 hours)
export function generateEnergyData(): EnergyData[] {
  const data: EnergyData[] = []
  const now = Date.now()

  for (let i = 24; i >= 0; i--) {
    const hour = new Date(now - i * 60 * 60 * 1000)
    data.push({
      timestamp: hour.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      electricity: Math.round(50 + Math.random() * 100 + (i === 0 ? 50 : 0)),
      heat: Math.round(30 + Math.random() * 50),
      water: Math.round(10 + Math.random() * 20),
    })
  }

  return data
}

// Generate system status
export function generateSystemStatus(): SystemStatus[] {
  return [
    { module: '数据采集', status: 'normal', value: '245', unit: '点位' },
    { module: '供暖控制', status: 'warning', value: '78', unit: '°C' },
    { module: '通风控制', status: 'normal', value: '3200', unit: 'm³/h' },
    { module: '空调系统', status: 'alarm', value: '24.5', unit: '°C' },
    { module: '照明控制', status: 'normal', value: '86', unit: '%' },
    { module: '遮阳控制', status: 'normal', value: '12', unit: '/' },
    { module: '能耗监测', status: 'normal', value: '142', unit: 'kW' },
    { module: '报警管理', status: 'warning', value: '3', unit: '条' },
    { module: '接口管理', status: 'alarm', value: '2/3', unit: '在线' },
    { module: '系统运行', status: 'normal', value: '247', unit: '天' },
  ]
}

// Generate room data
export function generateRoomData(): RoomData[] {
  return [
    { id: 'R001', name: '会议室 A101', temperature: 23.5, humidity: 45, co2: 520, occupancy: 8, lighting: 85 },
    { id: 'R002', name: '办公室 B203', temperature: 24.2, humidity: 48, co2: 680, occupancy: 4, lighting: 92 },
    { id: 'R003', name: '大厅 C001', temperature: 22.8, humidity: 42, co2: 380, occupancy: 15, lighting: 100 },
    { id: 'R004', name: '服务器室 D104', temperature: 21.5, humidity: 38, co2: 420, occupancy: 0, lighting: 60 },
    { id: 'R005', name: '培训室 E201', temperature: 24.8, humidity: 50, co2: 750, occupancy: 20, lighting: 95 },
  ]
}

// Generate trend data (last 7 days)
export function generateTrendData(metric: 'temperature' | 'energy' | 'co2') {
  const data = []
  const now = Date.now()
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    let value

    if (metric === 'temperature') {
      value = Number((22 + Math.random() * 3).toFixed(1))
    } else if (metric === 'energy') {
      value = Math.round(1200 + Math.random() * 400)
    } else {
      value = Math.round(400 + Math.random() * 400)
    }

    data.push({
      date: days[date.getDay()],
      value
    })
  }

  return data
}

// Generate device list
export interface DeviceData {
  id: string
  name: string
  type: string
  location: string
  status: 'online' | 'offline' | 'maintenance'
  lastUpdate: string
}

export function generateDevices(): DeviceData[] {
  const deviceTypes = ['温度传感器', '湿度传感器', 'CO2传感器', '压力传感器', '流量传感器']
  const locations = ['A101', 'B203', 'C001', 'D104', 'E201', 'F305', 'G402']

  return Array.from({ length: 15 }, (_, i) => ({
    id: `DEV${String(i + 1).padStart(3, '0')}`,
    name: `${deviceTypes[i % deviceTypes.length]} ${i + 1}`,
    type: deviceTypes[i % deviceTypes.length],
    location: locations[i % locations.length],
    status: ['online', 'online', 'online', 'offline', 'maintenance'][i % 5] as DeviceData['status'],
    lastUpdate: new Date(Date.now() - i * 5 * 60 * 1000).toLocaleString('zh-CN'),
  }))
}
