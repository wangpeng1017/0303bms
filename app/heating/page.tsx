'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, Slider, Radio, message } from 'antd'
import { FireOutlined, DashboardOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTemp() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    supply: 55 + Math.sin(i / 4) * 5 + (Math.random() - 0.5) * 2,
    return_: 40 + Math.sin(i / 4) * 3 + (Math.random() - 0.5) * 2,
  }))
}

const circuits = [
  { key: '1', name: 'HK-1 North', supply: 55.2, return_: 40.1, setpoint: 55, valve: 78, mode: 'auto', status: 'running' },
  { key: '2', name: 'HK-2 South', supply: 53.8, return_: 39.5, setpoint: 55, valve: 65, mode: 'auto', status: 'running' },
  { key: '3', name: 'HK-3 AHU', supply: 50.0, return_: 38.0, setpoint: 50, valve: 45, mode: 'manual', status: 'running' },
  { key: '4', name: 'HK-4 DHW', supply: 60.0, return_: 45.0, setpoint: 60, valve: 90, mode: 'auto', status: 'running' },
]

export default function HeatingPage() {
  const { t } = useI18n()
  const [trend] = useState(genTemp)
  const [setpointModal, setSetpointModal] = useState(false)
  const [selectedCircuit, setSelectedCircuit] = useState<string>('')
  const [tempValue, setTempValue] = useState(55)

  const cols = [
    { title: t.heat.circuit, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.heat.supplyTemp, dataIndex: 'supply', key: 'supply', render: (v: number) => <Text style={{ color: '#f5222d' }}>{v.toFixed(1)}°C</Text> },
    { title: t.heat.returnTemp, dataIndex: 'return_', key: 'return_', render: (v: number) => `${v.toFixed(1)}°C` },
    { title: t.heat.setpoint, dataIndex: 'setpoint', key: 'setpoint', render: (v: number) => `${v}°C` },
    { title: t.heat.valvePos, dataIndex: 'valve', key: 'valve', render: (v: number) => <Progress percent={v} size="small" style={{ width: 80 }} /> },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: () => <Tag color="green">{t.common.running}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" onClick={() => { setSelectedCircuit(r.name); setTempValue(r.setpoint); setSetpointModal(true) }}>{t.heat.adjustSetpoint}</Button>
        <Button size="small" type="link">{t.heat.switchMode}</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.heating}</Title><Text type="secondary">{t.heat.subtitle}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.supplyTemp} value={55.2} suffix="°C" valueStyle={{ color: '#f5222d' }} prefix={<FireOutlined />} /><Text type="secondary">{t.heat.setpoint}: 55°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.returnTemp} value={40.1} suffix="°C" /><Text type="secondary">{t.heat.tempDiff}: 15.1°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.boilerStatus} value={t.common.running} valueStyle={{ color: '#52c41a' }} /><Text type="secondary">{t.heat.loadRate}: 72%</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.circuitsRunning} value="4/4" valueStyle={{ color: '#13c2c2' }} prefix={<DashboardOutlined />} /><Text type="secondary">{t.heat.outdoorTemp}: 5°C</Text></Card></Col>
      </Row>
      <Card title={t.heat.trendTitle}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} domain={[30, 65]} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="supply" name={t.heat.supplyTemp} stroke="#f5222d" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="return_" name={t.heat.returnTemp} stroke="#1677ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.heat.circuitStatus}><Table columns={cols} dataSource={circuits} pagination={false} size="small" /></Card>
      <Modal title={`${t.heat.adjustSetpoint} - ${selectedCircuit}`} open={setpointModal} onOk={() => { setSetpointModal(false); message.success(`${selectedCircuit}: ${tempValue}°C`) }} onCancel={() => setSetpointModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <div style={{ padding: '20px 0' }}>
          <Text>{t.heat.setpoint}: {tempValue}°C</Text>
          <Slider min={30} max={70} value={tempValue} onChange={setTempValue} marks={{ 30: '30°C', 50: '50°C', 70: '70°C' }} />
        </div>
      </Modal>
    </div>
  )
}
