'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Slider, Row, Col, Typography, Button, Space, Descriptions, message } from 'antd'
import { BlockOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function ShadingPage() {
  const { t } = useI18n()

  const blinds = [
    { key: '1', name: 'EG 南立面', facade: t.shade.zones.split(',')[0] || '南', floor: 'EG', count: 8, position: 75, angle: 45, mode: 'auto', status: 'ok' },
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

  const totalBlinds = blinds.reduce((a, b) => a + b.count, 0)
  const stuckCount = blinds.filter(b => b.status === 'stuck').length

  const cols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.facade, dataIndex: 'facade', key: 'facade', width: 70 },
    { title: t.common.floor, dataIndex: 'floor', key: 'floor', width: 60 },
    { title: t.common.quantity, dataIndex: 'count', key: 'count', width: 60, align: 'center' as const },
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
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.shading}</Title><Text type="secondary">{t.shade.subtitle} · {totalBlinds} {t.shade.blinds} · {t.shade.knxDriveLabel}</Text></div>
        <Space>
          <Button type="primary" onClick={() => message.success(t.shade.allUp)}>{t.shade.allUp}</Button>
          <Button onClick={() => message.success(t.shade.allDown)}>{t.shade.allDown}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.solarRad} value={680} suffix="W/m²" valueStyle={{ color: '#fa8c16' }} /><Text type="secondary">{t.shade.southMax}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.windSpeed} value={18} suffix="km/h" /><Text type="secondary">{t.shade.windWarning}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.shade.outdoorTemp} value={12.5} suffix="°C" prefix={<BlockOutlined />} /><Text type="secondary">{t.shade.sunHours}: 6.2h</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.common.faults} value={stuckCount} valueStyle={{ color: stuckCount > 0 ? '#f5222d' : '#52c41a' }} /><Text type="secondary">{stuckCount > 0 ? t.shade.blocked : t.common.allNormal}</Text></Card></Col>
      </Row>

      <Card title={t.shade.controlPanel} extra={<Text type="secondary">{blinds.length} {t.shade.zones} · {totalBlinds} {t.shade.blinds}</Text>}>
        <Table columns={cols} dataSource={blinds} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.shade.weatherAutoCtrl} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label={t.shade.weatherStation}>Elsner P04 (屋顶)</Descriptions.Item>
          <Descriptions.Item label={t.shade.sunSensor}>3 (东/南/西)</Descriptions.Item>
          <Descriptions.Item label={t.shade.windMonitor}>2 (限值: 50 km/h)</Descriptions.Item>
          <Descriptions.Item label={t.shade.rainSensor}>1 (自动收回)</Descriptions.Item>
          <Descriptions.Item label={t.shade.knxDrive}>Warema / Somfy · {totalBlinds}</Descriptions.Item>
          <Descriptions.Item label={t.shade.antiGlare}>25000 lux 以上自动启动</Descriptions.Item>
          <Descriptions.Item label={t.shade.frostProtect}>低于 -5°C 自动收回</Descriptions.Item>
          <Descriptions.Item label={t.shade.duskMode}>低于 100 lux 自动收回</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
