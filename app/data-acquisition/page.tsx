'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { DatabaseOutlined, ApiOutlined, ClockCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTrend() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    points: Math.round(1200 + Math.random() * 300 + (i > 8 && i < 18 ? 200 : 0)),
  }))
}

const protocols = [
  { key: '1', name: 'BACnet/IP', port: 47808, rate: '100 msg/s', devices: 24, points: 680, status: 'online' },
  { key: '2', name: 'Modbus TCP', port: 502, rate: '50 msg/s', devices: 18, points: 420, status: 'online' },
  { key: '3', name: 'KNX/IP', port: 3671, rate: '30 msg/s', devices: 12, points: 180, status: 'online' },
  { key: '4', name: 'DALI Gateway', port: 50000, rate: '20 msg/s', devices: 8, points: 96, status: 'warning' },
]

const devices = [
  { key: '1', name: 'DDC-01', protocol: 'BACnet/IP', address: '192.168.1.101', points: 128, status: 'online' },
  { key: '2', name: 'DDC-02', protocol: 'BACnet/IP', address: '192.168.1.102', points: 96, status: 'online' },
  { key: '3', name: 'PLC-01', protocol: 'Modbus TCP', address: '192.168.1.201', points: 64, status: 'online' },
  { key: '4', name: 'KNX-GW-01', protocol: 'KNX/IP', address: '192.168.1.50', points: 48, status: 'warning' },
  { key: '5', name: 'DALI-GW-01', protocol: 'DALI', address: '192.168.1.60', points: 32, status: 'offline' },
]

export default function DataAcquisitionPage() {
  const { t } = useI18n()
  const [trend] = useState(genTrend)
  const [addDeviceModal, setAddDeviceModal] = useState(false)
  const [scanModal, setScanModal] = useState(false)

  const protoCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.dataAcq.portLabel, dataIndex: 'port', key: 'port' },
    { title: t.dataAcq.rateLabel, dataIndex: 'rate', key: 'rate' },
    { title: t.dataAcq.deviceCount, dataIndex: 'devices', key: 'devices', align: 'center' as const },
    { title: t.dataAcq.pointCount, dataIndex: 'points', key: 'points', align: 'center' as const },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'green' : 'orange'}>{v === 'online' ? t.status.online : t.status.warning}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" type="link">{t.actions.settings}</Button> },
  ]

  const devCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name' },
    { title: t.common.protocol, dataIndex: 'protocol', key: 'protocol' },
    { title: 'IP', dataIndex: 'address', key: 'address' },
    { title: t.dataAcq.pointCount, dataIndex: 'points', key: 'points', align: 'center' as const },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'green' : v === 'warning' ? 'orange' : 'red'}>{v === 'online' ? t.status.online : v === 'warning' ? t.status.warning : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.dataAcquisition}</Title><Text type="secondary">{t.dataAcq.subtitle}</Text></div>
        <Space>
          <Button icon={<SearchOutlined />} onClick={() => { setScanModal(true); setTimeout(() => { setScanModal(false); message.success('Scan complete: 3 new devices found') }, 2000) }}>{t.dataAcq.scanNetwork}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDeviceModal(true)}>{t.dataAcq.addDevice}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.totalDevices} value={62} prefix={<DatabaseOutlined />} /><Text type="secondary">5 {t.common.protocol}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.dataPoints} value={1376} valueStyle={{ color: '#1677ff' }} /><Text type="secondary">{t.dataAcq.activePoints}: 1,340</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.onlineProtocols} value="4/4" valueStyle={{ color: '#52c41a' }} prefix={<ApiOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.collectFreq} value={5} suffix={t.dataAcq.secPerCycle} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>
      <Card title={t.dataAcq.trendTitle}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="points" name={t.dataAcq.activePoints} stroke="#1677ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.dataAcq.protocolStatus}><Table columns={protoCols} dataSource={protocols} pagination={false} size="small" /></Card>
      <Card title={t.dataAcq.deviceList}><Table columns={devCols} dataSource={devices} pagination={false} size="small" /></Card>
      <Modal title={t.dataAcq.addDevice} open={addDeviceModal} onOk={() => { setAddDeviceModal(false); message.success('OK') }} onCancel={() => setAddDeviceModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input placeholder="DDC-03" /></Form.Item>
          <Form.Item label={t.common.protocol}><Select options={[{value:'BACnet/IP'},{value:'Modbus TCP'},{value:'KNX/IP'},{value:'DALI'}]} placeholder={t.common.protocol} /></Form.Item>
          <Form.Item label="IP"><Input placeholder="192.168.1.x" /></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.dataAcq.scanNetwork} open={scanModal} footer={null} closable={false}><p>Scanning network...</p></Modal>
    </div>
  )
}
