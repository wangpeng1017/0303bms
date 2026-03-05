'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, InputNumber, Form, message } from 'antd'
import { ExperimentOutlined, DashboardOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

const zones = [
  { key: '1', name: 'Office A', actual: 24.2, setpoint: 23.0, valve: 72, kp: 2.5, ki: 0.8, kd: 0.3, status: 'cooling' },
  { key: '2', name: 'Meeting B', actual: 22.8, setpoint: 23.0, valve: 15, kp: 2.0, ki: 0.6, kd: 0.2, status: 'idle' },
  { key: '3', name: 'Lobby C', actual: 25.1, setpoint: 24.0, valve: 88, kp: 3.0, ki: 1.0, kd: 0.4, status: 'cooling' },
  { key: '4', name: 'Server D', actual: 21.2, setpoint: 21.0, valve: 30, kp: 1.5, ki: 0.5, kd: 0.1, status: 'idle' },
]

function genPid() {
  return Array.from({ length: 61 }, (_, i) => {
    const sp = 23.0
    const actual = sp + Math.sin((60 - i) / 10) * 1.5 * Math.exp(-(60 - i) / 40) + (Math.random() - 0.5) * 0.3
    return {
      time: new Date(Date.now() - (60 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: Number(actual.toFixed(1)), setpoint: sp,
      output: Math.max(0, Math.min(100, Math.round((actual - sp) * 30 + 50))),
    }
  })
}

export default function CoolingPage() {
  const { t } = useI18n()
  const [data] = useState(genPid)
  const [pidModal, setPidModal] = useState(false)
  const [selectedZone, setSelectedZone] = useState<any>(null)

  const cols = [
    { title: t.cool.zone, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.cool.actualTemp, dataIndex: 'actual', key: 'actual', align: 'center' as const, render: (v: number, r: any) => <Text style={{ color: v > r.setpoint ? '#f5222d' : '#1677ff', fontWeight: 600 }}>{v}°C</Text> },
    { title: t.heat.setpoint, dataIndex: 'setpoint', key: 'setpoint', align: 'center' as const, render: (v: number) => `${v}°C` },
    { title: 'Kp', dataIndex: 'kp', key: 'kp', align: 'center' as const },
    { title: 'Ki', dataIndex: 'ki', key: 'ki', align: 'center' as const },
    { title: 'Kd', dataIndex: 'kd', key: 'kd', align: 'center' as const },
    { title: t.heat.valvePos, dataIndex: 'valve', key: 'valve', align: 'center' as const, render: (v: number) => <Progress percent={v} size="small" style={{ width: 80 }} /> },
    { title: t.common.status, dataIndex: 'status', key: 'status', align: 'center' as const, render: (v: string) => <Tag color={v === 'cooling' ? 'blue' : 'default'}>{v === 'cooling' ? t.cool.cooling : t.cool.standby}</Tag> },
    { title: t.common.operation, key: 'op', align: 'center' as const, render: (_: any, r: any) => <Button size="small" type="link" onClick={() => { setSelectedZone(r); setPidModal(true) }}>{t.cool.adjustPid}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.cooling}</Title><Text type="secondary">{t.cool.subtitle}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.chilledSupply} value={7} suffix="°C" valueStyle={{ color: '#1677ff' }} prefix={<ExperimentOutlined />} /><Text type="secondary">{t.cool.returnWater} 12°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.coolingPower} value={142} suffix="kW" /><Text type="secondary">{t.cool.totalCapacity} 200kW</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.coolingZones} value="2/4" valueStyle={{ color: '#13c2c2' }} /><Text type="secondary">{t.common.running}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.cop} value={4.2} valueStyle={{ color: '#52c41a' }} prefix={<DashboardOutlined />} /></Card></Col>
      </Row>
      <Card title={t.cool.pidCurve}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" fontSize={11} /><YAxis yAxisId="t" fontSize={11} domain={[20, 26]} /><YAxis yAxisId="o" orientation="right" fontSize={11} domain={[0, 100]} />
            <Tooltip /><Legend />
            <Line yAxisId="t" type="monotone" dataKey="actual" name={`${t.cool.actualTemp} (°C)`} stroke="#1677ff" strokeWidth={2} dot={false} />
            <Line yAxisId="t" type="monotone" dataKey="setpoint" name={`${t.heat.setpoint} (°C)`} stroke="#d9d9d9" strokeDasharray="5 5" dot={false} />
            <Line yAxisId="o" type="monotone" dataKey="output" name={`${t.cool.output} (%)`} stroke="#fa8c16" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.cool.pidParams}><Table columns={cols} dataSource={zones} pagination={false} size="small" /></Card>
      <Modal title={`${t.cool.adjustPid} - ${selectedZone?.name || ''}`} open={pidModal} onOk={() => { setPidModal(false); message.success('PID updated') }} onCancel={() => setPidModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.cool.proportional + ' (Kp)'}><InputNumber defaultValue={selectedZone?.kp} step={0.1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={t.cool.integral + ' (Ki)'}><InputNumber defaultValue={selectedZone?.ki} step={0.1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={t.cool.derivative + ' (Kd)'}><InputNumber defaultValue={selectedZone?.kd} step={0.1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
