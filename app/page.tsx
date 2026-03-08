'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState, useMemo } from 'react'
import { Table, Typography, Row, Col, Badge } from 'antd'
import { AreaChart, Area, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CircularGauge } from '@/components/circular-gauge'
import { HvacFloorplan } from '@/components/hvac-floorplan'

const { Title, Text } = Typography

function genEnergy() {
  return Array.from({ length: 24 }, (_, i) => {
    const workHour = i >= 7 && i <= 19
    const peakHour = i >= 9 && i <= 17
    return {
      hour: `${String(i).padStart(2, '00')}:00`,
      elec: Math.round(38 + (workHour ? 45 : 0) + (peakHour ? 22 : 0) + (Math.random() - 0.5) * 12),
      heat: Math.round(25 + (i < 7 || i > 20 ? 18 : 8) + (Math.random() - 0.5) * 6),
      water: Math.round(1.2 + (workHour ? 3.5 : 0.3) + (Math.random() - 0.5) * 0.8),
    }
  })
}

export default function DashboardPage() {
  const { t } = useI18n()
  const [energy] = useState(genEnergy)

  const systemModules = useMemo(() => [
    { name: t.dash.ddcStation, count: 12, online: 12 },
    { name: t.dash.rltUnit, count: 6, online: 6 },
    { name: t.dash.heatingCircuit, count: 8, online: 8 },
    { name: t.dash.chillerUnit, count: 3, online: 2 },
    { name: t.dash.daliGateway, count: 4, online: 3 },
    { name: t.dash.energyMeter, count: 14, online: 14 },
  ], [t])

  const totalOnline = useMemo(() => systemModules.reduce((a, b) => a + b.online, 0), [systemModules])
  const totalDevices = useMemo(() => systemModules.reduce((a, b) => a + b.count, 0), [systemModules])

  const energyDistribution = useMemo(() => [
    { name: t.dash.hvac, value: 48, color: '#0ea5e9' },
    { name: t.dash.lightingLabel, value: 22, color: '#f59e0b' },
    { name: t.dash.itServer, value: 18, color: '#84cc16' },
    { name: t.dash.others, value: 12, color: '#475569' },
  ], [t])

  // Remove pure hooks Math.random warning by pre-generating them inside a useState or without useMemo dependency on random evaluation
  const [weekly] = useState(() => [
    { day: t.dash.mon, thisWeek: Math.round(920 + Math.random() * 180), lastWeek: Math.round(960 + Math.random() * 200) },
    { day: t.dash.tue, thisWeek: Math.round(920 + Math.random() * 180), lastWeek: Math.round(960 + Math.random() * 200) },
    { day: t.dash.wed, thisWeek: Math.round(920 + Math.random() * 180), lastWeek: Math.round(960 + Math.random() * 200) },
    { day: t.dash.thu, thisWeek: Math.round(920 + Math.random() * 180), lastWeek: Math.round(960 + Math.random() * 200) },
    { day: t.dash.fri, thisWeek: Math.round(920 + Math.random() * 180), lastWeek: Math.round(960 + Math.random() * 200) },
    { day: t.dash.sat, thisWeek: Math.round(280 + Math.random() * 120), lastWeek: Math.round(310 + Math.random() * 100) },
    { day: t.dash.sun, thisWeek: Math.round(280 + Math.random() * 120), lastWeek: Math.round(310 + Math.random() * 100) },
  ])

  const rooms = useMemo(() => [
    { key: '1', name: t.dash.roomEgLobby, temp: 22.3, humidity: 44, co2: 485, persons: 3, setpoint: 22 },
    { key: '2', name: t.dash.roomOg1Open, temp: 22.8, humidity: 47, co2: 620, persons: 28, setpoint: 22 },
    { key: '3', name: t.dash.roomOg1Mtg, temp: 23.4, humidity: 51, co2: 780, persons: 12, setpoint: 23 },
    { key: '4', name: t.dash.roomOg2Office, temp: 22.1, humidity: 43, co2: 520, persons: 4, setpoint: 22 },
    { key: '5', name: t.dash.roomOg2Mtg, temp: 24.2, humidity: 56, co2: 940, persons: 18, setpoint: 23 },
    { key: '6', name: t.dash.roomOg3Office, temp: 21.9, humidity: 42, co2: 410, persons: 2, setpoint: 22 },
    { key: '7', name: t.dash.roomOg3Mtg, temp: 25.1, humidity: 58, co2: 1050, persons: 22, setpoint: 23 },
    { key: '8', name: t.dash.roomUgServer, temp: 21.0, humidity: 38, co2: 390, persons: 0, setpoint: 21 },
  ], [t])

  const alarms = useMemo(() => [
    { key: '1', time: '14:23:05', module: 'RLT-OG2', content: t.dash.almDash1, level: 'A', device: 'AHU-03' },
    { key: '2', time: '13:45:12', module: t.dash.modCooling, content: t.dash.almDash2, level: 'B', device: 'KM-02' },
    { key: '3', time: '12:10:30', module: t.dash.modOg3Room, content: t.dash.almDash3, level: 'C', device: 'DDC-OG3-02' },
    { key: '4', time: '11:30:00', module: t.dash.modHeating, content: t.dash.almDash4, level: 'B', device: 'Kessel-01' },
    { key: '5', time: '10:52:18', module: 'DALI', content: t.dash.almDash5, level: 'C', device: 'DALI-GW-02' },
    { key: '6', time: '09:15:44', module: t.dash.modCooling, content: t.dash.almDash6, level: 'B', device: 'KT-01' },
  ], [t])

  const alarmCols = [
    {
      title: t.common.level,
      dataIndex: 'level',
      key: 'level',
      render: (v: string) => {
        const color = v === 'A' ? '#ef4444' : v === 'B' ? '#f59e0b' : '#3b82f6'
        const label = v === 'A' ? 'Critical' : v === 'B' ? 'Major' : 'Minor'
        return <div style={{ color, display: 'flex', alignItems: 'center', gap: 6 }}><Badge color={color} /> {label}</div>
      }
    },
    { title: t.common.device, dataIndex: 'device', key: 'device', render: (v: string) => <Text style={{ color: '#e2e8f0' }}>{v}</Text> },
    { title: t.common.module, dataIndex: 'module', key: 'module', render: (v: string) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
    { title: t.common.content, dataIndex: 'content', key: 'content', render: (v: string) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
    { title: t.common.time, dataIndex: 'time', key: 'time', render: (v: string) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
  ]

  const roomCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong style={{ color: '#f8fafc' }}>{v}</Text> },
    { title: t.dash.temp, dataIndex: 'temp', key: 'temp', width: 80, render: (v: number, r: { setpoint: number }) => <Text style={{ color: Math.abs(v - r.setpoint) > 1.5 ? '#ef4444' : '#52c41a' }}>{v}°C</Text> },
    { title: t.dash.humidity, dataIndex: 'humidity', key: 'humidity', width: 70, render: (v: number) => <Text style={{ color: '#e2e8f0' }}>{v}%</Text> },
    { title: 'CO₂', dataIndex: 'co2', key: 'co2', width: 90, render: (v: number) => <Text style={{ color: v > 1000 ? '#ef4444' : v > 800 ? '#f59e0b' : '#52c41a' }}>{v} ppm</Text> },
    { title: t.dash.person, dataIndex: 'persons', key: 'persons', width: 50, render: (v: number) => <Text style={{ color: '#94a3b8' }}>{v}</Text> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Title level={4} style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{t.dash.buildingName} — MSR Operations Cockpit</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14 }}>
          <Badge status="success" /> <span style={{ color: '#52c41a' }}>{t.systemStatus}</span> | {new Date().toLocaleString()}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} xl={16} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Floorplan */}
          <HvacFloorplan />

          {/* 4 Gauges (Restored back to global data) */}
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <CircularGauge title={t.systemStatus} value={`${totalOnline} / ${totalDevices}`} unit="" color="#52c41a" max={totalDevices} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title={t.dash.currentPower} value={148.5} unit="kW" color="#0ea5e9" max={200} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title={t.dash.energyKwh} value={2847} unit="kWh" color="#84cc16" max={5000} />
            </Col>
            <Col xs={12} md={6}>
              <CircularGauge title={t.totalAlarms} value={alarms.length} unit="" color="#ef4444" max={10} />
            </Col>
          </Row>

          {/* Alarms Table */}
          <div style={{ background: '#172236', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
          {/* Energy Trend Chart */}
          <div style={{ background: '#172236', borderRadius: 8, padding: 20, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16 }}>{t.dash.energyTrend24h}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#0ea5e9' }} /> {t.dash.elecKw}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 2, background: '#ef4444' }} /> {t.dash.heatKw}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3854" vertical={true} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={11} width={30} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="elec" name={t.dash.elecKw} stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="heat" name={t.dash.heatKw} stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Energy Distribution Chart */}
          <div style={{ background: '#172236', borderRadius: 8, padding: 20, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 300 }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>{t.dash.energyDist}</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={energyDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {energyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', color: '#f8fafc', borderRadius: 8 }} itemStyle={{ color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Comparison Bar Chart */}
          <div style={{ background: '#172236', borderRadius: 8, padding: 20, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 300 }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>{t.dash.weeklyComparison}</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3854" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={11} width={40} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', color: '#f8fafc', borderRadius: 8 }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar dataKey="thisWeek" name={t.common.current} fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="lastWeek" name={t.dash.lastWeek} fill="#475569" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* System Overview Tiny Stats */}
          <div style={{ background: '#172236', borderRadius: 8, padding: 20 }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>{t.dash.systemOverview}</div>
            <Row gutter={[16, 16]}>
              {systemModules.map((mod, i) => (
                <Col xs={12} sm={8} key={i}>
                  <div style={{ background: '#0f172a', padding: 12, borderRadius: 6 }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{mod.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ color: mod.online === mod.count ? '#52c41a' : '#f59e0b', fontSize: 18, fontWeight: 600 }}>{mod.online}</span>
                      <span style={{ color: '#64748b', fontSize: 12 }}>/ {mod.count}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

        </Col>
      </Row>

      {/* Room Monitor Section */}
      <div style={{ background: '#172236', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 8 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a3854', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#f8fafc', fontWeight: 600 }}>{t.dash.roomMonitor}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
            <span style={{ color: '#52c41a', display: 'flex', alignItems: 'center', gap: 6 }}><Badge color="#52c41a" /> {rooms.filter(r => r.persons > 0).length} {t.room.occupied}</span>
            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}><Badge color="#94a3b8" /> {rooms.filter(r => r.persons === 0).length} {t.room.vacant}</span>
          </div>
        </div>
        <Table
          columns={roomCols}
          dataSource={rooms}
          pagination={false}
          size="middle"
          rowClassName={() => 'dark-table-row'}
        />
      </div>

      {/* Global Style for tables in dark mode */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .ant-table-wrapper .ant-table {
          background: transparent !important;
          color: #f8fafc;
        }
        .ant-table-wrapper .ant-table-thead > tr > th {
          background: #172236 !important;
          color: #94a3b8 !important;
          border-bottom: 1px solid #2a3854 !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr > td {
          border-bottom: 1px solid #2a3854 !important;
          color: #e2e8f0 !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr:hover > td {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .ant-table-wrapper .ant-table-tbody > tr.dark-table-row > td {
          padding: 12px 16px !important;
        }
      `}} />
    </div>
  )
}
