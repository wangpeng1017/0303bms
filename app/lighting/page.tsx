'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, Switch, message } from 'antd'
import { BulbOutlined, DashboardOutlined, ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genLux() {
  return Array.from({ length: 24 }, (_, i) => {
    const outdoor = i >= 6 && i <= 18 ? Math.round(200 + Math.sin((i - 6) / 12 * Math.PI) * 800) : 0
    const artificial = Math.max(0, 500 - outdoor * 0.4) + (i >= 8 && i <= 18 ? 100 : 0)
    return { hour: `${String(i).padStart(2, '0')}:00`, outdoor, artificial: Math.round(artificial) }
  })
}

const groups = [
  { key: '1', name: 'DALI-G1 Office', lights: 24, brightness: 85, lux: 520, mode: 'auto', status: 'on' },
  { key: '2', name: 'DALI-G2 Meeting', lights: 12, brightness: 100, lux: 650, mode: 'scene', status: 'on' },
  { key: '3', name: 'DALI-G3 Corridor', lights: 18, brightness: 60, lux: 280, mode: 'auto', status: 'on' },
  { key: '4', name: 'DALI-G4 Lobby', lights: 8, brightness: 0, lux: 0, mode: 'auto', status: 'off' },
]

const scenes = [
  { key: '1', name: 'Working', brightness: 85, color: '4000K' },
  { key: '2', name: 'Meeting', brightness: 100, color: '5000K' },
  { key: '3', name: 'Presentation', brightness: 40, color: '3000K' },
  { key: '4', name: 'Night', brightness: 20, color: '2700K' },
]

export default function LightingPage() {
  const { t } = useI18n()
  const [trend] = useState(genLux)

  const groupCols = [
    { title: t.light.group, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.light.lightCount, dataIndex: 'lights', key: 'lights', align: 'center' as const },
    { title: t.light.brightness, dataIndex: 'brightness', key: 'brightness', align: 'center' as const, render: (v: number, r: any) => <Slider value={v} disabled={r.status === 'off'} style={{ width: 80, margin: 0 }} /> },
    { title: `${t.light.illuminance} (lux)`, dataIndex: 'lux', key: 'lux', align: 'center' as const },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', render: (v: string) => <Tag color={v === 'auto' ? 'blue' : v === 'scene' ? 'purple' : 'orange'}>{v}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'on' ? 'green' : 'default'}>{v === 'on' ? t.light.on : t.light.off}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Switch size="small" checked={r.status === 'on'} onChange={() => message.info(`Toggle ${r.name}`)} />
        <Button size="small" type="link">{t.light.adjustBrightness}</Button>
      </Space>
    )},
  ]

  const sceneCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name' },
    { title: t.light.brightness, dataIndex: 'brightness', key: 'brightness', render: (v: number) => `${v}%` },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => <Button size="small" type="primary" ghost onClick={() => message.success(`Scene: ${r.name}`)}>{t.light.switchScene}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.lighting}</Title><Text type="secondary">{t.light.subtitle}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.daliLights} value={62} prefix={<BulbOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.avgLux} value={488} suffix="lux" /><Text type="secondary">{t.light.luxTarget}: 500 lux</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.daylightUtil} value={65} suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<DashboardOutlined />} /><Text type="secondary">{t.light.savingsEffect}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.presenceTrigger} value={128} prefix={<ThunderboltOutlined />} /><Text type="secondary">{t.light.today}</Text></Card></Col>
      </Row>
      <Card title={t.light.luxCurve}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="outdoor" name={t.light.outdoorLux} stroke="#faad14" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="artificial" name={t.light.artificialLux} stroke="#1677ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.light.daliGroups}><Table columns={groupCols} dataSource={groups} pagination={false} size="small" /></Card>
      <Card title={t.light.scenes}><Table columns={sceneCols} dataSource={scenes} pagination={false} size="small" /></Card>
    </div>
  )
}
