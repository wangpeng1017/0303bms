'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, message } from 'antd'
import { LaptopOutlined, WifiOutlined, CloudUploadOutlined, SafetyOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const connections = [
  { key: '1', name: 'VPN-Engineer-01', target: 'DDC Network', latency: '12ms', status: 'connected', since: '13:00' },
  { key: '2', name: 'VPN-Support-01', target: 'Monitoring', latency: '45ms', status: 'connected', since: '14:00' },
  { key: '3', name: 'VPN-Vendor-01', target: 'Chiller PLC', latency: '-', status: 'disconnected', since: '-' },
]

const updates = [
  { key: '1', component: 'DDC Firmware', current: 'v3.2.1', available: 'v3.3.0', severity: 'security' },
  { key: '2', component: 'BMS Server', current: 'v1.0.0', available: 'v1.1.0', severity: 'recommended' },
  { key: '3', component: 'DALI Gateway', current: 'v2.0.0', available: 'v2.0.0', severity: 'latest' },
  { key: '4', component: 'KNX Module', current: 'v1.5.2', available: 'v1.5.3', severity: 'optional' },
]

export default function RemotePage() {
  const { t } = useI18n()
  const [vpnModal, setVpnModal] = useState(false)

  const connCols = [
    { title: t.rmt.connection, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.rmt.target, dataIndex: 'target', key: 'target' },
    { title: t.rmt.latency, dataIndex: 'latency', key: 'latency' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'connected' ? 'green' : 'default'}>{v === 'connected' ? t.common.connected : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Button size="small" type={r.status === 'connected' ? 'default' : 'primary'} danger={r.status === 'connected'} onClick={() => message.info(r.status === 'connected' ? t.rmt.disconnectVpn : t.rmt.connectVpn)}>
        {r.status === 'connected' ? t.rmt.disconnectVpn : t.rmt.connectVpn}
      </Button>
    )},
  ]

  const updateCols = [
    { title: t.rmt.component, dataIndex: 'component', key: 'component', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.rmt.currentVer, dataIndex: 'current', key: 'current' },
    { title: t.rmt.availableVer, dataIndex: 'available', key: 'available' },
    { title: t.rmt.severity, dataIndex: 'severity', key: 'severity', render: (v: string) => {
      const map: Record<string, {color: string, label: string}> = {
        security: { color: 'red', label: t.rmt.securityUpdate },
        recommended: { color: 'orange', label: t.rmt.recommended },
        latest: { color: 'green', label: t.rmt.latest },
        optional: { color: 'blue', label: t.rmt.optional },
      }
      const m = map[v] || { color: 'default', label: v }
      return <Tag color={m.color}>{m.label}</Tag>
    }},
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => r.current !== r.available ? <Button size="small" type="primary" ghost onClick={() => message.info(`Updating ${r.component}...`)}>{t.actions.update}</Button> : <Text type="secondary">{t.rmt.latest}</Text> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.remote}</Title><Text type="secondary">{t.rmt.subtitle}</Text></div>
        <Button type="primary" icon={<WifiOutlined />} onClick={() => setVpnModal(true)}>{t.rmt.connectVpn}</Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.activeConn} value={2} prefix={<LaptopOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.remoteSessions} value={2} prefix={<WifiOutlined />} /><Text type="secondary">{t.rmt.inProgress}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.pendingUpdates} value={3} valueStyle={{ color: '#fa8c16' }} prefix={<CloudUploadOutlined />} /><Text type="secondary">{t.rmt.components}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.securityStatus} value={t.status.normal} valueStyle={{ color: '#52c41a' }} prefix={<SafetyOutlined />} /></Card></Col>
      </Row>
      <Card title={t.rmt.remoteConn}><Table columns={connCols} dataSource={connections} pagination={false} size="small" /></Card>
      <Card title={t.rmt.updateManage}><Table columns={updateCols} dataSource={updates} pagination={false} size="small" /></Card>
      <Modal title={t.rmt.connectVpn} open={vpnModal} onOk={() => { setVpnModal(false); message.success('VPN Connected') }} onCancel={() => setVpnModal(false)} okText={t.actions.connect} cancelText={t.actions.cancel}>
        <p>Connect to BMS VPN Gateway?</p>
      </Modal>
    </div>
  )
}
