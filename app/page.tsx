'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState, useMemo } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Badge, Descriptions, message } from 'antd'
import {
  AlertOutlined, ThunderboltOutlined, TeamOutlined, ClockCircleOutlined,
  ExportOutlined, ReloadOutlined, SettingOutlined, CheckCircleOutlined,
  WarningOutlined, HomeOutlined
} from '@ant-design/icons'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genEnergy() {
  return Array.from({ length: 24 }, (_, i) => {
    const workHour = i >= 7 && i <= 19
    const peakHour = i >= 9 && i <= 17
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      elec: Math.round(38 + (workHour ? 45 : 0) + (peakHour ? 22 : 0) + (Math.random() - 0.5) * 12),
      heat: Math.round(25 + (i < 7 || i > 20 ? 18 : 8) + (Math.random() - 0.5) * 6),
      water: Math.round(1.2 + (workHour ? 3.5 : 0.3) + (Math.random() - 0.5) * 0.8),
    }
  })
}

function genWeekly() {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  return days.map((d, i) => ({
    day: d,
    thisWeek: Math.round(i < 5 ? 920 + Math.random() * 180 : 280 + Math.random() * 120),
    lastWeek: Math.round(i < 5 ? 960 + Math.random() * 200 : 310 + Math.random() * 100),
  }))
}

const systemModules = [
  { name: 'DDC / Automation', count: 12, online: 12 },
  { name: 'RLT / AHU', count: 6, online: 6 },
  { name: 'Heizkreise', count: 8, online: 8 },
  { name: 'Kältemaschinen', count: 3, online: 2 },
  { name: 'DALI Gateway', count: 4, online: 3 },
  { name: 'Energiezähler', count: 14, online: 14 },
]

const alarms = [
  { key: '1', time: '14:23:05', module: 'RLT-OG2', content: 'Zuluftventilator FU-Störung (F31)', level: 'A', device: 'AHU-03' },
  { key: '2', time: '13:45:12', module: 'Kälte', content: 'Kaltwasser-VL Temp. >14°C (Grenzwert: 12°C)', level: 'B', device: 'KM-02' },
  { key: '3', time: '12:10:30', module: 'Raum OG3', content: 'CO₂ >1000ppm Konferenzraum 3.12', level: 'C', device: 'DDC-OG3-02' },
  { key: '4', time: '11:30:00', module: 'Heizung', content: 'Brennerstörung Kessel 1 - Flammenüberwachung', level: 'B', device: 'Kessel-01' },
  { key: '5', time: '10:52:18', module: 'DALI', content: 'Bus-Kommunikationsfehler Gateway OG1', level: 'C', device: 'DALI-GW-02' },
  { key: '6', time: '09:15:44', module: 'Kälte', content: 'Kühlturm-Ventilator Übertemperatur', level: 'B', device: 'KT-01' },
]

const rooms = [
  { key: '1', name: 'EG - Empfang', temp: 22.3, humidity: 44, co2: 485, persons: 3, setpoint: 22 },
  { key: '2', name: 'OG1 - Großraumbüro', temp: 22.8, humidity: 47, co2: 620, persons: 28, setpoint: 22 },
  { key: '3', name: 'OG1 - Besprechung 1.04', temp: 23.4, humidity: 51, co2: 780, persons: 12, setpoint: 23 },
  { key: '4', name: 'OG2 - Büro 2.01', temp: 22.1, humidity: 43, co2: 520, persons: 4, setpoint: 22 },
  { key: '5', name: 'OG2 - Konferenz 2.10', temp: 24.2, humidity: 56, co2: 940, persons: 18, setpoint: 23 },
  { key: '6', name: 'OG3 - Büro 3.05', temp: 21.9, humidity: 42, co2: 410, persons: 2, setpoint: 22 },
  { key: '7', name: 'OG3 - Konferenz 3.12', temp: 25.1, humidity: 58, co2: 1050, persons: 22, setpoint: 23 },
  { key: '8', name: 'UG - Serverraum', temp: 21.0, humidity: 38, co2: 390, persons: 0, setpoint: 21 },
]

const energyDistribution = [
  { name: 'HVAC', value: 48, color: '#1677ff' },
  { name: 'Beleuchtung', value: 22, color: '#faad14' },
  { name: 'IT / Server', value: 18, color: '#52c41a' },
  { name: 'Sonstige', value: 12, color: '#d9d9d9' },
]

export default function DashboardPage() {
  const { t } = useI18n()
  const [energy] = useState(genEnergy)
  const [weekly] = useState(genWeekly)
  const [exportModal, setExportModal] = useState(false)

  const totalOnline = useMemo(() => systemModules.reduce((a, b) => a + b.online, 0), [])
  const totalDevices = useMemo(() => systemModules.reduce((a, b) => a + b.count, 0), [])

  const handleExport = () => {
    message.success(t.actions.export + ' - OK')
    setExportModal(false)
  }

  const alarmCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 90 },
    { title: t.common.device, dataIndex: 'device', key: 'device', width: 100 },
    { title: t.common.module, dataIndex: 'module', key: 'module', width: 100 },
    { title: t.common.content, dataIndex: 'content', key: 'content' },
    { title: t.common.level, dataIndex: 'level', key: 'level', width: 70, render: (v: string) => <Tag color={v === 'A' ? 'red' : v === 'B' ? 'orange' : 'blue'}>{v}</Tag> },
    { title: t.common.operation, key: 'op', width: 80, render: () => <Button size="small" type="link">{t.actions.acknowledge}</Button> },
  ]

  const roomCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.dash.temp, dataIndex: 'temp', key: 'temp', width: 80, render: (v: number, r: any) => <Text style={{ color: Math.abs(v - r.setpoint) > 1.5 ? '#f5222d' : '#52c41a' }}>{v}°C</Text> },
    { title: t.dash.humidity, dataIndex: 'humidity', key: 'humidity', width: 70, render: (v: number) => `${v}%` },
    { title: 'CO₂', dataIndex: 'co2', key: 'co2', width: 90, render: (v: number) => <Text style={{ color: v > 1000 ? '#f5222d' : v > 800 ? '#fa8c16' : '#52c41a' }}>{v} ppm</Text> },
    { title: t.dash.person, dataIndex: 'persons', key: 'persons', width: 50 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Bürogebäude Westpark — {t.nav.dashboard}</Title>
          <Text type="secondary">{t.dash.realtimeOverview} · Westpark-Allee 12, München · ~8.500 m²</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => message.info(t.actions.refresh)}>{t.actions.refresh}</Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={() => setExportModal(true)}>{t.dash.exportReport}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title={t.systemStatus} value={t.dash.normalRunning} valueStyle={{ color: '#52c41a', fontSize: 20 }} prefix={<CheckCircleOutlined />} />
            <Text type="secondary">{totalOnline}/{totalDevices} {t.common.module}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title={t.totalAlarms} value={6} valueStyle={{ color: '#f5222d' }} prefix={<AlertOutlined />} />
            <Space size={4}><Tag color="red">1×A</Tag><Tag color="orange">3×B</Tag><Tag color="blue">2×C</Tag></Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title={t.dash.currentPower} value={148.5} suffix="kW" prefix={<ThunderboltOutlined />} valueStyle={{ color: '#1677ff' }} />
            <Text type="secondary">{t.dash.energyKwh}: 2,847</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic title={t.activeUsers} value={6} prefix={<TeamOutlined />} />
            <Text type="secondary">{t.dash.personnel}: 142 · 5 {t.common.module}</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card title={t.dash.energyTrend24h} extra={<Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="elec" name={t.dash.elecKw} stroke="#1677ff" fill="#1677ff" fillOpacity={0.12} />
                <Area type="monotone" dataKey="heat" name={t.dash.heatKw} stroke="#f5222d" fill="#f5222d" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card title={t.dash.weeklyComparison}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="thisWeek" name={t.common.current} fill="#1677ff" radius={[4,4,0,0]} />
                <Bar dataKey="lastWeek" name="KW09" fill="#d9d9d9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={t.dash.latestAlarms} extra={<Button size="small" type="link">{t.dash.viewAll} ({alarms.length})</Button>}>
            <Table columns={alarmCols} dataSource={alarms} pagination={false} size="small" scroll={{ y: 240 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Energieverteilung">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={energyDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {energyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title={t.dash.roomMonitor} extra={<Space><Badge status="success" text={`${rooms.filter(r => r.persons > 0).length} ${t.room.occupied}`} /><Badge status="default" text={`${rooms.filter(r => r.persons === 0).length} ${t.room.vacant}`} /><Button size="small" icon={<SettingOutlined />}>{t.actions.settings}</Button></Space>}>
        <Table columns={roomCols} dataSource={rooms} pagination={false} size="small" />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title={t.dash.systemOverview} size="small">
            <Row gutter={[16, 8]}>
              {systemModules.map((mod, i) => (
                <Col xs={12} sm={8} lg={4} key={i}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <Text strong>{mod.name}</Text>
                    <div><Text style={{ color: mod.online === mod.count ? '#52c41a' : '#fa8c16', fontSize: 18, fontWeight: 600 }}>{mod.online}</Text><Text type="secondary"> / {mod.count}</Text></div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal title={t.dash.exportReport} open={exportModal} onOk={handleExport} onCancel={() => setExportModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>{t.dash.exportReport} (PDF / Excel / CSV)?</p>
      </Modal>
    </div>
  )
}
