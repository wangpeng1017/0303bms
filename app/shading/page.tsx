'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, message } from 'antd'
import { BlockOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const blinds = [
  { key: '1', name: 'F1-East', position: 75, angle: 45, mode: 'auto', status: 'ok' },
  { key: '2', name: 'F1-South', position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '3', name: 'F2-East', position: 50, angle: 30, mode: 'manual', status: 'ok' },
  { key: '4', name: 'F2-South', position: 80, angle: 45, mode: 'auto', status: 'ok' },
  { key: '5', name: 'F3-West', position: 0, angle: 0, mode: 'auto', status: 'stuck' },
]

export default function ShadingPage() {
  const { t } = useI18n()

  const cols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.shade.position, dataIndex: 'position', key: 'pos', render: (v: number) => <Slider value={v} style={{ width: 80, margin: 0 }} /> },
    { title: t.shade.bladeAngle, dataIndex: 'angle', key: 'angle', render: (v: number) => `${v}°` },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'ok' ? 'green' : 'red'}>{v === 'ok' ? t.status.normal : t.shade.stuck}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Button size="small" onClick={() => message.info(`${r.name} → 100%`)}>↑</Button>
        <Button size="small" onClick={() => message.info(`${r.name} → 0%`)}>↓</Button>
        <Button size="small" type="link">{t.shade.autoMode}</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.shading}</Title><Text type="secondary">{t.shade.subtitle}</Text></div>
        <Space>
          <Button type="primary" onClick={() => message.success(t.shade.allUp)}>{t.shade.allUp}</Button>
          <Button onClick={() => message.success(t.shade.allDown)}>{t.shade.allDown}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.solarRad} value={680} suffix="W/m²" valueStyle={{ color: '#fa8c16' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.windSpeed} value={12} suffix="km/h" /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.outdoorTemp} value={28} suffix="°C" prefix={<BlockOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.humidityLabel} value={55} suffix="%" /></Card></Col>
      </Row>
      <Card title={t.shade.controlPanel}><Table columns={cols} dataSource={blinds} pagination={false} size="small" /></Card>
    </div>
  )
}
