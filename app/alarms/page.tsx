'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, InputNumber, Select, message } from 'antd'
import { AlertOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const alarmList = [
  { key: '1', time: '14:23:05', device: 'AHU-01', content: 'Supply fan VFD fault', level: 'A', status: 'active' },
  { key: '2', time: '13:45:12', device: 'Chiller-02', content: 'Chilled water temp high', level: 'B', status: 'active' },
  { key: '3', time: '12:10:30', device: 'Room 301', content: 'CO2 above threshold', level: 'C', status: 'active' },
  { key: '4', time: '11:30:00', device: 'Boiler-01', content: 'Flame sensor warning', level: 'B', status: 'acknowledged' },
  { key: '5', time: '10:15:22', device: 'DDC-03', content: 'Communication timeout', level: 'B', status: 'recovered' },
  { key: '6', time: '09:00:00', device: 'DALI-GW', content: 'Bus error', level: 'C', status: 'recovered' },
]

const thresholds = [
  { key: '1', param: 'Room Temperature', lower: 18, upper: 28, level: 'B' },
  { key: '2', param: 'CO2 Concentration', lower: 0, upper: 1000, level: 'B' },
  { key: '3', param: 'Humidity', lower: 30, upper: 70, level: 'C' },
  { key: '4', param: 'Supply Water Temp', lower: 5, upper: 65, level: 'A' },
]

export default function AlarmsPage() {
  const { t } = useI18n()
  const [thresholdModal, setThresholdModal] = useState(false)

  const cols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 100 },
    { title: t.common.device, dataIndex: 'device', key: 'device' },
    { title: t.common.content, dataIndex: 'content', key: 'content' },
    { title: t.common.level, dataIndex: 'level', key: 'level', width: 120, render: (v: string) => {
      const map: Record<string, {color: string, icon: React.ReactNode, label: string}> = {
        A: { color: 'red', icon: <AlertOutlined />, label: t.alm.levelA },
        B: { color: 'orange', icon: <WarningOutlined />, label: t.alm.levelB },
        C: { color: 'blue', icon: <InfoCircleOutlined />, label: t.alm.levelC },
      }
      const m = map[v] || { color: 'default', icon: null, label: v }
      return <Tag color={m.color} icon={m.icon}>{m.label}</Tag>
    }},
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 100, render: (v: string) => {
      const color = v === 'active' ? 'red' : v === 'acknowledged' ? 'orange' : 'green'
      const label = v === 'active' ? t.common.active : v === 'acknowledged' ? t.alm.acknowledged : t.common.recovered
      return <Tag color={color}>{label}</Tag>
    }},
    { title: t.common.operation, key: 'op', width: 160, render: (_: any, r: any) => (
      <Space>
        {r.status === 'active' && <Button size="small" type="primary" ghost onClick={() => message.success(t.actions.acknowledge)}>{t.actions.acknowledge}</Button>}
        {r.status === 'active' && <Button size="small" onClick={() => message.info(t.actions.silence)}>{t.actions.silence}</Button>}
      </Space>
    )},
  ]

  const thCols = [
    { title: t.alm.param, dataIndex: 'param', key: 'param' },
    { title: t.alm.lowerLimit, dataIndex: 'lower', key: 'lower' },
    { title: t.alm.upperLimit, dataIndex: 'upper', key: 'upper' },
    { title: t.alm.alarmLevel, dataIndex: 'level', key: 'level', render: (v: string) => <Tag color={v === 'A' ? 'red' : v === 'B' ? 'orange' : 'blue'}>{v}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" type="link">{t.actions.edit}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.alarms}</Title><Text type="secondary">{t.alm.subtitle}</Text></div>
        <Space>
          <Button danger onClick={() => message.success(t.alm.acknowledgeAll)}>{t.alm.acknowledgeAll}</Button>
          <Button onClick={() => message.info(t.alm.silenceAll)}>{t.alm.silenceAll}</Button>
          <Button type="primary" onClick={() => setThresholdModal(true)}>{t.alm.configThreshold}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelA} value={1} valueStyle={{ color: '#f5222d' }} prefix={<AlertOutlined />} /><Text type="secondary">{t.alm.immediate}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelB} value={2} valueStyle={{ color: '#fa8c16' }} prefix={<WarningOutlined />} /><Text type="secondary">{t.alm.soon}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelC} value={1} valueStyle={{ color: '#1677ff' }} prefix={<InfoCircleOutlined />} /><Text type="secondary">{t.alm.planned}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.acknowledged} value={1} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /><Text type="secondary">{t.alm.responded}</Text></Card></Col>
      </Row>
      <Card title={t.alm.alarmList}><Table columns={cols} dataSource={alarmList} pagination={false} size="small" /></Card>
      <Card title={t.alm.thresholdConfig}><Table columns={thCols} dataSource={thresholds} pagination={false} size="small" /></Card>
      <Modal title={t.alm.configThreshold} open={thresholdModal} onOk={() => { setThresholdModal(false); message.success('OK') }} onCancel={() => setThresholdModal(false)} okText={t.actions.save} cancelText={t.actions.cancel} width={500}>
        <Form layout="vertical">
          <Form.Item label={t.alm.param}><Select options={[{value:'Temperature'},{value:'CO2'},{value:'Humidity'},{value:'Pressure'}]} /></Form.Item>
          <Space><Form.Item label={t.alm.lowerLimit}><InputNumber /></Form.Item><Form.Item label={t.alm.upperLimit}><InputNumber /></Form.Item></Space>
          <Form.Item label={t.alm.alarmLevel}><Select options={[{value:'A',label:'A'},{value:'B',label:'B'},{value:'C',label:'C'}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
