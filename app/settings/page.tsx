'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Descriptions, Modal, message } from 'antd'
import { SettingOutlined, DatabaseOutlined, SafetyOutlined, CloudUploadOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const backups = [
  { key: '1', time: '2026-03-06 02:00', type: 'auto', size: '268 MB', items: 'DB + Trends + Config', status: 'success' },
  { key: '2', time: '2026-03-05 02:00', type: 'auto', size: '265 MB', items: 'DB + Trends + Config', status: 'success' },
  { key: '3', time: '2026-03-04 02:00', type: 'auto', size: '264 MB', items: 'DB + Trends + Config', status: 'success' },
  { key: '4', time: '2026-03-03 14:30', type: 'manual', size: '262 MB', items: 'Vollsicherung', status: 'success' },
  { key: '5', time: '2026-03-03 02:00', type: 'auto', size: '261 MB', items: 'DB + Trends + Config', status: 'success' },
  { key: '6', time: '2026-03-02 02:00', type: 'auto', size: '258 MB', items: 'DB + Trends + Config', status: 'failed' },
  { key: '7', time: '2026-03-01 02:00', type: 'auto', size: '256 MB', items: 'DB + Trends + Config', status: 'success' },
]

export default function SettingsPage() {
  const { t } = useI18n()
  const [backupModal, setBackupModal] = useState(false)

  const backupCols = [
    { title: t.set.backupTime, dataIndex: 'time', key: 'time' },
    { title: t.set.backupType, dataIndex: 'type', key: 'type', width: 80, render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'green'}>{v === 'auto' ? t.set.autoBackup : t.set.manualBackup}</Tag> },
    { title: 'Inhalt', dataIndex: 'items', key: 'items' },
    { title: t.set.backupSize, dataIndex: 'size', key: 'size', width: 80 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'success' ? 'green' : 'red'}>{v === 'success' ? t.set.success : t.set.failed}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: (_: any, r: any) => <Space><Button size="small" type="link">{t.common.download}</Button>{r.status === 'success' && <Button size="small" type="link">Restore</Button>}</Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.settings}</Title><Text type="secondary">{t.set.subtitle}</Text></div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => message.info(t.set.restartService)}>{t.set.restartService}</Button>
          <Button icon={<ClearOutlined />} onClick={() => message.success(t.set.clearCache)}>{t.set.clearCache}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.sysStatus} value={t.set.running} valueStyle={{ color: '#52c41a' }} prefix={<SettingOutlined />} /><Text type="secondary">428 {t.set.days}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.database} value={t.status.online} valueStyle={{ color: '#52c41a' }} prefix={<DatabaseOutlined />} /><Text type="secondary">PostgreSQL 16.2 · 42 GB</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.securityLevel} value="A+" valueStyle={{ color: '#52c41a' }} prefix={<SafetyOutlined />} /><Text type="secondary">TLS 1.3 · Cert valid</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.lastBackup} value={t.set.todayAuto} prefix={<CloudUploadOutlined />} /><Text type="secondary">268 MB · 02:00</Text></Card></Col>
      </Row>

      <Card title={t.set.sysInfo}>
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 2 }}>
          <Descriptions.Item label="BMS Software">Siemens Desigo CC v6.0.2</Descriptions.Item>
          <Descriptions.Item label="Server">Linux Ubuntu 22.04 / 8 Core Xeon / 32GB ECC</Descriptions.Item>
          <Descriptions.Item label="Datenbank">PostgreSQL 16.2 · 42 GB (Trend: 38 GB)</Descriptions.Item>
          <Descriptions.Item label="Betriebszeit">428 Tage (seit 2025-01-03)</Descriptions.Item>
          <Descriptions.Item label="CPU-Auslastung">18% (Ø 24h: 22%)</Descriptions.Item>
          <Descriptions.Item label="Arbeitsspeicher">12.4 / 32 GB (39%)</Descriptions.Item>
          <Descriptions.Item label="Festplatte">142 / 500 GB SSD RAID-1 (28%)</Descriptions.Item>
          <Descriptions.Item label="Netzwerk">1 Gbit LAN · GA-VLAN 10</Descriptions.Item>
          <Descriptions.Item label="TLS-Zertifikat">Let's Encrypt · gültig bis 2026-06-15</Descriptions.Item>
          <Descriptions.Item label="Lizenz">Desigo CC Enterprise · 3.000 Datenpunkte</Descriptions.Item>
          <Descriptions.Item label="Firmware DDC">Siemens PXC v3.02.18 (9 Geräte)</Descriptions.Item>
          <Descriptions.Item label="USV">APC Smart-UPS 3000 · 45 min Autonomie</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t.set.dataBackup} extra={<Button type="primary" icon={<CloudUploadOutlined />} onClick={() => { setBackupModal(true); setTimeout(() => { setBackupModal(false); message.success('Sicherung abgeschlossen (268 MB)') }, 2000) }}>{t.set.backupNow}</Button>}>
        <Table columns={backupCols} dataSource={backups} pagination={false} size="small" />
      </Card>

      <Card title="Wartungsplan" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label="Filterwechsel RLT">2026-03-20 (fällig)</Descriptions.Item>
          <Descriptions.Item label="Kesselwartung">2026-04-15</Descriptions.Item>
          <Descriptions.Item label="Kältemaschine">2026-05-10</Descriptions.Item>
          <Descriptions.Item label="USV Batterietest">2026-04-01</Descriptions.Item>
          <Descriptions.Item label="Server-Wartung">2026-06-01</Descriptions.Item>
          <Descriptions.Item label="Brandschutzklappen">2026-09-15</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={t.set.backupNow} open={backupModal} footer={null} closable={false}><p>Datensicherung läuft... (DB + Trends + Config)</p></Modal>
    </div>
  )
}
