'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, InputNumber, Form, Descriptions, message } from 'antd'
import { ExperimentOutlined, DashboardOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

const zones = [
  { key: '1', name: 'OG1 北侧开放办公区', actual: 23.4, setpoint: 23.0, valve: 68, kp: 2.5, ki: 0.8, kd: 0.3, status: 'cooling', ddcAddr: 'DDC-OG1-01.AO3' },
  { key: '2', name: 'OG1 南侧开放办公区', actual: 22.8, setpoint: 23.0, valve: 12, kp: 2.5, ki: 0.8, kd: 0.3, status: 'idle', ddcAddr: 'DDC-OG1-01.AO4' },
  { key: '3', name: 'OG2 西侧办公区', actual: 24.1, setpoint: 23.0, valve: 82, kp: 2.2, ki: 0.7, kd: 0.2, status: 'cooling', ddcAddr: 'DDC-OG2-01.AO3' },
  { key: '4', name: 'OG2 会议室 2.10', actual: 25.2, setpoint: 23.0, valve: 95, kp: 3.0, ki: 1.0, kd: 0.4, status: 'cooling', ddcAddr: 'DDC-OG2-02.AO1' },
  { key: '5', name: 'OG3 东侧办公区', actual: 22.6, setpoint: 23.0, valve: 8, kp: 2.0, ki: 0.6, kd: 0.2, status: 'idle', ddcAddr: 'DDC-OG3-01.AO3' },
  { key: '6', name: 'OG3 会议室 3.12', actual: 24.8, setpoint: 23.0, valve: 88, kp: 3.0, ki: 1.0, kd: 0.4, status: 'cooling', ddcAddr: 'DDC-OG3-02.AO1' },
  { key: '7', name: 'EG 前台区域', actual: 23.2, setpoint: 23.0, valve: 22, kp: 2.0, ki: 0.6, kd: 0.2, status: 'idle', ddcAddr: 'DDC-EG-01.AO3' },
  { key: '8', name: 'UG 机房', actual: 21.1, setpoint: 21.0, valve: 35, kp: 1.5, ki: 0.5, kd: 0.1, status: 'cooling', ddcAddr: 'DDC-UG-01.AO1' },
]

function genPid() {
  return Array.from({ length: 61 }, (_, i) => {
    const sp = 23.0
    const actual = sp + Math.sin((60 - i) / 10) * 1.8 * Math.exp(-(60 - i) / 35) + (Math.random() - 0.5) * 0.25
    return {
      time: new Date(Date.now() - (60 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: Number(actual.toFixed(1)),
      setpoint: sp,
      output: Math.max(0, Math.min(100, Math.round((actual - sp) * 35 + 50))),
    }
  })
}

export default function CoolingPage() {
  const { t } = useI18n()
  const [data] = useState(genPid)
  const [pidModal, setPidModal] = useState(false)
  const [selectedZone, setSelectedZone] = useState<any>(null)

  const coolingZones = zones.filter(z => z.status === 'cooling').length
  const totalCoolingPower = Math.round(zones.reduce((a, z) => a + z.valve * 1.8, 0))

  const cols = [
    { title: t.cool.zone, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'DDC Addr', dataIndex: 'ddcAddr', key: 'ddcAddr', width: 130, render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
    { title: t.cool.actualTemp, dataIndex: 'actual', key: 'actual', width: 80, align: 'center' as const, render: (v: number, r: any) => <Text style={{ color: v > r.setpoint + 0.5 ? '#f5222d' : v < r.setpoint - 0.5 ? '#1677ff' : '#52c41a', fontWeight: 600 }}>{v}°C</Text> },
    { title: t.heat.setpoint, dataIndex: 'setpoint', key: 'setpoint', width: 70, align: 'center' as const, render: (v: number) => `${v}°C` },
    { title: 'Kp', dataIndex: 'kp', key: 'kp', width: 50, align: 'center' as const },
    { title: 'Ki', dataIndex: 'ki', key: 'ki', width: 50, align: 'center' as const },
    { title: 'Kd', dataIndex: 'kd', key: 'kd', width: 50, align: 'center' as const },
    { title: t.heat.valvePos, dataIndex: 'valve', key: 'valve', width: 100, align: 'center' as const, render: (v: number) => <Progress percent={v} size="small" style={{ width: 70 }} /> },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, align: 'center' as const, render: (v: string) => <Tag color={v === 'cooling' ? 'blue' : 'default'}>{v === 'cooling' ? t.cool.cooling : t.cool.standby}</Tag> },
    { title: t.common.operation, key: 'op', width: 100, align: 'center' as const, render: (_: any, r: any) => <Button size="small" type="link" onClick={() => { setSelectedZone(r); setPidModal(true) }}>{t.cool.adjustPid}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.cooling}</Title><Text type="secondary">{t.cool.subtitle} · Carrier 30RB-262 (2×130kW)</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.chilledSupply} value={6.8} suffix="°C" valueStyle={{ color: '#1677ff' }} prefix={<ExperimentOutlined />} /><Text type="secondary">{t.cool.returnWater} 12.3°C · ΔT 5.5°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.coolingPower} value={totalCoolingPower} suffix="kW" /><Text type="secondary">{t.cool.totalCapacity} 260kW</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.coolingZones} value={`${coolingZones}/${zones.length}`} valueStyle={{ color: '#13c2c2' }} /><Text type="secondary">{t.common.running}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.cool.cop} value={4.35} valueStyle={{ color: '#52c41a' }} prefix={<DashboardOutlined />} /><Text type="secondary">{t.cool.ratedCop}: 4.8</Text></Card></Col>
      </Row>

      <Card title={t.cool.pidCurve} extra={<Text type="secondary">区域: OG2 会议室 2.10 · {t.cool.samplingCycle}</Text>}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" fontSize={11} />
            <YAxis yAxisId="t" fontSize={11} domain={[20, 27]} />
            <YAxis yAxisId="o" orientation="right" fontSize={11} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line yAxisId="t" type="monotone" dataKey="actual" name={`${t.cool.actualTemp} (°C)`} stroke="#1677ff" strokeWidth={2} dot={false} />
            <Line yAxisId="t" type="monotone" dataKey="setpoint" name={`${t.heat.setpoint} (°C)`} stroke="#d9d9d9" strokeDasharray="5 5" dot={false} />
            <Line yAxisId="o" type="monotone" dataKey="output" name={`${t.cool.output} (%)`} stroke="#fa8c16" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.cool.pidParams} extra={<Text type="secondary">{zones.length} {t.cool.controlZones}</Text>}>
        <Table columns={cols} dataSource={zones} pagination={false} size="small" scroll={{ x: 1100 }} />
      </Card>

      <Card title={t.cool.chillerEquip} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label={t.cool.chiller1}>Carrier 30RB-262 · 130kW · <Tag color="green">Betrieb</Tag></Descriptions.Item>
          <Descriptions.Item label={t.cool.chiller2}>Carrier 30RB-262 · 130kW · <Tag color="orange">{t.cool.standbyLabel}</Tag></Descriptions.Item>
          <Descriptions.Item label={t.cool.refrigerant}>R-410A · 充注量 28kg/台</Descriptions.Item>
          <Descriptions.Item label={t.cool.coolingTower}>冷却塔 BAC FXT-18 · 32°C</Descriptions.Item>
          <Descriptions.Item label={t.cool.coldStorage}>1.500L · 7.2°C</Descriptions.Item>
          <Descriptions.Item label={t.cool.operatingHours}>6,820h / 3,140h</Descriptions.Item>
          <Descriptions.Item label={t.cool.nextMaint}>2026-05-10</Descriptions.Item>
          <Descriptions.Item label={t.cool.compressorLoad}>75% / 0%</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={`${t.cool.adjustPid} - ${selectedZone?.name || ''}`} open={pidModal} onOk={() => { setPidModal(false); message.success(t.cool.pidUpdated) }} onCancel={() => setPidModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.cool.proportional} (Kp)`}><InputNumber defaultValue={selectedZone?.kp} step={0.1} min={0.5} max={10} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={`${t.cool.integral} (Ki)`}><InputNumber defaultValue={selectedZone?.ki} step={0.1} min={0} max={5} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={`${t.cool.derivative} (Kd)`}><InputNumber defaultValue={selectedZone?.kd} step={0.1} min={0} max={2} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
