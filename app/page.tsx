'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState, useMemo } from 'react'
import { Table, Typography, Row, Col, Badge } from 'antd'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
