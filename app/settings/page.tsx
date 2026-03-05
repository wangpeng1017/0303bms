'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Descriptions, Modal, message } from 'antd'
import { SettingOutlined, DatabaseOutlined, SafetyOutlined, CloudUploadOutlined, ClockCircleOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const backups = [
  { key: '1', time: '2026-03-05 02:00', type: 'auto', size: '256 MB', status: 'success' },
  { key: '2', time: '2026-03-04 02:00', type: 'auto', size: '254 MB', status: 'success' },
  { key: '3', time: '2026-03-03 14:30', type: 'manual', size: '253 MB', status: 'success' },
  { key: '4', time: '2026-03-02 02:00', type: 'auto', size: '251 MB', status: 'failed' },
]

export default function SettingsPage() {
  const { t } = useI18n()
  const [backupModal, setBackupModal] = useState(false)

  const backupCols = [
    { title: t.set.backupTime, dataIndex: 'time', key: 'time' },
    { title: t.set.backupType, dataIndex: 'type', key: 'type', render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'green'}>{v === 'auto' ? t.set.autoBackup : t.set.manualBackup}</Tag> },
    { title: t.set.backupSize, dataIndex: 'size', key: 'size' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'success' ? 'green' : 'red'}>{v === 'success' ? t.set.success : t.set.failed}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" type="link">{t.common.download}</Button> },
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
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.sysStatus} value={t.set.running} valueStyle={{ color: '#52c41a' }} prefix={<SettingOutlined />} /><Text type="secondary">365 {t.set.days}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.database} value={t.status.online} valueStyle={{ color: '#52c41a' }} prefix={<DatabaseOutlined />} /><Text type="secondary">PostgreSQL 16</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.securityLevel} value="A+" valueStyle={{ color: '#52c41a' }} prefix={<SafetyOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.set.lastBackup} value={t.set.todayAuto} prefix={<CloudUploadOutlined />} /></Card></Col>
      </Row>
      <Card title={t.set.sysInfo}>
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="BMS Version">v1.0.0</Descriptions.Item>
          <Descriptions.Item label="Server">Linux 5.15 / 8 Core / 16GB</Descriptions.Item>
          <Descriptions.Item label="Database">PostgreSQL 16.2</Descriptions.Item>
          <Descriptions.Item label="Uptime">365 days</Descriptions.Item>
          <Descriptions.Item label="CPU">23%</Descriptions.Item>
          <Descriptions.Item label="Memory">8.2 / 16 GB (51%)</Descriptions.Item>
          <Descriptions.Item label="Disk">120 / 500 GB (24%)</Descriptions.Item>
          <Descriptions.Item label="Network">1 Gbps</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={t.set.dataBackup} extra={<Button type="primary" icon={<CloudUploadOutlined />} onClick={() => { setBackupModal(true); setTimeout(() => { setBackupModal(false); message.success('Backup complete') }, 2000) }}>{t.set.backupNow}</Button>}>
        <Table columns={backupCols} dataSource={backups} pagination={false} size="small" />
      </Card>
      <Modal title={t.set.backupNow} open={backupModal} footer={null} closable={false}><p>Backup in progress...</p></Modal>
    </div>
  )
}
