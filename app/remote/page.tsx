'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Descriptions, message } from 'antd'
import { LaptopOutlined, WifiOutlined, CloudUploadOutlined, SafetyOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const connections = [
  { key: '1', name: 'VPN-Weber-MSR', user: 'Weber, Michael', target: 'DDC 网络 (VLAN 10)', ip: '10.8.0.2', latency: '8ms', since: '07:45', status: 'connected' },
  { key: '2', name: 'VPN-Müller-MSR', user: 'Müller, Sabine', target: 'DDC 网络 (VLAN 10)', ip: '10.8.0.3', latency: '12ms', since: '09:00', status: 'connected' },
  { key: '3', name: 'VPN-Siemens-Service', user: 'Siemens Service', target: 'DDC-OG2-02 (维保)', ip: '-', latency: '-', since: '-', status: 'disconnected' },
  { key: '4', name: 'VPN-Kampmann-RLT', user: 'Kampmann Service', target: 'RLT控制器 (Port 502)', ip: '-', latency: '-', since: '-', status: 'disconnected' },
]

const updates = [
  { key: '1', component: 'DDC Firmware (PXC)', current: 'v3.02.18', available: 'v3.03.02', severity: 'security', affected: '9台设备', note: 'BACnet 安全补丁' },
  { key: '2', component: 'Desigo CC Server', current: 'v6.0.2', available: 'v6.0.4', severity: 'recommended', affected: 'Server', note: '稳定性+性能优化' },
  { key: '3', component: 'DALI-2 Gateway FW', current: 'v2.1.0', available: 'v2.1.0', severity: 'latest', affected: '4台网关', note: '-' },
  { key: '4', component: 'KNX IP Router', current: 'v1.5.2', available: 'v1.5.3', severity: 'optional', affected: '2台路由', note: '小问题修复' },
  { key: '5', component: 'Loytec BACnet Router', current: 'v8.2.0', available: 'v8.3.1', severity: 'recommended', affected: '2台路由', note: 'BACnet Rev.14 支持' },
  { key: '6', component: 'HMS Modbus Gateway', current: 'v4.0.1', available: 'v4.0.1', severity: 'latest', affected: '1台网关', note: '-' },
]

export default function RemotePage() {
  const { t } = useI18n()
  const [vpnModal, setVpnModal] = useState(false)

  const activeConn = connections.filter(c => c.status === 'connected').length
  const pendingUpdates = updates.filter(u => u.current !== u.available).length

  const connCols = [
    { title: t.rmt.connection, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.user, dataIndex: 'user', key: 'user', width: 140 },
    { title: t.rmt.target, dataIndex: 'target', key: 'target' },
    { title: 'VPN IP', dataIndex: 'ip', key: 'ip', width: 90 },
    { title: t.rmt.latency, dataIndex: 'latency', key: 'latency', width: 70 },
    { title: t.common.startTime, dataIndex: 'since', key: 'since', width: 60 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <Tag color={v === 'connected' ? 'green' : 'default'}>{v === 'connected' ? t.common.connected : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: (_: any, r: any) => (
      <Button size="small" type={r.status === 'connected' ? 'default' : 'primary'} danger={r.status === 'connected'} onClick={() => message.info(r.status === 'connected' ? t.rmt.disconnectVpn : t.rmt.connectVpn)}>
        {r.status === 'connected' ? t.rmt.disconnectVpn : t.rmt.connectVpn}
      </Button>
    )},
  ]

  const updateCols = [
    { title: t.rmt.component, dataIndex: 'component', key: 'component', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.scope, dataIndex: 'affected', key: 'affected', width: 100 },
    { title: t.rmt.currentVer, dataIndex: 'current', key: 'current', width: 90 },
    { title: t.rmt.availableVer, dataIndex: 'available', key: 'available', width: 90 },
    { title: t.common.note, dataIndex: 'note', key: 'note' },
    { title: t.rmt.severity, dataIndex: 'severity', key: 'severity', width: 120, render: (v: string) => {
      const map: Record<string, {color: string, label: string}> = {
        security: { color: 'red', label: t.rmt.securityUpdate },
        recommended: { color: 'orange', label: t.rmt.recommended },
        latest: { color: 'green', label: t.rmt.latest },
        optional: { color: 'blue', label: t.rmt.optional },
      }
      const m = map[v] || { color: 'default', label: v }
      return <Tag color={m.color}>{m.label}</Tag>
    }},
    { title: t.common.operation, key: 'op', width: 100, render: (_: any, r: any) => r.current !== r.available ? <Button size="small" type="primary" ghost onClick={() => message.info(`Update: ${r.component}...`)}>{t.actions.update}</Button> : <Text type="secondary">{t.rmt.latest}</Text> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.remote}</Title><Text type="secondary">{t.rmt.subtitle} · OpenVPN · TLS 1.3</Text></div>
        <Button type="primary" icon={<WifiOutlined />} onClick={() => setVpnModal(true)}>{t.rmt.connectVpn}</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.activeConn} value={activeConn} prefix={<LaptopOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.remoteSessions} value={activeConn} prefix={<WifiOutlined />} /><Text type="secondary">{t.rmt.inProgress}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.pendingUpdates} value={pendingUpdates} valueStyle={{ color: pendingUpdates > 0 ? '#fa8c16' : '#52c41a' }} prefix={<CloudUploadOutlined />} /><Text type="secondary">{t.rmt.securityUpdatesCount}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.rmt.securityStatus} value={t.status.normal} valueStyle={{ color: '#52c41a' }} prefix={<SafetyOutlined />} /><Text type="secondary">{t.rmt.lastPentest}</Text></Card></Col>
      </Row>

      <Card title={t.rmt.remoteConn} extra={<Text type="secondary">{activeConn} {t.rmt.activeConns}</Text>}>
        <Table columns={connCols} dataSource={connections} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.rmt.updateManage} extra={<Text type="secondary">{pendingUpdates} {t.rmt.updatesAvailable}</Text>}>
        <Table columns={updateCols} dataSource={updates} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.rmt.itSecurity} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label={t.rmt.vpnServer}>OpenVPN 2.6 · Port 1194/UDP</Descriptions.Item>
          <Descriptions.Item label={t.rmt.encryption}>AES-256-GCM · TLS 1.3</Descriptions.Item>
          <Descriptions.Item label={t.rmt.authentication}>证书 + 双因素认证 (TOTP)</Descriptions.Item>
          <Descriptions.Item label={t.rmt.firewallLabel}>自控网络隔离 · 白名单</Descriptions.Item>
          <Descriptions.Item label={t.rmt.vendorAccessLabel}>限时 · 仅限指定设备</Descriptions.Item>
          <Descriptions.Item label={t.rmt.lastPentestLabel}>2026-01-15 · 无严重漏洞</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={t.rmt.connectVpn} open={vpnModal} onOk={() => { setVpnModal(false); message.success(t.rmt.vpnConnected) }} onCancel={() => setVpnModal(false)} okText={t.actions.connect} cancelText={t.actions.cancel}>
        <p>{t.rmt.vpnConfirm}</p>
        <p style={{ color: '#8c8c8c' }}>{t.rmt.vpnServerAddr}</p>
      </Modal>
    </div>
  )
}
