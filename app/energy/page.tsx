'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, InputNumber, Form, Descriptions, message } from 'antd'
import { ThunderboltOutlined, FireOutlined, ExperimentOutlined, LineChartOutlined, ExportOutlined } from '@ant-design/icons'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography

function genTrend() {
  return Array.from({ length: 24 }, (_, i) => {
    const workHour = i >= 7 && i <= 19
    const peakHour = i >= 9 && i <= 17
    return {
      hour: `${String(i).padStart(2, '0')}:00`,
      elec: Math.round(38 + (workHour ? 48 : 0) + (peakHour ? 25 : 0) + (Math.random() - 0.5) * 10),
      heat: Math.round(22 + (i < 7 || i > 20 ? 20 : 10) + (Math.random() - 0.5) * 5),
      water: +(0.8 + (workHour ? 2.5 : 0.2) + (Math.random() - 0.5) * 0.6).toFixed(1),
    }
  })
}

function genMonthly() {
  const months = ['10月', '11月', '12月', '1月', '2月', '3月']
  const heatingFactor = [0.6, 0.85, 1.0, 1.0, 0.9, 0.7]
  return months.map((m, i) => ({
    month: m,
    elec: Math.round(2200 + Math.random() * 300 + (i > 2 ? -200 : 0)),
    heat: Math.round((1800 + Math.random() * 200) * heatingFactor[i]),
    water: Math.round(180 + Math.random() * 40),
  }))
}

const meters = [
  { key: '1', id: 'EZ-001', name: '电力总表', type: 'elec', value: '148.5 kW', daily: '2,847 kWh', floor: '全楼', manufacturer: 'Siemens PAC3200', status: 'online' },
  { key: '2', id: 'EZ-002', name: 'EG层分表', type: 'elec', value: '28.3 kW', daily: '542 kWh', floor: 'EG', manufacturer: 'Siemens 7KT1260', status: 'online' },
  { key: '3', id: 'EZ-003', name: 'OG1层分表', type: 'elec', value: '42.1 kW', daily: '806 kWh', floor: 'OG1', manufacturer: 'Siemens 7KT1260', status: 'online' },
  { key: '4', id: 'EZ-004', name: 'OG2层分表', type: 'elec', value: '35.8 kW', daily: '688 kWh', floor: 'OG2', manufacturer: 'Siemens 7KT1260', status: 'online' },
  { key: '5', id: 'EZ-005', name: 'OG3层分表', type: 'elec', value: '22.5 kW', daily: '432 kWh', floor: 'OG3', manufacturer: 'Siemens 7KT1260', status: 'online' },
  { key: '6', id: 'EZ-006', name: 'UG层/设备分表', type: 'elec', value: '19.8 kW', daily: '379 kWh', floor: 'UG', manufacturer: 'Siemens 7KT1260', status: 'online' },
  { key: '7', id: 'WMZ-001', name: '热力总表', type: 'heat', value: '85.2 kW', daily: '1,540 kWh', floor: '全楼', manufacturer: 'Kamstrup MULTICAL 803', status: 'online' },
  { key: '8', id: 'WMZ-002', name: '北翼供暖热表', type: 'heat', value: '32.5 kW', daily: '580 kWh', floor: '北翼', manufacturer: 'Kamstrup MULTICAL 603', status: 'online' },
  { key: '9', id: 'WMZ-003', name: '南翼供暖热表', type: 'heat', value: '28.1 kW', daily: '510 kWh', floor: '南翼', manufacturer: 'Kamstrup MULTICAL 603', status: 'online' },
  { key: '10', id: 'WMZ-004', name: '生活热水热表', type: 'heat', value: '12.8 kW', daily: '245 kWh', floor: 'UG', manufacturer: 'Kamstrup MULTICAL 603', status: 'online' },
  { key: '11', id: 'WZ-001', name: '水表总表', type: 'water', value: '2.3 m³/h', daily: '38.5 m³', floor: '全楼', manufacturer: 'Sensus iPERL', status: 'online' },
  { key: '12', id: 'WZ-002', name: '食堂/厨房', type: 'water', value: '0.8 m³/h', daily: '12.2 m³', floor: 'EG', manufacturer: 'Sensus iPERL', status: 'online' },
  { key: '13', id: 'KZ-001', name: '冷量计', type: 'heat', value: '42.0 kW', daily: '620 kWh', floor: '全楼', manufacturer: 'Kamstrup MULTICAL 803', status: 'online' },
  { key: '14', id: 'GZ-001', name: '燃气表', type: 'heat', value: '12.3 m³/h', daily: '185 m³', floor: 'UG', manufacturer: 'Elster BK-G25', status: 'online' },
]

export default function EnergyPage() {
  const { t } = useI18n()
  const [trend] = useState(genTrend)
  const [monthly] = useState(genMonthly)
  const [targetModal, setTargetModal] = useState(false)
  const [exportModal, setExportModal] = useState(false)

  const meterCols = [
    { title: t.nrg.meterId, dataIndex: 'id', key: 'id', width: 90 },
    { title: t.nrg.meterName, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: '制造商', dataIndex: 'manufacturer', key: 'manufacturer', width: 150, render: (v: string) => <Text type="secondary" style={{ fontSize: 11 }}>{v}</Text> },
    { title: t.nrg.meterType, dataIndex: 'type', key: 'type', width: 70, render: (v: string) => <Tag color={v === 'elec' ? 'blue' : v === 'heat' ? 'red' : 'cyan'}>{v === 'elec' ? t.nrg.elec : v === 'heat' ? t.nrg.heat : t.nrg.water}</Tag> },
    { title: '区域', dataIndex: 'floor', key: 'floor', width: 80 },
    { title: t.nrg.currentVal, dataIndex: 'value', key: 'value', width: 100 },
    { title: t.nrg.dailyAccum, dataIndex: 'daily', key: 'daily', width: 100 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 70, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'red'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.energy}</Title><Text type="secondary">{t.nrg.subtitle} · {meters.length} 块表计 · M-Bus / BACnet</Text></div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={() => setExportModal(true)}>{t.nrg.exportReport}</Button>
          <Button type="primary" onClick={() => setTargetModal(true)}>{t.nrg.setTarget}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.elecPower} value={148.5} suffix="kW" valueStyle={{ color: '#1677ff' }} prefix={<ThunderboltOutlined />} /><Text type="secondary">{t.nrg.dailyAccum}: 2,847 kWh</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.heatPower} value={85.2} suffix="kW" valueStyle={{ color: '#f5222d' }} prefix={<FireOutlined />} /><Text type="secondary">{t.nrg.dailyAccum}: 1,540 kWh</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.waterFlow} value={2.3} suffix="m³/h" prefix={<ExperimentOutlined />} valueStyle={{ color: '#13c2c2' }} /><Text type="secondary">{t.nrg.dailyAccum}: 38.5 m³</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.nrg.savingRate} value={8.7} suffix="%" valueStyle={{ color: '#52c41a' }} prefix={<LineChartOutlined />} /><Text type="secondary">{t.nrg.vsLastMonth} · KPI: 142 kWh/m²·a</Text></Card></Col>
      </Row>

      <Card title={t.nrg.trend24h}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Area type="monotone" dataKey="elec" name={`${t.nrg.elec} (kW)`} stroke="#1677ff" fill="#1677ff" fillOpacity={0.12} />
            <Area type="monotone" dataKey="heat" name={`${t.nrg.heat} (kW)`} stroke="#f5222d" fill="#f5222d" fillOpacity={0.12} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.nrg.monthlyCompare} extra={<Text type="secondary">供暖季 2025年10月 - 2026年3月</Text>}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} />
            <Tooltip /><Legend />
            <Bar dataKey="elec" name={`${t.nrg.elec} (kWh)`} fill="#1677ff" radius={[4,4,0,0]} />
            <Bar dataKey="heat" name={`${t.nrg.heat} (kWh)`} fill="#f5222d" radius={[4,4,0,0]} />
            <Bar dataKey="water" name={`${t.nrg.water} (m³)`} fill="#13c2c2" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.nrg.meterStatus} extra={<Text type="secondary">{meters.length} 块表计 · 全部在线</Text>}>
        <Table columns={meterCols} dataSource={meters} pagination={{ pageSize: 8, size: 'small' }} size="small" scroll={{ x: 1000 }} />
      </Card>

      <Card title="能效指标" size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 4 }}>
          <Descriptions.Item label="电力/m²·a">142 kWh</Descriptions.Item>
          <Descriptions.Item label="热力/m²·a">85 kWh</Descriptions.Item>
          <Descriptions.Item label="用水/m²·a">0.45 m³</Descriptions.Item>
          <Descriptions.Item label="CO₂排放">~185 t/a</Descriptions.Item>
          <Descriptions.Item label="能效等级">B (EnEV)</Descriptions.Item>
          <Descriptions.Item label="一次能源">218 kWh/m²·a</Descriptions.Item>
          <Descriptions.Item label="电力峰值负荷">185 kW</Descriptions.Item>
          <Descriptions.Item label="热力峰值负荷">320 kW</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title={t.nrg.setTarget} open={targetModal} onOk={() => { setTargetModal(false); message.success('目标值已保存') }} onCancel={() => setTargetModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.nrg.elec} (kWh/Tag)`}><InputNumber style={{ width: '100%' }} defaultValue={3200} /></Form.Item>
          <Form.Item label={`${t.nrg.heat} (kWh/Tag)`}><InputNumber style={{ width: '100%' }} defaultValue={1800} /></Form.Item>
          <Form.Item label={`${t.nrg.water} (m³/Tag)`}><InputNumber style={{ width: '100%' }} defaultValue={42} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.nrg.exportReport} open={exportModal} onOk={() => { setExportModal(false); message.success('报告已导出') }} onCancel={() => setExportModal(false)} okText={t.actions.confirm} cancelText={t.actions.cancel}>
        <p>导出格式: PDF / Excel / CSV</p>
        <p style={{ color: '#8c8c8c' }}>时段: 当前月份 (2026年3月)</p>
      </Modal>
    </div>
  )
}
