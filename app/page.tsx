'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, message } from 'antd'
import {
  AlertOutlined, ThunderboltOutlined, TeamOutlined, ClockCircleOutlined,
  ExportOutlined, ReloadOutlined, SettingOutlined
} from '@ant-design/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genEnergy() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    elec: Math.round(40 + Math.random() * 30 + (i > 8 && i < 18 ? 20 : 0)),
    heat: Math.round(20 + Math.random() * 15 + (i < 8 || i > 20 ? 10 : 0)),
  }))
}

function genWeekly() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(d => ({ day: d, thisWeek: Math.round(800 + Math.random() * 400), lastWeek: Math.round(800 + Math.random() * 400) }))
}

const alarms = [
  { key: '1', time: '14:23', module: 'AHU-01', content: 'Supply fan VFD fault', level: 'A' },
  { key: '2', time: '13:45', module: 'Chiller-02', content: 'Chilled water temp high', level: 'B' },
  { key: '3', time: '12:10', module: 'Room 301', content: 'CO2 above threshold', level: 'C' },
  { key: '4', time: '11:30', module: 'Boiler-01', content: 'Flame sensor warning', level: 'B' },
]

const rooms = [
  { key: '1', name: 'Room 101', temp: 22.5, humidity: 45, co2: 520, persons: 8 },
  { key: '2', name: 'Room 201', temp: 23.1, humidity: 50, co2: 680, persons: 15 },
  { key: '3', name: 'Room 301', temp: 24.0, humidity: 55, co2: 920, persons: 22 },
  { key: '4', name: 'Room 401', temp: 21.8, humidity: 42, co2: 450, persons: 3 },
]

export default function DashboardPage() {
  const { t } = useI18n()
  const [energy] = useState(genEnergy)
  const [weekly] = useState(genWeekly)
  const [exportModal, setExportModal] = useState(false)

  const handleExport = () => {
    message.success(t.actions.export + ' - OK')
    setExportModal(false)
  }

  const alarmCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 80 },
    { title: t.common.module, dataIndex: 'module', key: 'module' },
    { title: t.common.content, dataIndex: 'content', key: 'content' },
    { title: t.common.level, dataIndex: 'level', key: 'level', width: 80, render: (v: string) => <Tag color={v === 'A' ? 'red' : v === 'B' ? 'orange' : 'blue'}>{v}</Tag> },
    { title: t.common.operation, key: 'op', width: 100, render: () => <Button size="small" type="link">{t.actions.acknowledge}</Button> },
  ]

  const roomCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name' },
    { title: t.dash.temp, dataIndex: 'temp', key: 'temp', render: (v: number) => `${v}°C` },
    { title: t.dash.humidity, dataIndex: 'humidity', key: 'humidity', render: (v: number) => `${v}%` },
    { title: 'CO₂', dataIndex: 'co2', key: 'co2', render: (v: number) => <Text style={{ color: v > 800 ? '#f5222d' : '#52c41a' }}>{v} ppm</Text> },
    { title: t.dash.person, dataIndex: 'persons', key: 'persons' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.dashboard}</Title><Text type="secondary">{t.dash.realtimeOverview}</Text></div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => message.info(t.actions.refresh)}>{t.actions.refresh}</Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={() => setExportModal(true)}>{t.dash.exportReport}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.systemStatus} value={t.dash.normalRunning} valueStyle={{ color: '#52c41a', fontSize: 20 }} /><Text type="secondary">16/16 {t.common.module}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.totalAlarms} value={4} valueStyle={{ color: '#f5222d' }} prefix={<AlertOutlined />} /><Text type="secondary">2 {t.dash.needProcess}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dash.currentPower} value={142} suffix="kW" prefix={<ThunderboltOutlined />} valueStyle={{ color: '#1677ff' }} /><Text type="secondary">{t.dash.energyKwh}: 3,280</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.activeUsers} value={8} prefix={<TeamOutlined />} /><Text type="secondary">{t.dash.personnel}: 156</Text></Card></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={t.dash.energyTrend24h}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
                <Tooltip /><Legend />
                <Area type="monotone" dataKey="elec" name={t.dash.elecKw} stroke="#1677ff" fill="#1677ff" fillOpacity={0.15} />
                <Area type="monotone" dataKey="heat" name={t.dash.heatKw} stroke="#f5222d" fill="#f5222d" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={t.dash.weeklyComparison}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} />
                <Tooltip /><Legend />
                <Bar dataKey="thisWeek" name={t.common.current} fill="#1677ff" radius={[4,4,0,0]} />
                <Bar dataKey="lastWeek" name="Last Week" fill="#d9d9d9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t.dash.latestAlarms} extra={<Button size="small" type="link">{t.dash.viewAll}</Button>}>
            <Table columns={alarmCols} dataSource={alarms} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t.dash.roomMonitor} extra={<Button size="small" icon={<SettingOutlined />}>{t.actions.settings}</Button>}>
            <Table columns={roomCols} dataSource={rooms} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
      <Modal title={t.dash.exportReport} open={exportModal} onOk={handleExport} onCancel={() => setExportModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>{t.dash.exportReport} (PDF / Excel)?</p>
      </Modal>
    </div>
  )
}
