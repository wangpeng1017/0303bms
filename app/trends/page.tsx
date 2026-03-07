'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, DatePicker, Select, Descriptions, message } from 'antd'
import { LineChartOutlined, DatabaseOutlined, DownloadOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

function genTrend7d() {
  return Array.from({ length: 168 }, (_, i) => {
    const day = Math.floor(i / 24)
    const hour = i % 24
    const workHour = hour >= 7 && hour <= 19 && day < 5
    return {
      time: `T${day+1} ${String(hour).padStart(2,'0')}:00`,
      temp: +(22 + Math.sin(i / 12) * 1.5 + (workHour ? 0.8 : -0.5) + (Math.random() - 0.5) * 0.4).toFixed(1),
      humidity: +(48 + Math.sin(i / 8) * 8 + (workHour ? 5 : -3) + (Math.random() - 0.5) * 3).toFixed(0),
      co2: Math.round(420 + (workHour ? 250 : 30) + Math.sin(i / 6) * 80 + (Math.random() - 0.5) * 40),
    }
  }).filter((_, i) => i % 4 === 0)
}

const archives = [
  { key: '1', name: '2026-03 月度报告', period: '2026-03-01 ~ 06', size: '2.8 MB', records: '215,400', points: 1376, status: 'partial' },
  { key: '2', name: '2026-02 月度报告', period: '2026-02-01 ~ 28', size: '14.2 MB', records: '1,156,432', points: 1376, status: 'archived' },
  { key: '3', name: '2026-01 月度报告', period: '2026-01-01 ~ 31', size: '15.8 MB', records: '1,389,012', points: 1376, status: 'archived' },
  { key: '4', name: '2025-12 月度报告', period: '2025-12-01 ~ 31', size: '15.1 MB', records: '1,324,800', points: 1376, status: 'archived' },
  { key: '5', name: '2025-11 月度报告', period: '2025-11-01 ~ 30', size: '13.9 MB', records: '1,248,000', points: 1376, status: 'archived' },
  { key: '6', name: '2025-10 月度报告', period: '2025-10-01 ~ 31', size: '14.5 MB', records: '1,310,400', points: 1376, status: 'archived' },
  { key: '7', name: '2025 Q3 季度报告', period: '2025-07 ~ 09', size: '42.1 MB', records: '3,801,600', points: 1376, status: 'archived' },
]

export default function TrendsPage() {
  const { t } = useI18n()
  const [data] = useState(genTrend7d)

  const totalArchiveSize = '118.4 MB'
  const totalRecords = '10,445,644'

  const archCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.period, dataIndex: 'period', key: 'period' },
    { title: t.trend.trendPoints, dataIndex: 'points', key: 'points', width: 100, render: (v: number) => v.toLocaleString() },
    { title: t.common.records, dataIndex: 'records', key: 'records', width: 110 },
    { title: t.common.size, dataIndex: 'size', key: 'size', width: 80 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 90, render: (v: string) => <Tag color={v === 'archived' ? 'green' : 'blue'}>{v === 'archived' ? t.trend.archived : t.trend.currentPeriod}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" icon={<DownloadOutlined />} type="link">CSV</Button><Button size="small" type="link">PDF</Button></Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.trends}</Title><Text type="secondary">{t.trend.subtitle} · PostgreSQL TimescaleDB</Text></div>
        <Space>
          <RangePicker />
          <Select defaultValue="temp" options={[
            {value:'temp',label:t.trend.temperature},
            {value:'humidity',label:t.trend.humidity},
            {value:'co2',label:'CO₂'},
            {value:'energy',label:t.trend.energy},
            {value:'supply_temp',label:t.trend.supplyTempLabel},
            {value:'valve_pos',label:t.trend.valveLabel},
          ]} style={{width:140}} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.success(t.trend.csvExported)}>{t.trend.exportCsv}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.trendPoints} value={1376} prefix={<LineChartOutlined />} /><Text type="secondary">{t.trend.devicesProtocols}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.sampleInterval} value="15 min" /><Text type="secondary">{t.trend.covPolling}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.archiveData} value={totalArchiveSize} prefix={<DatabaseOutlined />} /><Text type="secondary">{totalRecords} {t.trend.recordsCount}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.trend.exportFormat} value="CSV / PDF / Excel" /><Text type="secondary">{t.trend.downloadable}</Text></Card></Col>
      </Row>

      <Card title={t.trend.trendCurve7d} extra={<Text type="secondary">OG1 北侧开放办公区 · 第10周</Text>}>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" fontSize={10} interval={5} />
            <YAxis yAxisId="t" fontSize={11} domain={[18, 28]} />
            <YAxis yAxisId="h" orientation="right" fontSize={11} domain={[0, 1200]} />
            <Tooltip />
            <Legend />
            <Line yAxisId="t" type="monotone" dataKey="temp" name={`${t.trend.temperature} (°C)`} stroke="#f5222d" strokeWidth={1.5} dot={false} />
            <Line yAxisId="t" type="monotone" dataKey="humidity" name={`${t.trend.humidity} (%)`} stroke="#1677ff" strokeWidth={1.5} dot={false} />
            <Line yAxisId="h" type="monotone" dataKey="co2" name="CO₂ (ppm)" stroke="#52c41a" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title={t.trend.archiveManage} extra={<Text type="secondary">{t.trend.retention}</Text>}>
        <Table columns={archCols} dataSource={archives} pagination={false} size="small" />
      </Card>

      <Card title={t.trend.archiveSettings} size="small">
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }}>
          <Descriptions.Item label={t.trend.dbLabel}>PostgreSQL 16.2 + TimescaleDB</Descriptions.Item>
          <Descriptions.Item label={t.trend.retentionPolicy}>5年 (原始数据: 1年, 聚合数据: 5年)</Descriptions.Item>
          <Descriptions.Item label={t.trend.compression}>TimescaleDB 原生压缩 · 节省约60%</Descriptions.Item>
          <Descriptions.Item label={t.trend.samplingRate}>标准 15分钟 / 关键值 COV</Descriptions.Item>
          <Descriptions.Item label={t.trend.dailyRotation}>02:30 (备份后)</Descriptions.Item>
          <Descriptions.Item label={t.trend.storageForecast}>~180 MB/月 · 500 GB 可用约18年</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
