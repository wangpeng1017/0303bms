'use client'

import { useI18n } from '@/components/i18n-provider'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Descriptions, message } from 'antd'
import { ApiOutlined, CheckCircleOutlined, WarningOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ifaces = [
  { key: '1', name: 'BACnet/IP', port: 47808, devices: 28, rate: '145 msg/s', status: 'online', uptime: '99.97%', version: 'Rev. 14', router: 'Loytec LGATE-950' },
  { key: '2', name: 'Modbus TCP', port: 502, devices: 22, rate: '68 msg/s', status: 'online', uptime: '99.85%', version: 'RTU/TCP', router: 'HMS Anybus X-gw' },
  { key: '3', name: 'KNX/IP', port: 3671, devices: 16, rate: '42 msg/s', status: 'online', uptime: '98.92%', version: 'KNXnet/IP', router: 'ABB IP/KNX Router' },
  { key: '4', name: 'DALI-2 / IP', port: 50000, devices: 12, rate: '0 msg/s', status: 'offline', uptime: '91.20%', version: 'DALI-2', router: 'Tridonic Gateway' },
  { key: '5', name: 'M-Bus / TCP', port: 5040, devices: 14, rate: '8 msg/s', status: 'online', uptime: '99.95%', version: 'EN 13757', router: 'Relay PadPuls M4' },
  { key: '6', name: 'OPC UA', port: 4840, devices: 6, rate: '35 msg/s', status: 'online', uptime: '99.98%', version: 'v1.04', router: 'Siemens Desigo CC' },
]

const events = [
  { key: '1', time: '14:23:05', iface: 'DALI-2 / IP', event: 'Verbindung verloren - Gateway OG3 (192.168.10.63) nicht erreichbar', level: 'error' },
  { key: '2', time: '14:20:00', iface: 'BACnet/IP', event: 'Device DDC-OG2-02 Timeout (30s) - Retry erfolgreich nach 5s', level: 'warning' },
  { key: '3', time: '13:45:10', iface: 'Modbus TCP', event: 'CRC-Fehler bei PLC-Kälte Register 40001-40010 (1x Retry OK)', level: 'warning' },
  { key: '4', time: '13:00:00', iface: 'M-Bus', event: 'Ablesung abgeschlossen: 14 Zähler, 168 Datenpunkte', level: 'info' },
  { key: '5', time: '12:30:15', iface: 'BACnet/IP', event: 'COV Subscription erneuert: DDC-OG1-01 (128 Objekte)', level: 'info' },
  { key: '6', time: '12:00:00', iface: 'KNX/IP', event: 'Gruppentelegramm empfangen: 320 Adressen aktiv', level: 'info' },
  { key: '7', time: '11:15:30', iface: 'OPC UA', event: 'Session verlängert: Siemens S7-1500 (Cert-based Auth)', level: 'info' },
  { key: '8', time: '08:00:00', iface: 'Alle', event: 'Tagesstatistik: 98 Geräte online, 2.710 Datenpunkte aktiv, 0.02% Fehlerrate', level: 'info' },
]

export default function InterfacesPage() {
  const { t } = useI18n()

  const totalDevices = ifaces.reduce((a, b) => a + b.devices, 0)
  const onlineIfaces = ifaces.filter(i => i.status === 'online').length
  const offlineIfaces = ifaces.filter(i => i.status === 'offline').length
  const totalRate = ifaces.reduce((a, b) => a + parseInt(b.rate), 0)

  const ifaceCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.version, dataIndex: 'version', key: 'version', width: 90 },
    { title: 'Gateway / Router', dataIndex: 'router', key: 'router', width: 160 },
    { title: t.iface.port, dataIndex: 'port', key: 'port', width: 70 },
    { title: t.common.device, dataIndex: 'devices', key: 'devices', width: 70, align: 'center' as const },
    { title: t.iface.rate, dataIndex: 'rate', key: 'rate', width: 90 },
    { title: 'Uptime', dataIndex: 'uptime', key: 'uptime', width: 80 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'red'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 180, render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" icon={<ReloadOutlined />} onClick={() => message.info(`${r.name} wird neu gestartet...`)}>{t.iface.restartIface}</Button>
        <Button size="small" type="link" icon={<SearchOutlined />} onClick={() => message.info(`Scan auf ${r.name}...`)}>{t.iface.scanDevices}</Button>
      </Space>
    )},
  ]

  const eventCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 90 },
    { title: t.common.protocol, dataIndex: 'iface', key: 'iface', width: 110 },
    { title: t.common.content, dataIndex: 'event', key: 'event' },
    { title: t.common.level, dataIndex: 'level', key: 'level', width: 80, render: (v: string) => <Tag color={v === 'error' ? 'red' : v === 'warning' ? 'orange' : 'blue'}>{v === 'error' ? t.status.alarm : v === 'warning' ? t.status.warning : t.iface.info}</Tag> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.interfaces}</Title><Text type="secondary">{t.iface.subtitle} · Multi-Protokoll Integration</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.totalProtocols} value={ifaces.length} prefix={<ApiOutlined />} /><Text type="secondary">{t.iface.configured}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.onlineDevices} value={totalDevices} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.offlineIface} value={offlineIfaces} valueStyle={{ color: offlineIfaces > 0 ? '#f5222d' : '#52c41a' }} prefix={<WarningOutlined />} /><Text type="secondary">{offlineIfaces > 0 ? t.iface.needFix : 'Alle OK'}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.iface.dataThroughput} value={totalRate} suffix={t.iface.msgPerSec} /></Card></Col>
      </Row>

      <Card title={t.iface.ifaceStatus} extra={<Text type="secondary">{onlineIfaces}/{ifaces.length} aktiv</Text>}>
        <Table columns={ifaceCols} dataSource={ifaces} pagination={false} size="small" scroll={{ x: 1000 }} />
      </Card>

      <Card title={t.iface.eventLog} extra={<Text type="secondary">Heute</Text>}>
        <Table columns={eventCols} dataSource={events} pagination={false} size="small" scroll={{ x: 800 }} />
      </Card>

      <Card title="Netzwerk-Infrastruktur" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label="GA-Netzwerk">VLAN 10 · 192.168.10.0/24 · 1 Gbit</Descriptions.Item>
          <Descriptions.Item label="Management">VLAN 20 · 192.168.20.0/24</Descriptions.Item>
          <Descriptions.Item label="Switch">Cisco Catalyst 2960-L · 2× PoE</Descriptions.Item>
          <Descriptions.Item label="BACnet Router">Loytec LGATE-950 · 2 Stück</Descriptions.Item>
          <Descriptions.Item label="Modbus Gateway">HMS Anybus X-gw · 1 Stück</Descriptions.Item>
          <Descriptions.Item label="Firewall">GA-Netz isoliert · nur Port 443 nach außen</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
