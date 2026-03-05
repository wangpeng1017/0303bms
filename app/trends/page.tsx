'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, DatePicker, Select, message } from 'antd'
import { LineChartOutlined, DatabaseOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

function genTrend7d() {
  return Array.from({ length: 168 }, (_, i) => {
    const day = Math.floor(i / 24)
    const hour = i % 24
    return {
      time: `D${day+1} ${String(hour).padStart(2,'0')}:00`,
      temp: 22 + Math.sin(i / 12) * 2 + (Math.random() - 0.5),
      humidity: 50 + Math.sin(i / 8) * 10 + (Math.random() - 0.5) * 5,
      co2: 500 + Math.sin(i / 6) * 200 + (Math.random() - 0.5) * 50 + (hour > 8 && hour < 18 ? 150 : 0),
    }
  }).filter((_, i) => i % 4 === 0)
}

const archives = [
  { key: '1', name: '2026-03 Monthly Report', date: '2026-03-01', size: '12.5 MB', records: '1,234,567', status: 'archived' },
  { key: '2', name: '2026-02 Monthly Report', date: '2026-02-01', size: '11.8 MB', records: '1,156,432', status: 'archived' },
  { key: '3', name: '2026-01 Monthly Report', date: '2026-01-01', size: '13.2 MB', records: '1,389,012', status: 'archived' },
]

export default function TrendsPage() {
  const { t } = useI18n()
  const [data] = useState(genTrend7d)

  const archCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.date, dataIndex: 'date', key: 'date' },
    { title: t.common.size, dataIndex: 'size', key: 'size' },
    { title: t.common.records, dataIndex: 'records', key: 'records' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: () => <Tag color="green">{t.trend.archived}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" icon={<DownloadOutlined />} type="link">{t.common.download}</Button> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.trends}</Title><Text type="secondary">{t.trend.subtitle}</Text></div>
        <Space>
          <RangePicker />
          <Select defaultValue="temp" options={[{value:'temp',label:t.trend.temperature},{value:'humidity',label:t.trend.humidity},{value:'co2',label:t.trend.co2Label},{value:'energy',label:t.trend.energy}]} style={{width:120}} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.success('CSV exported')}>{t.trend.exportCsv}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.trendPoints} value={1376} prefix={<LineChartOutlined />} /><Text type="secondary">{t.trend.activePts}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.sampleInterval} value="15 min" /><Text type="secondary">{t.trend.defaultCycle}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.archiveData} value="37.5 MB" prefix={<DatabaseOutlined />} /><Text type="secondary">{t.trend.past5m}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.exportFormat} value="CSV / PDF" /><Text type="secondary">{t.trend.downloadable}</Text></Card></Col>
      </Row>
      <Card title={t.trend.trendCurve7d}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" fontSize={10} interval={5} /><YAxis yAxisId="t" fontSize={11} domain={[18, 28]} /><YAxis yAxisId="h" orientation="right" fontSize={11} domain={[0, 1200]} />
            <Tooltip /><Legend />
            <Line yAxisId="t" type="monotone" dataKey="temp" name={`${t.trend.temperature} (°C)`} stroke="#f5222d" strokeWidth={1.5} dot={false} />
            <Line yAxisId="t" type="monotone" dataKey="humidity" name={`${t.trend.humidity} (%)`} stroke="#1677ff" strokeWidth={1.5} dot={false} />
            <Line yAxisId="h" type="monotone" dataKey="co2" name="CO₂ (ppm)" stroke="#52c41a" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title={t.trend.archiveManage}><Table columns={archCols} dataSource={archives} pagination={false} size="small" /></Card>
    </div>
  )
}
