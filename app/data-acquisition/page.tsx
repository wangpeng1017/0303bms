'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, Descriptions, message } from 'antd'
import { DatabaseOutlined, ApiOutlined, ClockCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTrend() {
  return Array.from({ length: 24 }, (_, i) => {
    const workHour = i >= 7 && i <= 19
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      points: Math.round(1680 + (workHour ? 420 : 0) + (Math.random() - 0.5) * 150),
      errors: Math.round(2 + Math.random() * 5),
    }
  })
}

const protocols = [
  { key: '1', name: 'BACnet/IP', port: 47808, rate: '145 msg/s', devices: 28, points: 1240, status: 'online', version: 'Rev. 14' },
  { key: '2', name: 'Modbus TCP', port: 502, rate: '68 msg/s', devices: 22, points: 580, status: 'online', version: 'RTU/TCP' },
  { key: '3', name: 'KNX/IP', port: 3671, rate: '42 msg/s', devices: 16, points: 320, status: 'online', version: 'KNXnet/IP' },
  { key: '4', name: 'DALI-2 Gateway', port: 50000, rate: '25 msg/s', devices: 12, points: 192, status: 'warning', version: 'DALI-2' },
  { key: '5', name: 'M-Bus', port: 5040, rate: '8 msg/s', devices: 14, points: 168, status: 'online', version: 'EN 13757' },
  { key: '6', name: 'OPC UA', port: 4840, rate: '35 msg/s', devices: 6, points: 210, status: 'online', version: 'v1.04' },
]

const devices = [
  { key: '1', name: 'DDC-EG-01', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.101', bacnetId: 101, points: 128, floor: 'EG', status: 'online' },
  { key: '2', name: 'DDC-EG-02', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.102', bacnetId: 102, points: 96, floor: 'EG', status: 'online' },
  { key: '3', name: 'DDC-OG1-01', type: 'Siemens PXC50', protocol: 'BACnet/IP', address: '192.168.10.111', bacnetId: 111, points: 192, floor: 'OG1', status: 'online' },
  { key: '4', name: 'DDC-OG1-02', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.112', bacnetId: 112, points: 128, floor: 'OG1', status: 'online' },
  { key: '5', name: 'DDC-OG2-01', type: 'Siemens PXC50', protocol: 'BACnet/IP', address: '192.168.10.121', bacnetId: 121, points: 192, floor: 'OG2', status: 'online' },
  { key: '6', name: 'DDC-OG2-02', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.122', bacnetId: 122, points: 96, floor: 'OG2', status: 'warning' },
  { key: '7', name: 'DDC-OG3-01', type: 'Siemens PXC50', protocol: 'BACnet/IP', address: '192.168.10.131', bacnetId: 131, points: 192, floor: 'OG3', status: 'online' },
  { key: '8', name: 'DDC-OG3-02', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.132', bacnetId: 132, points: 96, floor: 'OG3', status: 'online' },
  { key: '9', name: 'DDC-UG-01', type: 'Siemens PXC36', protocol: 'BACnet/IP', address: '192.168.10.91', bacnetId: 91, points: 64, floor: 'UG', status: 'online' },
  { key: '10', name: 'PLC-Heizung', type: 'Siemens S7-1500', protocol: 'Modbus TCP', address: '192.168.10.201', bacnetId: 0, points: 86, floor: 'UG', status: 'online' },
  { key: '11', name: 'PLC-Kälte', type: 'Siemens S7-1200', protocol: 'Modbus TCP', address: '192.168.10.202', bacnetId: 0, points: 72, floor: 'UG', status: 'online' },
  { key: '12', name: 'KNX-GW-01', type: 'ABB IP Interface', protocol: 'KNX/IP', address: '192.168.10.50', bacnetId: 0, points: 180, floor: 'EG', status: 'online' },
  { key: '13', name: 'DALI-GW-EG', type: 'Tridonic IP', protocol: 'DALI-2 Gateway', address: '192.168.10.60', bacnetId: 0, points: 48, floor: 'EG', status: 'online' },
  { key: '14', name: 'DALI-GW-OG1', type: 'Tridonic IP', protocol: 'DALI-2 Gateway', address: '192.168.10.61', bacnetId: 0, points: 48, floor: 'OG1', status: 'warning' },
  { key: '15', name: 'DALI-GW-OG2', type: 'Tridonic IP', protocol: 'DALI-2 Gateway', address: '192.168.10.62', bacnetId: 0, points: 48, floor: 'OG2', status: 'online' },
  { key: '16', name: 'DALI-GW-OG3', type: 'Tridonic IP', protocol: 'DALI-2 Gateway', address: '192.168.10.63', bacnetId: 0, points: 48, floor: 'OG3', status: 'offline' },
]

export default function DataAcquisitionPage() {
  const { t } = useI18n()
  const [trend] = useState(genTrend)
  const [addDeviceModal, setAddDeviceModal] = useState(false)
  const [scanModal, setScanModal] = useState(false)

  const totalPoints = devices.reduce((a, b) => a + b.points, 0)
  const onlineDevices = devices.filter(d => d.status === 'online').length

  const protoCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.version, dataIndex: 'version', key: 'version', width: 100 },
    { title: t.dataAcq.portLabel, dataIndex: 'port', key: 'port', width: 80 },
    { title: t.dataAcq.rateLabel, dataIndex: 'rate', key: 'rate', width: 100 },
    { title: t.dataAcq.deviceCount, dataIndex: 'devices', key: 'devices', width: 80, align: 'center' as const },
    { title: t.dataAcq.pointCount, dataIndex: 'points', key: 'points', width: 80, align: 'center' as const },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'orange'}>{v === 'online' ? t.status.online : t.status.warning}</Tag> },
    { title: t.common.operation, key: 'op', width: 80, render: () => <Button size="small" type="link">{t.actions.settings}</Button> },
  ]

  const devCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Typ', dataIndex: 'type', key: 'type', width: 130 },
    { title: t.common.protocol, dataIndex: 'protocol', key: 'protocol', width: 110 },
    { title: 'IP', dataIndex: 'address', key: 'address', width: 130, render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
    { title: 'BACnet ID', dataIndex: 'bacnetId', key: 'bacnetId', width: 85, render: (v: number) => v > 0 ? v : '-' },
    { title: 'Etage', dataIndex: 'floor', key: 'floor', width: 60 },
    { title: t.dataAcq.pointCount, dataIndex: 'points', key: 'points', width: 70, align: 'center' as const },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : v === 'warning' ? 'orange' : 'red'}>{v === 'online' ? t.status.online : v === 'warning' ? t.status.warning : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.dataAcquisition}</Title><Text type="secondary">{t.dataAcq.subtitle} · Siemens Desigo CC</Text></div>
        <Space>
          <Button icon={<SearchOutlined />} onClick={() => { setScanModal(true); setTimeout(() => { setScanModal(false); message.success('Netzwerk-Scan abgeschlossen: 2 neue Geräte gefunden') }, 2000) }}>{t.dataAcq.scanNetwork}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDeviceModal(true)}>{t.dataAcq.addDevice}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.totalDevices} value={devices.length} prefix={<DatabaseOutlined />} /><Text type="secondary">{protocols.length} Protokolle</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.dataPoints} value={totalPoints.toLocaleString()} valueStyle={{ color: '#1677ff' }} /><Text type="secondary">{t.dataAcq.activePoints}: {(totalPoints - 48).toLocaleString()}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.status.online} value={`${onlineDevices}/${devices.length}`} valueStyle={{ color: '#52c41a' }} prefix={<ApiOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.dataAcq.collectFreq} value={5} suffix={t.dataAcq.secPerCycle} prefix={<ClockCircleOutlined />} /><Text type="secondary">COV + Polling</Text></Card></Col>
      </Row>

      <Card title={t.dataAcq.trendTitle}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="points" name={t.dataAcq.activePoints} stroke="#1677ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.dataAcq.protocolStatus}><Table columns={protoCols} dataSource={protocols} pagination={false} size="small" /></Card>

      <Card title={t.dataAcq.deviceList} extra={<Text type="secondary">{devices.length} Geräte · 5 Etagen</Text>}>
        <Table columns={devCols} dataSource={devices} pagination={{ pageSize: 10, size: 'small' }} size="small" scroll={{ x: 1100 }} />
      </Card>

      <Card title="Netzwerk-Topologie" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label="Management-Server">Siemens Desigo CC · v6.0</Descriptions.Item>
          <Descriptions.Item label="Netzwerk">VLAN 10 (GA) · 192.168.10.0/24</Descriptions.Item>
          <Descriptions.Item label="BACnet Router">Loytec LGATE-950 · 2 Stück</Descriptions.Item>
          <Descriptions.Item label="Datenbank">PostgreSQL 16 · 42 GB</Descriptions.Item>
          <Descriptions.Item label="Backup">Täglich 02:00 · 30 Tage</Descriptions.Item>
          <Descriptions.Item label="Zykluszeit">5s Polling / COV Subscription</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={t.dataAcq.addDevice} open={addDeviceModal} onOk={() => { setAddDeviceModal(false); message.success('Gerät hinzugefügt') }} onCancel={() => setAddDeviceModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input placeholder="DDC-OG4-01" /></Form.Item>
          <Form.Item label="Gerätetyp"><Select options={[{value:'Siemens PXC36'},{value:'Siemens PXC50'},{value:'Siemens S7-1200'},{value:'Siemens S7-1500'},{value:'ABB IP Interface'},{value:'Tridonic DALI-2'}]} /></Form.Item>
          <Form.Item label={t.common.protocol}><Select options={[{value:'BACnet/IP'},{value:'Modbus TCP'},{value:'KNX/IP'},{value:'DALI-2'},{value:'M-Bus'},{value:'OPC UA'}]} /></Form.Item>
          <Form.Item label="IP-Adresse"><Input placeholder="192.168.10.xxx" /></Form.Item>
          <Form.Item label="Etage"><Select options={[{value:'UG'},{value:'EG'},{value:'OG1'},{value:'OG2'},{value:'OG3'}]} /></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.dataAcq.scanNetwork} open={scanModal} footer={null} closable={false}><p>Netzwerk wird gescannt (192.168.10.0/24)...</p></Modal>
    </div>
  )
}
