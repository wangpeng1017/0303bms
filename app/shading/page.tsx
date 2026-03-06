'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, Descriptions, message } from 'antd'
import { BlockOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const blinds = [
  { key: '1', name: 'EG 南立面', facade: '南', floor: 'EG', count: 8, position: 75, angle: 45, mode: 'auto', status: 'ok' },
  { key: '2', name: 'EG 东立面', facade: '东', floor: 'EG', count: 6, position: 40, angle: 30, mode: 'auto', status: 'ok' },
  { key: '3', name: 'OG1 南立面', facade: '南', floor: 'OG1', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '4', name: 'OG1 东立面', facade: '东', floor: 'OG1', count: 8, position: 50, angle: 35, mode: 'auto', status: 'ok' },
  { key: '5', name: 'OG1 西立面', facade: '西', floor: 'OG1', count: 8, position: 20, angle: 15, mode: 'auto', status: 'ok' },
  { key: '6', name: 'OG2 南立面', facade: '南', floor: 'OG2', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '7', name: 'OG2 东立面', facade: '东', floor: 'OG2', count: 8, position: 55, angle: 35, mode: 'auto', status: 'ok' },
  { key: '8', name: 'OG2 西立面', facade: '西', floor: 'OG2', count: 8, position: 25, angle: 15, mode: 'manual', status: 'ok' },
  { key: '9', name: 'OG3 南立面', facade: '南', floor: 'OG3', count: 12, position: 100, angle: 60, mode: 'auto', status: 'ok' },
  { key: '10', name: 'OG3 东立面', facade: '东', floor: 'OG3', count: 8, position: 60, angle: 40, mode: 'auto', status: 'ok' },
  { key: '11', name: 'OG3 西立面', facade: '西', floor: 'OG3', count: 8, position: 0, angle: 0, mode: 'auto', status: 'stuck' },
  { key: '12', name: '屋顶采光罩', facade: '屋顶', floor: '屋顶', count: 4, position: 80, angle: 0, mode: 'auto', status: 'ok' },
]

export default function ShadingPage() {
  const { t } = useI18n()

  const totalBlinds = blinds.reduce((a, b) => a + b.count, 0)
  const stuckCount = blinds.filter(b => b.status === 'stuck').length

  const cols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: '立面', dataIndex: 'facade', key: 'facade', width: 70 },
    { title: '楼层', dataIndex: 'floor', key: 'floor', width: 60 },
    { title: '数量', dataIndex: 'count', key: 'count', width: 60, align: 'center' as const },
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
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.shading}</Title><Text type="secondary">{t.shade.subtitle} · {totalBlinds} 百叶窗 · KNX 驱动</Text></div>
        <Space>
          <Button type="primary" onClick={() => message.success(t.shade.allUp)}>{t.shade.allUp}</Button>
          <Button onClick={() => message.success(t.shade.allDown)}>{t.shade.allDown}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.solarRad} value={680} suffix="W/m²" valueStyle={{ color: '#fa8c16' }} /><Text type="secondary">南立面最大值</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.windSpeed} value={18} suffix="km/h" /><Text type="secondary">风速警告: &gt;50 km/h</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.outdoorTemp} value={12.5} suffix="°C" prefix={<BlockOutlined />} /><Text type="secondary">日照时长: 6.2h</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title="故障" value={stuckCount} valueStyle={{ color: stuckCount > 0 ? '#f5222d' : '#52c41a' }} /><Text type="secondary">{stuckCount > 0 ? '1个驱动被阻塞' : '全部正常'}</Text></Card></Col>
      </Row>

      <Card title={t.shade.controlPanel} extra={<Text type="secondary">{blinds.length} 区域 · {totalBlinds} 百叶窗</Text>}>
        <Table columns={cols} dataSource={blinds} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title="气象站与自动控制" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label="气象站">Elsner P04 (屋顶)</Descriptions.Item>
          <Descriptions.Item label="日照传感器">3个 (东/南/西)</Descriptions.Item>
          <Descriptions.Item label="风速监测">2个 (限值: 50 km/h)</Descriptions.Item>
          <Descriptions.Item label="雨量传感器">1个 (自动收回)</Descriptions.Item>
          <Descriptions.Item label="KNX 驱动">Warema / Somfy · {totalBlinds} 台</Descriptions.Item>
          <Descriptions.Item label="防眩光">25000 lux 以上自动启动</Descriptions.Item>
          <Descriptions.Item label="防冻保护">低于 -5°C 自动收回</Descriptions.Item>
          <Descriptions.Item label="黄昏模式">低于 100 lux 自动收回</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
