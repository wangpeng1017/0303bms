'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Progress, Row, Col, Typography, Button, Space, Modal, Switch, message } from 'antd'
import { CloudOutlined, ExperimentOutlined, AlertOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genAir() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    supply: Math.round(8000 + Math.random() * 2000 + (i > 8 && i < 18 ? 3000 : 0)),
    exhaust: Math.round(7500 + Math.random() * 2000 + (i > 8 && i < 18 ? 2800 : 0)),
  }))
}

const ahus = [
  { key: '1', name: 'AHU-01', supply: 4500, exhaust: 4200, co2: 520, filter: 85, mode: 'auto', status: 'running' },
  { key: '2', name: 'AHU-02', supply: 3800, exhaust: 3500, co2: 610, filter: 42, mode: 'auto', status: 'running' },
  { key: '3', name: 'AHU-03', supply: 2200, exhaust: 2000, co2: 480, filter: 68, mode: 'manual', status: 'running' },
  { key: '4', name: 'AHU-04', supply: 0, exhaust: 0, co2: 0, filter: 15, mode: 'auto', status: 'stopped' },
]

export default function VentilationPage() {
  const { t } = useI18n()
  const [trend] = useState(genAir)
  const [filterModal, setFilterModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState('')

  const cols = [
    { title: t.vent.unit, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: `${t.vent.supplyAir} (m³/h)`, dataIndex: 'supply', key: 'supply', render: (v: number) => v.toLocaleString() },
    { title: `${t.vent.exhaustAir} (m³/h)`, dataIndex: 'exhaust', key: 'exhaust', render: (v: number) => v.toLocaleString() },
    { title: 'CO₂ (ppm)', dataIndex: 'co2', key: 'co2', render: (v: number) => <Text style={{ color: v > 600 ? '#fa8c16' : '#52c41a' }}>{v}</Text> },
    { title: t.vent.filter, dataIndex: 'filter', key: 'filter', render: (v: number) => <Progress percent={v} size="small" style={{ width: 80 }} status={v < 30 ? 'exception' : v < 50 ? 'active' : 'normal'} /> },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', render: (v: string) => <Tag color={v === 'auto' ? 'blue' : 'orange'}>{v === 'auto' ? t.common.auto : t.common.manual}</Tag> },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'running' ? 'green' : 'default'}>{v === 'running' ? t.common.running : t.common.idle}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link" onClick={() => { setSelectedUnit(r.name); setFilterModal(true) }}>{t.vent.changeFilter}</Button>
        <Button size="small" type="link">{r.status === 'running' ? t.actions.stop : t.actions.start}</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.ventilation}</Title><Text type="secondary">{t.vent.subtitle}</Text></div>
        <Text type="secondary"><ClockCircleOutlined /> {new Date().toLocaleString()}</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.totalSupply} value={10500} suffix="m³/h" prefix={<CloudOutlined />} valueStyle={{ color: '#1677ff' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.totalExhaust} value={9700} suffix="m³/h" /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.avgCo2} value={537} suffix="ppm" valueStyle={{ color: '#52c41a' }} prefix={<ExperimentOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.vent.filterWarning} value={1} valueStyle={{ color: '#fa8c16' }} prefix={<AlertOutlined />} /><Text type="secondary">{t.vent.needReplace}</Text></Card></Col>
      </Row>
      <Card title={t.vent.trendTitle}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Area type="monotone" dataKey="supply" name={t.vent.supplyAir} stroke="#1677ff" fill="#1677ff" fillOpacity={0.15} />
            <Area type="monotone" dataKey="exhaust" name={t.vent.exhaustAir} stroke="#52c41a" fill="#52c41a" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.vent.ahuStatus} extra={<Space><Text>{t.vent.co2Link}</Text><Switch defaultChecked /></Space>}>
        <Table columns={cols} dataSource={ahus} pagination={false} size="small" />
      </Card>
      <Modal title={`${t.vent.changeFilter} - ${selectedUnit}`} open={filterModal} onOk={() => { setFilterModal(false); message.success(`${selectedUnit} filter reset`) }} onCancel={() => setFilterModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>{t.vent.changeFilter}: {selectedUnit}</p>
      </Modal>
    </div>
  )
}
