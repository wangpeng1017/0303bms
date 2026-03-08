'use client'

import { useState } from 'react'
import { Table, Typography, Row, Col, Badge } from 'antd'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CircularGauge } from '@/components/circular-gauge'
import { HvacFloorplan } from '@/components/hvac-floorplan'

const { Title, Text } = Typography

function genCo2TempData() {
  return Array.from({ length: 24 }, (_, i) => {
    return {
      time: `${String(i).padStart(2, '00')}:00`,
      co2: Math.round(350 + Math.sin(i / 3) * 100 + Math.random() * 20),
      temp: parseFloat((20 + Math.cos(i / 4) * 4 + Math.random()).toFixed(1)),
    }
  })
}

function genFanValveData() {
  return [
    { system: 'AHU-03', fan: 82, valve: 86 },
    { system: 'Boiler-01', fan: 62, valve: 92 },
    { system: 'Main-02', fan: 75, valve: 100 },
    { system: 'Boiler-01', fan: 112, valve: 80 },
    { system: 'Valve-02', fan: 100, valve: 60 },
  ]
}

export default function DashboardPage() {
  const [co2TempData] = useState(genCo2TempData)
  const [fanValveData] = useState(genFanValveData)

  const alarms = [
    { key: '1', severity: 'Critical', asset: 'AHU-03 | Fan', location: 'Level 1 West Wing', time: '2026-03-07 14:15' },
    { key: '2', severity: 'Major', asset: 'Boiler-01 | Main Pump', location: 'Boiler Room', time: '2026-03-07 14:28' },
    { key: '3', severity: 'Minor', asset: 'Boiler-01 | Main Pump', location: 'Boiler Room', time: '2026-03-07 14:28' },
    { key: '4', severity: 'Major', asset: 'AHU-03 | Fan', location: 'Level 1 West Wing', time: '2026-03-07 14:15' },
    { key: '5', severity: 'Minor', asset: 'AHU-03 | Fan', location: 'Level 1 West Wing', time: '2026-03-07 14:28' },
  ]

  const alarmCols = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (v: string) => {
        const color = v === 'Critical' ? '#ef4444' : v === 'Major' ? '#f59e0b' : '#eab308'
        return <div style={{ color, display: 'flex', alignItems: 'center', gap: 6 }}><Badge color={color} /> {v}</div>
      }
    },
    { title: 'Asset', dataIndex: 'asset', key: 'asset', render: (v: string) => <Text style={{ color: '#e2e8f0' }}>{v}</Text> },
    { title: 'Location', dataIndex: 'location', key: 'location', render: (v: string) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
    { title: 'Time', dataIndex: 'time', key: 'time', render: (v: string) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Title level={4} style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>Ventilation & Heating Operations Cockpit</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>
          <Badge status="success" /> <span style={{ color: '#52c41a' }}>System Online</span> | 2026-03-07 14:32
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} xl={16} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Floorplan */}
          <HvacFloorplan />

          {/* 4 Gauges */}
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <CircularGauge title="CO₂ Avg (ppm)" value={450} unit="ppm" color="#0ea5e9" max={1000} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title="Supply Temp (°C)" value={22.5} unit="°C" color="#0ea5e9" max={40} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title="Energy Now (kW)" value={125.8} unit="kW" color="#84cc16" max={200} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title="Active Alarms" value={3} unit="" color="#ef4444" max={10} />
            </Col>
          </Row>

          {/* Alarms Table */}
          <div style={{ background: '#1e293b', borderRadius: 8, border: '1px solid #334155', overflow: 'hidden' }}>
            <Table
              columns={alarmCols}
              dataSource={alarms}
              pagination={false}
              size="small"
              rowClassName={() => 'dark-table-row'}
            />
          </div>
        </Col>

        {/* Right Column */}
        <Col xs={24} xl={8} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* CO2 & Temp Chart */}
          <div style={{ background: '#1e293b', borderRadius: 8, padding: 20, border: '1px solid #334155', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16 }}>CO₂ & Temp (24h)</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#0ea5e9' }} /> CO₂-1</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#84cc16' }} /> Temp-2</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={co2TempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} label={{ value: 'CO₂ ppm', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} label={{ value: 'Temp °C', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
                <Area yAxisId="left" type="monotone" dataKey="co2" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="temp" stroke="#84cc16" fill="#84cc16" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fan Speed & Valve Chart */}
          <div style={{ background: '#1e293b', borderRadius: 8, padding: 20, border: '1px solid #334155', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Fan Speed & Valve Position</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fanValveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} />
                <XAxis dataKey="system" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Percent %', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }} />
                <Bar dataKey="fan" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                <Bar dataKey="valve" fill="#84cc16" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Global Style for tables in dark mode */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .ant-table-wrapper .ant-table {
          background: #1e293b;
          color: #f8fafc;
        }
        .ant-table-wrapper .ant-table-thead > tr > th {
          background: #0f172a !important;
          color: #94a3b8 !important;
          border-bottom: 1px solid #334155 !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr > td {
          border-bottom: 1px solid #334155 !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr:hover > td {
          background: #334155 !important;
        }
      `}} />
    </div>
  )
}
