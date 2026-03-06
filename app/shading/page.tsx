'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, Descriptions, message } from 'antd'
import { BlockOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const blinds = [
  { key: '1', name: 'EG Südfassade', facade: 'Süd', floor: 'EG', count: 8, position: 75, angle: 45, mode: 'auto', status: 'ok' },
  { key: '2', name: 'EG Ostfassade', facade: 'Ost', floor: 'EG', count: 6, position: 40, angle: 30, mode: 'auto', status: 'ok' },
  { key: '3', name: 'OG1 Südfassade', facade: 'Süd', floor: 'OG1', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '4', name: 'OG1 Ostfassade', facade: 'Ost', floor: 'OG1', count: 8, position: 50, angle: 35, mode: 'auto', status: 'ok' },
  { key: '5', name: 'OG1 Westfassade', facade: 'West', floor: 'OG1', count: 8, position: 20, angle: 15, mode: 'auto', status: 'ok' },
  { key: '6', name: 'OG2 Südfassade', facade: 'Süd', floor: 'OG2', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '7', name: 'OG2 Ostfassade', facade: 'Ost', floor: 'OG2', count: 8, position: 55, angle: 35, mode: 'auto', status: 'ok' },
  { key: '8', name: 'OG2 Westfassade', facade: 'West', floor: 'OG2', count: 8, position: 25, angle: 15, mode: 'manual', status: 'ok' },
  { key: '9', name: 'OG3 Südfassade', facade: 'Süd', floor: 'OG3', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '10', name: 'OG3 Ostfassade', facade: 'Ost', floor: 'OG3', count: 8, position: 60, angle: 40, mode: 'auto', status: 'ok' },
  { key: '11', name: 'OG3 Westfassade', facade: 'West', floor: 'OG3', count: 8, position: 0, angle: 0, mode: 'auto', status: 'stuck' },
  { key: '12', name: 'Dach Lichtkuppeln', facade: 'Dach', floor: 'Dach', count: 4, position: 80, angle: 0, mode: 'auto', status: 'ok' },
]

export default function ShadingPage() {
  const { t } = useI18n()

  const totalBlinds = blinds.reduce((a, b) => a + b.count, 0)
  const stuckCount = blinds.filter(b => b.status === 'stuck').length

  const cols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Fassade', dataIndex: 'facade', key: 'facade', width: 70 },
    { title: 'Etage', dataIndex: 'floor', key: 'floor', width: 60 },
    { title: 'Anzahl', dataIndex: 'count', key: 'count', width: 60, align: 'center' as const },
    { title: t.shade.position, dataIndex: 'position', key: 'pos', width: 100, render: (v: number) => <Slider value={v} style={{ width: 70, margin: 0 }} /> },
    { title: t.shade.bladeAngle, dataIndex: 'angle', key: 'angle', width: 80, render: (v: number) => `${v}°` },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', width: 80, render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'ok' ? 'green' : 'red'}>{v === 'ok' ? t.status.normal : t.shade.stuck}</Tag> },
    { title: t.common.operation, key: 'op', width: 150, render: (_: any, r: any) => (
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
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.shading}</Title><Text type="secondary">{t.shade.subtitle} · {totalBlinds} Jalousien · KNX Antriebe</Text></div>
        <Space>
          <Button type="primary" onClick={() => message.success(t.shade.allUp)}>{t.shade.allUp}</Button>
          <Button onClick={() => message.success(t.shade.allDown)}>{t.shade.allDown}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.solarRad} value={680} suffix="W/m²" valueStyle={{ color: '#fa8c16' }} /><Text type="secondary">Südfassade max</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.windSpeed} value={18} suffix="km/h" /><Text type="secondary">Windwarnung: &gt;50 km/h</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.outdoorTemp} value={12.5} suffix="°C" prefix={<BlockOutlined />} /><Text type="secondary">Sonnenstunden: 6.2h</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title="Störungen" value={stuckCount} valueStyle={{ color: stuckCount > 0 ? '#f5222d' : '#52c41a' }} /><Text type="secondary">{stuckCount > 0 ? '1 Antrieb blockiert' : 'Alle OK'}</Text></Card></Col>
      </Row>

      <Card title={t.shade.controlPanel} extra={<Text type="secondary">{blinds.length} Zonen · {totalBlinds} Jalousien</Text>}>
        <Table columns={cols} dataSource={blinds} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title="Wetterstation & Automatik" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label="Wetterstation">Elsner P04 (Dach)</Descriptions.Item>
          <Descriptions.Item label="Sonnensensor">3× (Ost/Süd/West)</Descriptions.Item>
          <Descriptions.Item label="Windwächter">2× (Grenzwert: 50 km/h)</Descriptions.Item>
          <Descriptions.Item label="Regensensor">1× (Automatik-Einfahrt)</Descriptions.Item>
          <Descriptions.Item label="KNX Antriebe">Warema / Somfy · {totalBlinds} Stk.</Descriptions.Item>
          <Descriptions.Item label="Blendschutz">Automatik ab 25.000 lux</Descriptions.Item>
          <Descriptions.Item label="Frostschutz">Einfahrt bei &lt;-5°C</Descriptions.Item>
          <Descriptions.Item label="Dämmerung">Einfahrt bei &lt;100 lux</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
