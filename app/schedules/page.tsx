'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, TimePicker, message } from 'antd'
import { CalendarOutlined, PauseCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const programs = [
  { key: '1', name: 'RLT Normalbetrieb', target: 'RLT-01 bis RLT-04', schedule: 'Mo-Fr 06:00-20:00', priority: 10, status: 'active' },
  { key: '2', name: 'RLT Nachtauskühlung', target: 'RLT-01 bis RLT-04', schedule: 'Mo-Fr 22:00-06:00 (>26°C)', priority: 8, status: 'active' },
  { key: '3', name: 'Heizung Absenkung Nacht', target: 'HK-01 bis HK-06', schedule: 'Täglich 22:00-05:00', priority: 10, status: 'active' },
  { key: '4', name: 'Heizung Wochenende', target: 'HK-01 bis HK-06', schedule: 'Sa-So ganztägig (Absenkung)', priority: 5, status: 'active' },
  { key: '5', name: 'Beleuchtung Büro', target: 'DALI-G3 bis G8', schedule: 'Mo-Fr 07:00-19:30', priority: 10, status: 'active' },
  { key: '6', name: 'Beleuchtung Reinigung', target: 'Alle DALI Gruppen', schedule: 'Mo-Fr 19:30-21:00', priority: 6, status: 'active' },
  { key: '7', name: 'Außenbeleuchtung', target: 'DALI-G11', schedule: 'Täglich Dämmerung-22:00', priority: 8, status: 'active' },
  { key: '8', name: 'Sonnenschutz Automatik', target: 'Alle Jalousien', schedule: 'Täglich 06:00-21:00', priority: 10, status: 'active' },
  { key: '9', name: 'Tiefgarage Lüftung', target: 'RLT-05', schedule: 'Mo-Fr 07:00-09:00, 17:00-19:00', priority: 8, status: 'active' },
  { key: '10', name: 'Energiesparmodus', target: 'Alle Systeme', schedule: 'Sa-So ganztägig', priority: 3, status: 'paused' },
]

const holidays = [
  { key: '1', name: 'Neujahr', date: '2026-01-01', mode: 'closed' },
  { key: '2', name: 'Hl. Drei Könige', date: '2026-01-06', mode: 'closed' },
  { key: '3', name: 'Karfreitag', date: '2026-04-03', mode: 'holiday' },
  { key: '4', name: 'Ostermontag', date: '2026-04-06', mode: 'holiday' },
  { key: '5', name: 'Tag der Arbeit', date: '2026-05-01', mode: 'closed' },
  { key: '6', name: 'Christi Himmelfahrt', date: '2026-05-14', mode: 'holiday' },
  { key: '7', name: 'Pfingstmontag', date: '2026-05-25', mode: 'holiday' },
  { key: '8', name: 'Fronleichnam', date: '2026-06-04', mode: 'holiday' },
  { key: '9', name: 'Mariä Himmelfahrt', date: '2026-08-15', mode: 'closed' },
  { key: '10', name: 'Tag der Dt. Einheit', date: '2026-10-03', mode: 'closed' },
  { key: '11', name: 'Allerheiligen', date: '2026-11-01', mode: 'closed' },
  { key: '12', name: 'Weihnachten', date: '2026-12-24 ~ 12-26', mode: 'holiday' },
  { key: '13', name: 'Betriebsurlaub', date: '2026-12-27 ~ 2027-01-02', mode: 'closed' },
]

export default function SchedulesPage() {
  const { t } = useI18n()
  const [addModal, setAddModal] = useState(false)
  const [holidayModal, setHolidayModal] = useState(false)

  const activePrograms = programs.filter(p => p.status === 'active').length
  const pausedPrograms = programs.filter(p => p.status === 'paused').length

  const progCols = [
    { title: t.sched.programName, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.sched.targetSystem, dataIndex: 'target', key: 'target' },
    { title: t.sched.timeArrange, dataIndex: 'schedule', key: 'schedule' },
    { title: 'Priorität', dataIndex: 'priority', key: 'priority', width: 80, align: 'center' as const },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'active' ? 'green' : 'orange'}>{v === 'active' ? t.common.active : t.common.paused}</Tag> },
    { title: t.common.operation, key: 'op', width: 200, render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link">{t.sched.editProgram}</Button>
        <Button size="small" type="link">{r.status === 'active' ? t.actions.stop : t.actions.start}</Button>
        <Button size="small" type="link" danger>{t.actions.delete}</Button>
      </Space>
    )},
  ]

  const holCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.date, dataIndex: 'date', key: 'date' },
    { title: t.common.mode, dataIndex: 'mode', key: 'mode', render: (v: string) => {
      const map: Record<string, {color: string, label: string}> = {
        closed: { color: 'red', label: t.sched.closed },
        holiday: { color: 'blue', label: t.sched.holidayMode },
        energySaving: { color: 'green', label: t.sched.energySaving },
      }
      const m = map[v] || { color: 'default', label: v }
      return <Tag color={m.color}>{m.label}</Tag>
    }},
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.schedules}</Title><Text type="secondary">{t.sched.subtitle} · Bayern (Feiertage)</Text></div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>{t.sched.addProgram}</Button>
          <Button icon={<CalendarOutlined />} onClick={() => setHolidayModal(true)}>{t.sched.addHoliday}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.activePrograms} value={activePrograms} valueStyle={{ color: '#52c41a' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.pausedPrograms} value={pausedPrograms} valueStyle={{ color: '#fa8c16' }} prefix={<PauseCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.holidays} value={holidays.length} prefix={<CalendarOutlined />} /><Text type="secondary">Bayern 2026</Text></Card></Col>
      </Row>

      <Card title={t.sched.programList} extra={<Text type="secondary">{programs.length} Programme</Text>}>
        <Table columns={progCols} dataSource={programs} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.sched.holidayCalendar} extra={<Text type="secondary">Bundesland: Bayern</Text>}>
        <Table columns={holCols} dataSource={holidays} pagination={false} size="small" />
      </Card>

      <Modal title={t.sched.addProgram} open={addModal} onOk={() => { setAddModal(false); message.success('Programm erstellt') }} onCancel={() => setAddModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.sched.programName}><Input /></Form.Item>
          <Form.Item label={t.sched.targetSystem}><Select options={[{value:'RLT (Alle)'},{value:'Heizkreise'},{value:'DALI Beleuchtung'},{value:'Jalousien'},{value:'Alle Systeme'}]} /></Form.Item>
          <Form.Item label={t.sched.timeArrange}><Space><TimePicker format="HH:mm" /><Text>~</Text><TimePicker format="HH:mm" /></Space></Form.Item>
          <Form.Item label="Priorität"><Select options={[{value:10,label:'10 (Hoch)'},{value:8,label:'8'},{value:5,label:'5 (Mittel)'},{value:3,label:'3 (Niedrig)'}]} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.sched.addHoliday} open={holidayModal} onOk={() => { setHolidayModal(false); message.success('Feiertag erstellt') }} onCancel={() => setHolidayModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input /></Form.Item>
          <Form.Item label={t.common.date}><Input placeholder="2026-05-01" /></Form.Item>
          <Form.Item label={t.common.mode}><Select options={[{value:'closed',label:t.sched.closed},{value:'holiday',label:t.sched.holidayMode},{value:'energySaving',label:t.sched.energySaving}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
