'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState, useMemo } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, InputNumber, Select, message } from 'antd'
import { AlertOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function AlarmsPage() {
  const { t } = useI18n()
  const [thresholdModal, setThresholdModal] = useState(false)

  const alarmList = useMemo(() => [
    { key: '1', time: '14:23:05', device: 'RLT-03 / VFD', deviceAddr: 'DDC-OG2-01.DI5', content: t.alm.alm1Content, level: 'A', status: 'active', floor: 'OG2' },
    { key: '2', time: '13:45:12', device: 'KM-02 / VL-Temp', deviceAddr: 'PLC-Kälte.AI3', content: t.alm.alm2Content, level: 'B', status: 'active', floor: 'UG' },
    { key: '3', time: '12:10:30', device: 'Raum 3.12 / CO₂', deviceAddr: 'DDC-OG3-02.AI2', content: t.alm.alm3Content, level: 'C', status: 'active', floor: 'OG3' },
    { key: '4', time: '11:30:00', device: 'Kessel-01 / Brenner', deviceAddr: 'PLC-Heizung.DI8', content: t.alm.alm4Content, level: 'B', status: 'acknowledged', floor: 'UG' },
    { key: '5', time: '10:52:18', device: 'DALI-GW-OG1', deviceAddr: '192.168.10.61', content: t.alm.alm5Content, level: 'C', status: 'active', floor: 'OG1' },
    { key: '6', time: '09:15:44', device: 'Kühlturm KT-01', deviceAddr: 'PLC-Kälte.DI12', content: t.alm.alm6Content, level: 'B', status: 'acknowledged', floor: t.alm.floorRoof },
    { key: '7', time: '08:42:10', device: 'DDC-OG2-02', deviceAddr: '192.168.10.122', content: t.alm.alm7Content, level: 'B', status: 'recovered', floor: 'OG2' },
    { key: '8', time: '07:30:00', device: 'HK-07 TWW', deviceAddr: 'PLC-Heizung.AI15', content: t.alm.alm8Content, level: 'A', status: 'recovered', floor: 'UG' },
    { key: '9', time: '06:15:22', device: 'Raum 2.10 / Temp', deviceAddr: 'DDC-OG2-02.AI1', content: t.alm.alm9Content, level: 'C', status: 'recovered', floor: 'OG2' },
    { key: '10', time: '02:00:00', device: 'BMS Server', deviceAddr: 'Server-01', content: t.alm.alm10Content, level: 'B', status: 'recovered', floor: 'UG' },
  ], [t])

  const thresholds = useMemo(() => [
    { key: '1', param: t.alm.paramIndoorTemp, lower: 18, upper: 28, unit: '°C', level: 'B', hysteresis: 1.0 },
    { key: '2', param: t.alm.paramCo2, lower: 0, upper: 1000, unit: 'ppm', level: 'B', hysteresis: 50 },
    { key: '3', param: t.alm.paramHumidity, lower: 30, upper: 70, unit: '%', level: 'C', hysteresis: 5 },
    { key: '4', param: t.alm.paramHeatSupply, lower: 30, upper: 70, unit: '°C', level: 'A', hysteresis: 2.0 },
    { key: '5', param: t.alm.paramCoolSupply, lower: 4, upper: 14, unit: '°C', level: 'A', hysteresis: 1.0 },
    { key: '6', param: t.alm.paramDhw, lower: 55, upper: 65, unit: '°C', level: 'A', hysteresis: 2.0 },
    { key: '7', param: t.alm.paramFilterDP, lower: 0, upper: 250, unit: 'Pa', level: 'C', hysteresis: 20 },
    { key: '8', param: t.alm.paramOutdoorTemp, lower: -20, upper: 40, unit: '°C', level: 'C', hysteresis: 2.0 },
  ], [t])

  const activeAlarms = alarmList.filter(a => a.status === 'active')
  const aLevel = activeAlarms.filter(a => a.level === 'A').length
  const bLevel = alarmList.filter(a => a.level === 'B' && a.status !== 'recovered').length
  const cLevel = alarmList.filter(a => a.level === 'C' && a.status !== 'recovered').length
  const ackCount = alarmList.filter(a => a.status === 'acknowledged').length

  const cols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 90 },
    { title: t.common.device, dataIndex: 'device', key: 'device', width: 140 },
    { title: t.common.address, dataIndex: 'deviceAddr', key: 'addr', width: 130, render: (v: string) => <Text code style={{ fontSize: 10 }}>{v}</Text> },
    { title: t.common.floor, dataIndex: 'floor', key: 'floor', width: 60 },
    { title: t.common.content, dataIndex: 'content', key: 'content' },
    { title: t.common.level, dataIndex: 'level', key: 'level', width: 110, render: (v: string) => {
      const map: Record<string, {color: string, icon: React.ReactNode, label: string}> = {
        A: { color: 'red', icon: <AlertOutlined />, label: t.alm.levelA },
        B: { color: 'orange', icon: <WarningOutlined />, label: t.alm.levelB },
        C: { color: 'blue', icon: <InfoCircleOutlined />, label: t.alm.levelC },
      }
      const m = map[v] || { color: 'default', icon: null, label: v }
      return <Tag color={m.color} icon={m.icon}>{m.label}</Tag>
    }},
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 90, render: (v: string) => {
      const color = v === 'active' ? 'red' : v === 'acknowledged' ? 'orange' : 'green'
      const label = v === 'active' ? t.common.active : v === 'acknowledged' ? t.alm.acknowledged : t.common.recovered
      return <Tag color={color}>{label}</Tag>
    }},
    { title: t.common.operation, key: 'op', width: 150, render: (_: any, r: any) => (
      <Space>
        {r.status === 'active' && <Button size="small" type="primary" ghost onClick={() => message.success(t.actions.acknowledge)}>{t.actions.acknowledge}</Button>}
        {r.status === 'active' && <Button size="small" onClick={() => message.info(t.actions.silence)}>{t.actions.silence}</Button>}
      </Space>
    )},
  ]

  const thCols = [
    { title: t.alm.param, dataIndex: 'param', key: 'param', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.alm.lowerLimit, dataIndex: 'lower', key: 'lower', width: 90 },
    { title: t.alm.upperLimit, dataIndex: 'upper', key: 'upper', width: 90 },
    { title: t.common.unit, dataIndex: 'unit', key: 'unit', width: 60 },
    { title: t.alm.hysteresis, dataIndex: 'hysteresis', key: 'hyst', width: 80 },
    { title: t.alm.alarmLevel, dataIndex: 'level', key: 'level', width: 80, render: (v: string) => <Tag color={v === 'A' ? 'red' : v === 'B' ? 'orange' : 'blue'}>{v}</Tag> },
    { title: t.common.operation, key: 'op', width: 80, render: () => <Button size="small" type="link">{t.actions.edit}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.alarms}</Title><Text type="secondary">{t.alm.subtitle} · DIN EN ISO 16484-3</Text></div>
        <Space>
          <Button danger onClick={() => message.success(t.alm.acknowledgeAll)}>{t.alm.acknowledgeAll}</Button>
          <Button onClick={() => message.info(t.alm.silenceAll)}>{t.alm.silenceAll}</Button>
          <Button type="primary" onClick={() => setThresholdModal(true)}>{t.alm.configThreshold}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelA} value={aLevel} valueStyle={{ color: aLevel > 0 ? '#f5222d' : '#52c41a' }} prefix={<AlertOutlined />} /><Text type="secondary">{t.alm.immediate}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelB} value={bLevel} valueStyle={{ color: bLevel > 0 ? '#fa8c16' : '#52c41a' }} prefix={<WarningOutlined />} /><Text type="secondary">{t.alm.soon}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.levelC} value={cLevel} valueStyle={{ color: '#1677ff' }} prefix={<InfoCircleOutlined />} /><Text type="secondary">{t.alm.planned}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.alm.acknowledged} value={ackCount} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /><Text type="secondary">{t.alm.responded}</Text></Card></Col>
      </Row>

      <Card title={t.alm.alarmList} extra={<Text type="secondary">{alarmList.length} {t.alm.recordsToday}</Text>}>
        <Table columns={cols} dataSource={alarmList} pagination={false} size="small" scroll={{ x: 1200 }} />
      </Card>

      <Card title={t.alm.thresholdConfig} extra={<Text type="secondary">{thresholds.length} {t.alm.paramsConfigured}</Text>}>
        <Table columns={thCols} dataSource={thresholds} pagination={false} size="small" />
      </Card>

      <Modal title={t.alm.configThreshold} open={thresholdModal} onOk={() => { setThresholdModal(false); message.success(t.alm.thresholdSaved) }} onCancel={() => setThresholdModal(false)} okText={t.actions.save} cancelText={t.actions.cancel} width={500}>
        <Form layout="vertical">
          <Form.Item label={t.alm.param}><Select options={thresholds.map(th => ({ value: th.param, label: `${th.param} (${th.unit})` }))} /></Form.Item>
          <Space style={{ width: '100%' }}><Form.Item label={t.alm.lowerLimit} style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item><Form.Item label={t.alm.upperLimit} style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item></Space>
          <Form.Item label="Hysterese"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={t.alm.alarmLevel}><Select options={[{value:'A',label:t.sched.urgentA},{value:'B',label:t.sched.importantB},{value:'C',label:t.sched.infoC}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
