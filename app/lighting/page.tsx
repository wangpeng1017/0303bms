'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState, useMemo } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, Switch, Descriptions, message } from 'antd'
import { BulbOutlined, DashboardOutlined, ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genLux() {
  return Array.from({ length: 24 }, (_, i) => {
    const outdoor = i >= 6 && i <= 18 ? Math.round(200 + Math.sin((i - 6) / 12 * Math.PI) * 800) : 0
    const artificial = Math.max(0, 500 - outdoor * 0.4) + (i >= 8 && i <= 18 ? 120 : 0)
    return { hour: `${String(i).padStart(2, '00')}:00`, outdoor, artificial: Math.round(artificial), total: Math.round(Math.min(outdoor * 0.3 + artificial, 600)) }
  })
}

export default function LightingPage() {
  const { t } = useI18n()
  const [trend] = useState(genLux)

  const groups = useMemo(() => [
    { key: '1', name: `DALI-G1 ${t.light.groupLobby}`, lights: 32, brightness: 90, lux: 520, power: 1.8, mode: 'auto', status: 'on', floor: 'EG' },
    { key: '2', name: `DALI-G2 ${t.light.groupCanteen}`, lights: 24, brightness: 100, lux: 580, power: 1.4, mode: 'auto', status: 'on', floor: 'EG' },
    { key: '3', name: `DALI-G3 ${t.light.groupNorthOpen1}`, lights: 48, brightness: 82, lux: 505, power: 2.8, mode: 'auto', status: 'on', floor: 'OG1' },
    { key: '4', name: `DALI-G4 ${t.light.groupSouthOpen1}`, lights: 42, brightness: 78, lux: 490, power: 2.4, mode: 'auto', status: 'on', floor: 'OG1' },
    { key: '5', name: `DALI-G5 ${t.light.groupOffice2}`, lights: 36, brightness: 75, lux: 480, power: 2.0, mode: 'auto', status: 'on', floor: 'OG2' },
    { key: '6', name: `DALI-G6 ${t.light.groupMeeting2}`, lights: 16, brightness: 100, lux: 650, power: 1.2, mode: 'scene', status: 'on', floor: 'OG2' },
    { key: '7', name: `DALI-G7 ${t.light.groupOffice3}`, lights: 36, brightness: 70, lux: 460, power: 1.8, mode: 'auto', status: 'on', floor: 'OG3' },
    { key: '8', name: `DALI-G8 ${t.light.groupMeeting3}`, lights: 16, brightness: 100, lux: 640, power: 1.2, mode: 'scene', status: 'on', floor: 'OG3' },
    { key: '9', name: `DALI-G9 ${t.light.groupCorridor}`, lights: 28, brightness: 55, lux: 280, power: 0.9, mode: 'auto', status: 'on', floor: t.common.all },
    { key: '10', name: `DALI-G10 ${t.light.groupGarage}`, lights: 22, brightness: 0, lux: 0, power: 0, mode: 'auto', status: 'off', floor: 'UG' },
    { key: '11', name: `DALI-G11 ${t.light.groupOutdoor}`, lights: 12, brightness: 0, lux: 0, power: 0, mode: 'timer', status: 'off', floor: '—' },
  ], [t])

  const scenes = useMemo(() => [
    { key: '1', name: t.light.sceneOffice, brightness: 85, colorTemp: '4000K', lux: 500, usage: t.light.usageStandard },
    { key: '2', name: t.light.sceneMeeting, brightness: 100, colorTemp: '4500K', lux: 650, usage: t.light.usageMeeting },
    { key: '3', name: t.light.scenePresentation, brightness: 35, colorTemp: '3000K', lux: 200, usage: t.light.usageProjector },
    { key: '4', name: t.light.sceneCleaning, brightness: 100, colorTemp: '5000K', lux: 750, usage: t.light.usageCleaning },
    { key: '5', name: t.light.sceneNight, brightness: 15, colorTemp: '2700K', lux: 50, usage: t.light.usageNight },
    { key: '6', name: t.light.sceneLobby, brightness: 90, colorTemp: '3500K', lux: 400, usage: t.light.usageLobby },
  ], [t])

  const totalLights = groups.reduce((a, b) => a + b.lights, 0)
  const totalPower = groups.reduce((a, b) => a + b.power, 0).toFixed(1)
  const onGroups = groups.filter(g => g.status === 'on')
  const avgLux = Math.round(onGroups.reduce((a, b) => a + b.lux, 0) / onGroups.length)

  const groupCols = [
    { title: t.light.group, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.floor, dataIndex: 'floor', key: 'floor', width: 60 },
    { title: t.light.lightCount, dataIndex: 'lights', key: 'lights', width: 60, align: 'center' as const },
    { title: t.light.brightness, dataIndex: 'brightness', key: 'brightness', width: 100, align: 'center' as const, render: (v: number, r: any) => <Slider value={v} disabled={r.status === 'off'} style={{ width: 70, margin: 0 }} /> },
    { title: `${t.light.illuminance} (lux)`, dataIndex: 'lux', key: 'lux', width: 80, align: 'center' as const },
    { title: 'kW', dataIndex: 'power', key: 'power', width: 50, render: (v: number) => v > 0 ? v.toFixed(1) : '-' },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', width: 80, render: (v: string) => <Tag color={v === 'auto' ? 'blue' : v === 'scene' ? 'purple' : v === 'timer' ? 'cyan' : 'orange'}>{v}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 70, render: (v: string) => <Tag color={v === 'on' ? 'green' : 'default'}>{v === 'on' ? t.light.on : t.light.off}</Tag> },
    { title: t.common.operation, key: 'op', width: 140, render: (_: any, r: any) => (
      <Space>
        <Switch size="small" checked={r.status === 'on'} onChange={() => message.info(`Toggle ${r.name}`)} />
        <Button size="small" type="link">{t.light.adjustBrightness}</Button>
      </Space>
    )},
  ]

  const sceneCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.light.brightness, dataIndex: 'brightness', key: 'brightness', width: 80, render: (v: number) => `${v}%` },
    { title: t.light.colorTemp, dataIndex: 'colorTemp', key: 'colorTemp', width: 100 },
    { title: t.light.targetLux, dataIndex: 'lux', key: 'lux', width: 80, render: (v: number) => `${v} lux` },
    { title: t.light.usage, dataIndex: 'usage', key: 'usage' },
    { title: t.common.operation, key: 'op', width: 120, render: (_: any, r: any) => <Button size="small" type="primary" ghost onClick={() => message.success(`${t.light.sceneActivated}: ${r.name}`)}>{t.light.switchScene}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.lighting}</Title><Text type="secondary">{t.light.subtitle} · Tridonic DALI-2 · {totalLights} {t.light.fixtures}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.daliLights} value={totalLights} prefix={<BulbOutlined />} valueStyle={{ color: '#faad14' }} /><Text type="secondary">{groups.length} {t.light.groups} · 4{t.light.gateways}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.avgLux} value={avgLux} suffix="lux" /><Text type="secondary">{t.light.luxTarget}: 500 lux (ASR A3.4)</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.light.daylightUtil} value={62} suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<DashboardOutlined />} /><Text type="secondary">{t.light.savingsEffect}: ~28%</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.common.total} value={totalPower} suffix="kW" prefix={<ThunderboltOutlined />} /><Text type="secondary">{t.light.presenceTrigger}: 142 {t.light.today}</Text></Card></Col>
      </Row>

      <Card title={t.light.luxCurve} extra={<Text type="secondary">{t.light.daylightRegulation}</Text>}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="outdoor" name={t.light.outdoorLux} stroke="#faad14" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="artificial" name={t.light.artificialLux} stroke="#1677ff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="total" name={t.light.workSurfaceLux} stroke="#52c41a" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.light.daliGroups} extra={<Text type="secondary">{onGroups.length}/{groups.length} {t.light.groupActive}</Text>}>
        <Table columns={groupCols} dataSource={groups} pagination={false} size="small" scroll={{ x: 1000 }} />
      </Card>

      <Card title={t.light.scenes} extra={<Text type="secondary">{scenes.length} {t.light.scenesConfigured}</Text>}>
        <Table columns={sceneCols} dataSource={scenes} pagination={false} size="small" />
      </Card>

      <Card title={t.light.daliDetails} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label={t.light.gateway}>Tridonic DALI-2 IP · 4{t.light.gateways}</Descriptions.Item>
          <Descriptions.Item label={t.light.protocolLabel}>DALI-2 (IEC 62386)</Descriptions.Item>
          <Descriptions.Item label={t.light.fixtureType}>{t.light.ledPanel}</Descriptions.Item>
          <Descriptions.Item label={t.light.colorTempRange}>{t.light.colorTempTunable}</Descriptions.Item>
          <Descriptions.Item label={t.light.presenceDetector}>48 ABB Busch-Wächter</Descriptions.Item>
          <Descriptions.Item label={t.light.luxSensor}>12 Tridonic luxCONTROL</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
