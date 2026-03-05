'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, message } from 'antd'
import { ApiOutlined, CheckCircleOutlined, WarningOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ifaces = [
  { key: '1', name: 'BACnet/IP', port: 47808, devices: 24, rate: '120 msg/s', status: 'online', uptime: '99.9%' },
  { key: '2', name: 'Modbus TCP', port: 502, devices: 18, rate: '85 msg/s', status: 'online', uptime: '99.7%' },
  { key: '3', name: 'KNX/IP', port: 3671, devices: 12, rate: '45 msg/s', status: 'online', uptime: '98.5%' },
  { key: '4', name: 'DALI Gateway', port: 50000, devices: 8, rate: '0 msg/s', status: 'offline', uptime: '85.2%' },
  { key: '5', name: 'OPC UA', port: 4840, devices: 6, rate: '30 msg/s', status: 'online', uptime: '99.8%' },
]

const events = [
  { key: '1', time: '14:23:05', iface: 'DALI Gateway', event: 'Connection lost', level: 'error' },
  { key: '2', time: '14:20:00', iface: 'BACnet/IP', event: 'Device DDC-05 timeout (retry OK)', level: 'warning' },
  { key: '3', time: '13:00:00', iface: 'Modbus TCP', event: 'Register read success: 420 points', level: 'info' },
  { key: '4', time: '12:00:00', iface: 'KNX/IP', event: 'Telegram received: 180 group addresses', level: 'info' },
]

export default function InterfacesPage() {
  const { t } = useI18n()

  const ifaceCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.iface.port, dataIndex: 'port', key: 'port' },
    { title: t.common.device, dataIndex: 'devices', key: 'devices', align: 'center' as const },
    { title: t.iface.rate, dataIndex: 'rate', key: 'rate' },
    { title: 'Uptime', dataIndex: 'uptime', key: 'uptime' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'green' : 'red'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" icon={<ReloadOutlined />} onClick={() => message.info(`Restarting ${r.name}...`)}>{t.iface.restartIface}</Button>
        <Button size="small" type="link" icon={<SearchOutlined />} onClick={() => message.info(`Scanning ${r.name}...`)}>{t.iface.scanDevices}</Button>
      </Space>
    )},
  ]

  const eventCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 100 },
    { title: t.common.protocol, dataIndex: 'iface', key: 'iface' },
    { title: t.common.content, dataIndex: 'event', key: 'event' },
    { title: t.common.level, dataIndex: 'level', key: 'level', render: (v: string) => <Tag color={v === 'error' ? 'red' : v === 'warning' ? 'orange' : 'blue'}>{v === 'error' ? t.status.alarm : v === 'warning' ? t.status.warning : t.iface.info}</Tag> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.interfaces}</Title><Text type="secondary">{t.iface.subtitle}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.totalProtocols} value={5} prefix={<ApiOutlined />} /><Text type="secondary">{t.iface.configured}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.onlineDevices} value={68} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.offlineIface} value={1} valueStyle={{ color: '#f5222d' }} prefix={<WarningOutlined />} /><Text type="secondary">{t.iface.needFix}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.dataThroughput} value={280} suffix={t.iface.msgPerSec} /></Card></Col>
      </Row>
      <Card title={t.iface.ifaceStatus}><Table columns={ifaceCols} dataSource={ifaces} pagination={false} size="small" /></Card>
      <Card title={t.iface.eventLog}><Table columns={eventCols} dataSource={events} pagination={false} size="small" /></Card>
    </div>
  )
}
