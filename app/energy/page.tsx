'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, InputNumber, Form, message } from 'antd'
import { ThunderboltOutlined, FireOutlined, ExperimentOutlined, LineChartOutlined, ExportOutlined } from '@ant-design/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTrend() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    elec: Math.round(40 + Math.random() * 30 + (i > 8 && i < 18 ? 25 : 0)),
    heat: Math.round(20 + Math.random() * 15 + (i < 8 || i > 20 ? 10 : 0)),
    water: Math.round(5 + Math.random() * 8),
  }))
}

function genMonthly() {
  return ['Jan','Feb','Mar','Apr','May','Jun'].map(m => ({
    month: m, elec: Math.round(2000+Math.random()*800), heat: Math.round(1000+Math.random()*500), water: Math.round(200+Math.random()*100),
  }))
}

const meters = [
  { key: '1', id: 'EM-001', name: 'Main Electric', type: 'elec', value: '142.5 kW', status: 'online' },
  { key: '2', id: 'HM-001', name: 'Heating Meter', type: 'heat', value: '85.2 kW', status: 'online' },
  { key: '3', id: 'WM-001', name: 'Water Meter', type: 'water', value: '2.3 m³/h', status: 'online' },
  { key: '4', id: 'EM-002', name: 'Sub-Meter Floor 2', type: 'elec', value: '38.1 kW', status: 'online' },
  { key: '5', id: 'EM-003', name: 'Sub-Meter Floor 3', type: 'elec', value: '0 kW', status: 'offline' },
]

export default function EnergyPage() {
  const { t } = useI18n()
  const [trend] = useState(genTrend)
  const [monthly] = useState(genMonthly)
  const [targetModal, setTargetModal] = useState(false)
  const [exportModal, setExportModal] = useState(false)

  const meterCols = [
    { title: t.nrg.meterId, dataIndex: 'id', key: 'id' },
    { title: t.nrg.meterName, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.nrg.meterType, dataIndex: 'type', key: 'type', render: (v: string) => <Tag color={v === 'elec' ? 'blue' : v === 'heat' ? 'red' : 'cyan'}>{v === 'elec' ? t.nrg.elec : v === 'heat' ? t.nrg.heat : t.nrg.water}</Tag> },
    { title: t.nrg.currentVal, dataIndex: 'value', key: 'value' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'green' : 'red'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" type="link">{t.common.details}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.energy}</Title><Text type="secondary">{t.nrg.subtitle}</Text></div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={() => setExportModal(true)}>{t.nrg.exportReport}</Button>
          <Button type="primary" onClick={() => setTargetModal(true)}>{t.nrg.setTarget}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.elecPower} value={142} suffix="kW" valueStyle={{ color: '#1677ff' }} prefix={<ThunderboltOutlined />} /><Text type="secondary">{t.nrg.dailyAccum}: 3,280 kWh</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.heatPower} value={85} suffix="kW" valueStyle={{ color: '#f5222d' }} prefix={<FireOutlined />} /><Text type="secondary">{t.nrg.dailyAccum}: 1,540 kWh</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.waterFlow} value={2.3} suffix="m³/h" prefix={<ExperimentOutlined />} valueStyle={{ color: '#13c2c2' }} /><Text type="secondary">{t.nrg.dailyAccum}: 45 m³</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.savingRate} value={12.5} suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<LineChartOutlined />} /><Text type="secondary">{t.nrg.vsLastMonth}</Text></Card></Col>
      </Row>
      <Card title={t.nrg.trend24h}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Area type="monotone" dataKey="elec" name={t.nrg.elec} stroke="#1677ff" fill="#1677ff" fillOpacity={0.15} />
            <Area type="monotone" dataKey="heat" name={t.nrg.heat} stroke="#f5222d" fill="#f5222d" fillOpacity={0.15} />
            <Area type="monotone" dataKey="water" name={t.nrg.water} stroke="#13c2c2" fill="#13c2c2" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.nrg.monthlyCompare}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Bar dataKey="elec" name={t.nrg.elec} fill="#1677ff" radius={[4,4,0,0]} />
            <Bar dataKey="heat" name={t.nrg.heat} fill="#f5222d" radius={[4,4,0,0]} />
            <Bar dataKey="water" name={t.nrg.water} fill="#13c2c2" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.nrg.meterStatus}><Table columns={meterCols} dataSource={meters} pagination={false} size="small" /></Card>
      <Modal title={t.nrg.setTarget} open={targetModal} onOk={() => { setTargetModal(false); message.success('OK') }} onCancel={() => setTargetModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.nrg.elec} (kWh/day)`}><InputNumber style={{ width: '100%' }} defaultValue={3500} /></Form.Item>
          <Form.Item label={`${t.nrg.heat} (kWh/day)`}><InputNumber style={{ width: '100%' }} defaultValue={1800} /></Form.Item>
          <Form.Item label={`${t.nrg.water} (m³/day)`}><InputNumber style={{ width: '100%' }} defaultValue={50} /></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.nrg.exportReport} open={exportModal} onOk={() => { setExportModal(false); message.success('Export OK') }} onCancel={() => setExportModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>PDF / Excel / CSV?</p>
      </Modal>
    </div>
  )
}
