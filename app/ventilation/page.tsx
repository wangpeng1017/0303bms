'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, Switch, Descriptions, message } from 'antd'
import { CloudOutlined, ExperimentOutlined, AlertOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genAir() {
  return Array.from({ length: 24 }, (_, i) => {
    const workHour = i >= 7 && i <= 19
    const peakHour = i >= 9 && i <= 17
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      supply: Math.round((workHour ? 12000 : 3500) + (peakHour ? 4000 : 0) + (Math.random() - 0.5) * 1500),
      exhaust: Math.round((workHour ? 11200 : 3200) + (peakHour ? 3800 : 0) + (Math.random() - 0.5) * 1400),
      co2: Math.round(400 + (workHour ? 180 : 20) + (peakHour ? 120 : 0) + (Math.random() - 0.5) * 60),
    }
  })
}

const ahus = [
  { key: '1', name: 'RLT-01 EG Empfang/Foyer', supply: 4200, exhaust: 3900, supplyTemp: 21.5, co2: 485, filter: 82, hrEff: 78, mode: 'auto', status: 'running', freq: 38 },
  { key: '2', name: 'RLT-02 OG1 Großraumbüro', supply: 6800, exhaust: 6400, supplyTemp: 21.2, co2: 620, filter: 65, hrEff: 81, mode: 'auto', status: 'running', freq: 42 },
  { key: '3', name: 'RLT-03 OG2 Büro/Konferenz', supply: 5500, exhaust: 5200, supplyTemp: 21.8, co2: 580, filter: 38, hrEff: 76, mode: 'auto', status: 'running', freq: 35 },
  { key: '4', name: 'RLT-04 OG3 Büro/Konferenz', supply: 4800, exhaust: 4500, supplyTemp: 22.0, co2: 540, filter: 71, hrEff: 79, mode: 'auto', status: 'running', freq: 32 },
  { key: '5', name: 'RLT-05 UG Tiefgarage', supply: 2200, exhaust: 2800, supplyTemp: 15.0, co2: 0, filter: 55, hrEff: 0, mode: 'auto', status: 'running', freq: 25 },
  { key: '6', name: 'RLT-06 UG Serverraum', supply: 1800, exhaust: 1800, supplyTemp: 18.5, co2: 390, filter: 92, hrEff: 0, mode: 'manual', status: 'running', freq: 45 },
  { key: '7', name: 'RLT-07 Kantine/Küche', supply: 3200, exhaust: 4500, supplyTemp: 20.5, co2: 0, filter: 45, hrEff: 72, mode: 'auto', status: 'running', freq: 40 },
  { key: '8', name: 'RLT-08 Technikzentrale', supply: 0, exhaust: 0, supplyTemp: 0, co2: 0, filter: 12, hrEff: 0, mode: 'auto', status: 'stopped', freq: 0 },
]

export default function VentilationPage() {
  const { t } = useI18n()
  const [trend] = useState(genAir)
  const [filterModal, setFilterModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState('')

  const totalSupply = ahus.reduce((a, b) => a + b.supply, 0)
  const totalExhaust = ahus.reduce((a, b) => a + b.exhaust, 0)
  const runningAhus = ahus.filter(a => a.status === 'running')
  const avgCo2 = Math.round(runningAhus.filter(a => a.co2 > 0).reduce((a, b) => a + b.co2, 0) / runningAhus.filter(a => a.co2 > 0).length)
  const filterWarnings = ahus.filter(a => a.filter < 40).length

  const cols = [
    { title: t.vent.unit, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: `${t.vent.supplyAir} (m³/h)`, dataIndex: 'supply', key: 'supply', width: 100, render: (v: number) => v > 0 ? v.toLocaleString() : '-' },
    { title: `${t.vent.exhaustAir} (m³/h)`, dataIndex: 'exhaust', key: 'exhaust', width: 100, render: (v: number) => v > 0 ? v.toLocaleString() : '-' },
    { title: 'Zuluft °C', dataIndex: 'supplyTemp', key: 'supplyTemp', width: 80, render: (v: number) => v > 0 ? `${v}°C` : '-' },
    { title: 'CO₂ (ppm)', dataIndex: 'co2', key: 'co2', width: 80, render: (v: number) => v > 0 ? <Text style={{ color: v > 800 ? '#f5222d' : v > 600 ? '#fa8c16' : '#52c41a' }}>{v}</Text> : '-' },
    { title: 'VFD Hz', dataIndex: 'freq', key: 'freq', width: 70, render: (v: number) => v > 0 ? `${v} Hz` : '-' },
    { title: 'WRG %', dataIndex: 'hrEff', key: 'hrEff', width: 70, render: (v: number) => v > 0 ? `${v}%` : '-' },
    { title: t.vent.filter, dataIndex: 'filter', key: 'filter', width: 90, render: (v: number) => <Progress percent={v} size="small" style={{ width: 70 }} status={v < 30 ? 'exception' : v < 50 ? 'active' : 'normal'} /> },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', width: 75, render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'running' ? 'green' : 'default'}>{v === 'running' ? t.common.running : t.common.idle}</Tag> },
    { title: t.common.operation, key: 'op', width: 150, render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" onClick={() => { setSelectedUnit(r.name); setFilterModal(true) }}>{t.vent.changeFilter}</Button>
        <Button size="small" type="link">{r.status === 'running' ? t.actions.stop : t.actions.start}</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.ventilation}</Title><Text type="secondary">{t.vent.subtitle} · 8 RLT-Geräte · Wärmerückgewinnung</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.totalSupply} value={totalSupply.toLocaleString()} suffix="m³/h" prefix={<CloudOutlined />} valueStyle={{ color: '#1677ff' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.totalExhaust} value={totalExhaust.toLocaleString()} suffix="m³/h" /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.avgCo2} value={avgCo2} suffix="ppm" valueStyle={{ color: avgCo2 > 800 ? '#f5222d' : '#52c41a' }} prefix={<ExperimentOutlined />} /><Text type="secondary">Grenzwert: 1.000 ppm</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.filterWarning} value={filterWarnings} valueStyle={{ color: filterWarnings > 0 ? '#fa8c16' : '#52c41a' }} prefix={<AlertOutlined />} /><Text type="secondary">{filterWarnings > 0 ? t.vent.needReplace : 'Alle OK'}</Text></Card></Col>
      </Row>

      <Card title={t.vent.trendTitle} extra={<Text type="secondary">Gesamtluftwechselrate: ~3,2 /h</Text>}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} />
            <YAxis yAxisId="air" fontSize={11} />
            <YAxis yAxisId="co2" orientation="right" fontSize={11} domain={[300, 900]} />
            <Tooltip />
            <Legend />
            <Area yAxisId="air" type="monotone" dataKey="supply" name={`${t.vent.supplyAir} (m³/h)`} stroke="#1677ff" fill="#1677ff" fillOpacity={0.12} />
            <Area yAxisId="air" type="monotone" dataKey="exhaust" name={`${t.vent.exhaustAir} (m³/h)`} stroke="#52c41a" fill="#52c41a" fillOpacity={0.12} />
            <Area yAxisId="co2" type="monotone" dataKey="co2" name="CO₂ (ppm)" stroke="#fa8c16" fill="#fa8c16" fillOpacity={0.08} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.vent.ahuStatus} extra={<Space><Text>{t.vent.co2Link}</Text><Switch defaultChecked /><Text type="secondary">{runningAhus.length}/{ahus.length} aktiv</Text></Space>}>
        <Table columns={cols} dataSource={ahus} pagination={false} size="small" scroll={{ x: 1300 }} />
      </Card>

      <Card title="RLT-Anlagendetails" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label="Hersteller">Kampmann / Wolf GmbH</Descriptions.Item>
          <Descriptions.Item label="Filterklasse">F7 (Zuluft) / G4 (Abluft)</Descriptions.Item>
          <Descriptions.Item label="WRG-Typ">Kreuzstrom-Plattenwärmetauscher</Descriptions.Item>
          <Descriptions.Item label="WRG Effizienz Ø">77.2%</Descriptions.Item>
          <Descriptions.Item label="Gesamtleistung VFD">8× Siemens SINAMICS G120</Descriptions.Item>
          <Descriptions.Item label="Nächste Filterwartung">2026-03-20</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={`${t.vent.changeFilter} - ${selectedUnit}`} open={filterModal} onOk={() => { setFilterModal(false); message.success(`${selectedUnit} Filter-Reset durchgeführt`) }} onCancel={() => setFilterModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>Filterwechsel bestätigen: {selectedUnit}</p>
        <p style={{ color: '#8c8c8c' }}>Differenzdruck-Zähler wird zurückgesetzt. Nächster planmäßiger Wechsel in 6 Monaten.</p>
      </Modal>
    </div>
  )
}
