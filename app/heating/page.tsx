'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, Slider, Descriptions, message } from 'antd'
import { FireOutlined, DashboardOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTemp() {
  return Array.from({ length: 24 }, (_, i) => {
    const nightSetback = i < 6 || i > 21
    const baseSupply = nightSetback ? 42 : 55
    const baseReturn = nightSetback ? 32 : 40
    return {
      hour: `${String(i).padStart(2, '00')}:00`,
      supply: +(baseSupply + Math.sin(i / 4) * 3 + (Math.random() - 0.5) * 1.5).toFixed(1),
      return_: +(baseReturn + Math.sin(i / 4) * 2 + (Math.random() - 0.5) * 1.2).toFixed(1),
      outdoor: +(3 + Math.sin((i - 6) / 24 * Math.PI * 2) * 4 + (Math.random() - 0.5) * 1).toFixed(1),
    }
  })
}

const circuits = [
  { key: '1', name: 'HK-01 北翼 EG-OG1', supply: 55.3, return_: 40.2, setpoint: 55, valve: 78, pump: 82, mode: 'auto', status: 'running', curve: '1.4' },
  { key: '2', name: 'HK-02 南翼 EG-OG1', supply: 54.1, return_: 39.8, setpoint: 55, valve: 65, pump: 75, mode: 'auto', status: 'running', curve: '1.4' },
  { key: '3', name: 'HK-03 北翼 OG2-OG3', supply: 53.8, return_: 41.0, setpoint: 54, valve: 72, pump: 70, mode: 'auto', status: 'running', curve: '1.2' },
  { key: '4', name: 'HK-04 南翼 OG2-OG3', supply: 52.5, return_: 38.5, setpoint: 54, valve: 58, pump: 68, mode: 'auto', status: 'running', curve: '1.2' },
  { key: '5', name: 'HK-05 RLT 再加热', supply: 50.2, return_: 37.8, setpoint: 50, valve: 45, pump: 60, mode: 'auto', status: 'running', curve: '1.0' },
  { key: '6', name: 'HK-06 地暖 前台区域', supply: 35.0, return_: 28.5, setpoint: 35, valve: 88, pump: 55, mode: 'auto', status: 'running', curve: '0.6' },
  { key: '7', name: 'HK-07 生活热水', supply: 60.2, return_: 45.3, setpoint: 60, valve: 92, pump: 90, mode: 'auto', status: 'running', curve: '-' },
  { key: '8', name: 'HK-08 地下层特殊区域', supply: 40.0, return_: 33.0, setpoint: 40, valve: 30, pump: 42, mode: 'manual', status: 'running', curve: '0.8' },
]

export default function HeatingPage() {
  const { t } = useI18n()
  const [trend] = useState(genTemp)
  const [setpointModal, setSetpointModal] = useState(false)
  const [selectedCircuit, setSelectedCircuit] = useState<string>('')
  const [tempValue, setTempValue] = useState(55)

  const cols = [
    { title: t.heat.circuit, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.heat.supplyTemp, dataIndex: 'supply', key: 'supply', width: 85, render: (v: number) => <Text style={{ color: '#f5222d' }}>{v.toFixed(1)}°C</Text> },
    { title: t.heat.returnTemp, dataIndex: 'return_', key: 'return_', width: 85, render: (v: number) => `${v.toFixed(1)}°C` },
    { title: t.heat.setpoint, dataIndex: 'setpoint', key: 'setpoint', width: 75, render: (v: number) => `${v}°C` },
    { title: t.heat.heatingCurve, dataIndex: 'curve', key: 'curve', width: 80, render: (v: string) => v === '-' ? '-' : `${v}` },
    { title: t.heat.valvePos, dataIndex: 'valve', key: 'valve', width: 100, render: (v: number) => <Progress percent={v} size="small" style={{ width: 80 }} /> },
    { title: t.heat.pump, dataIndex: 'pump', key: 'pump', width: 80, render: (v: number) => `${v}%` },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', width: 80, render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: () => <Tag color="green">{t.common.running}</Tag> },
    { title: t.common.operation, key: 'op', width: 170, render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" onClick={() => { setSelectedCircuit(r.name); setTempValue(r.setpoint); setSetpointModal(true) }}>{t.heat.adjustSetpoint}</Button>
        <Button size="small" type="link">{t.heat.switchMode}</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.heating}</Title><Text type="secondary">{t.heat.subtitle} · Viessmann Vitocrossal 300 (2×200kW)</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.supplyTemp} value={55.3} suffix="°C" valueStyle={{ color: '#f5222d' }} prefix={<FireOutlined />} /><Text type="secondary">{t.heat.setpoint}: 55°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.returnTemp} value={40.2} suffix="°C" /><Text type="secondary">{t.heat.tempDiff}: 15.1°C</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.boilerStatus} value={t.common.running} valueStyle={{ color: '#52c41a' }} /><Text type="secondary">{t.heat.loadRate}: 68% · {t.heat.boiler1And2}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.heat.circuitsRunning} value="8/8" valueStyle={{ color: '#13c2c2' }} prefix={<DashboardOutlined />} /><Text type="secondary">{t.heat.outdoorTemp}: 3.2°C</Text></Card></Col>
      </Row>

      <Card title={t.heat.trendTitle} extra={<Text type="secondary">{t.heat.weatherComp}</Text>}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} />
            <YAxis yAxisId="t" fontSize={11} domain={[25, 65]} />
            <YAxis yAxisId="o" orientation="right" fontSize={11} domain={[-5, 15]} />
            <Tooltip />
            <Legend />
            <Line yAxisId="t" type="monotone" dataKey="supply" name={`${t.heat.supplyTemp} (°C)`} stroke="#f5222d" strokeWidth={2} dot={false} />
            <Line yAxisId="t" type="monotone" dataKey="return_" name={`${t.heat.returnTemp} (°C)`} stroke="#1677ff" strokeWidth={2} dot={false} />
            <Line yAxisId="o" type="monotone" dataKey="outdoor" name={`${t.heat.outdoorTemp} (°C)`} stroke="#8c8c8c" strokeWidth={1} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.heat.circuitStatus} extra={<Text type="secondary">{t.heat.circuitInfo}</Text>}>
        <Table columns={cols} dataSource={circuits} pagination={false} size="small" scroll={{ x: 1100 }} />
      </Card>

      <Card title={t.heat.boilerEquip} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label={t.heat.boiler1}>Viessmann Vitocrossal 300 · 200kW · <Tag color="green">{t.heat.running}</Tag></Descriptions.Item>
          <Descriptions.Item label={t.heat.boiler2}>Viessmann Vitocrossal 300 · 200kW · <Tag color="green">{t.heat.running}</Tag></Descriptions.Item>
          <Descriptions.Item label={t.heat.fuel}>天然气 H · 12.3 m³/h</Descriptions.Item>
          <Descriptions.Item label={t.heat.exhaustTemp}>128°C / 135°C</Descriptions.Item>
          <Descriptions.Item label={t.heat.operatingHours}>12,450h / 8,230h</Descriptions.Item>
          <Descriptions.Item label={t.heat.nextMaint}>2026-04-15</Descriptions.Item>
          <Descriptions.Item label={t.heat.heatStorage}>2.000L · 58°C</Descriptions.Item>
          <Descriptions.Item label={t.heat.outdoorTemp}>3.2°C · {t.heat.forecastTemp}: 5°C</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={`${t.heat.adjustSetpoint} - ${selectedCircuit}`} open={setpointModal} onOk={() => { setSetpointModal(false); message.success(`${selectedCircuit}: ${tempValue}°C`) }} onCancel={() => setSetpointModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <div style={{ padding: '20px 0' }}>
          <Text>{t.heat.setpoint}: {tempValue}°C</Text>
          <Slider min={25} max={70} value={tempValue} onChange={setTempValue} marks={{ 25: '25°C', 35: '35°C', 45: '45°C', 55: '55°C', 65: '65°C' }} />
        </div>
      </Modal>
    </div>
  )
}
