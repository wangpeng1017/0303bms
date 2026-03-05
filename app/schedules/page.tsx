'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, TimePicker, message } from 'antd'
import { CalendarOutlined, PauseCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const programs = [
  { key: '1', name: 'HVAC Weekday', target: 'AHU 1-3', schedule: 'Mon-Fri 06:00-20:00', status: 'active' },
  { key: '2', name: 'Lighting Office', target: 'DALI G1-G3', schedule: 'Mon-Fri 07:00-19:00', status: 'active' },
  { key: '3', name: 'Heating Night', target: 'HK 1-4', schedule: 'Daily 22:00-06:00', status: 'active' },
  { key: '4', name: 'Weekend Eco', target: 'All Systems', schedule: 'Sat-Sun All Day', status: 'paused' },
]

const holidays = [
  { key: '1', name: 'New Year', date: '2026-01-01', mode: 'closed' },
  { key: '2', name: 'Spring Festival', date: '2026-01-29 ~ 02-04', mode: 'holiday' },
  { key: '3', name: 'Easter', date: '2026-04-05 ~ 04-06', mode: 'energySaving' },
  { key: '4', name: 'Christmas', date: '2026-12-24 ~ 12-26', mode: 'holiday' },
]

export default function SchedulesPage() {
  const { t } = useI18n()
  const [addModal, setAddModal] = useState(false)
  const [holidayModal, setHolidayModal] = useState(false)

  const progCols = [
    { title: t.sched.programName, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.sched.targetSystem, dataIndex: 'target', key: 'target' },
    { title: t.sched.timeArrange, dataIndex: 'schedule', key: 'schedule' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'active' ? 'green' : 'orange'}>{v === 'active' ? t.common.active : t.common.paused}</Tag> },
    { title: t.common.operation, key: 'op', render: (_: any, r: any) => (
      <Space>
        <Button size="small" type="link">{t.sched.editProgram}</Button>
        <Button size="small" type="link">{r.status === 'active' ? t.actions.stop : t.actions.start}</Button>
        <Button size="small" type="link" danger>{t.actions.delete}</Button>
      </Space>
    )},
  ]

  const holCols = [
    { title: t.common.name, dataIndex: 'name', key: 'name' },
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
    { title: t.common.operation, key: 'op', render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.schedules}</Title><Text type="secondary">{t.sched.subtitle}</Text></div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>{t.sched.addProgram}</Button>
          <Button icon={<CalendarOutlined />} onClick={() => setHolidayModal(true)}>{t.sched.addHoliday}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.activePrograms} value={3} valueStyle={{ color: '#52c41a' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.pausedPrograms} value={1} valueStyle={{ color: '#fa8c16' }} prefix={<PauseCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.holidays} value={4} prefix={<CalendarOutlined />} /><Text type="secondary">{t.sched.configured}</Text></Card></Col>
      </Row>
      <Card title={t.sched.programList}><Table columns={progCols} dataSource={programs} pagination={false} size="small" /></Card>
      <Card title={t.sched.holidayCalendar}><Table columns={holCols} dataSource={holidays} pagination={false} size="small" /></Card>
      <Modal title={t.sched.addProgram} open={addModal} onOk={() => { setAddModal(false); message.success('OK') }} onCancel={() => setAddModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.sched.programName}><Input /></Form.Item>
          <Form.Item label={t.sched.targetSystem}><Select options={[{value:'HVAC'},{value:'Lighting'},{value:'Heating'},{value:'All'}]} /></Form.Item>
          <Form.Item label={t.sched.timeArrange}><Space><TimePicker format="HH:mm" /><Text>~</Text><TimePicker format="HH:mm" /></Space></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.sched.addHoliday} open={holidayModal} onOk={() => { setHolidayModal(false); message.success('OK') }} onCancel={() => setHolidayModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input /></Form.Item>
          <Form.Item label={t.common.date}><Input placeholder="2026-05-01" /></Form.Item>
          <Form.Item label={t.common.mode}><Select options={[{value:'closed',label:t.sched.closed},{value:'holiday',label:t.sched.holidayMode},{value:'energySaving',label:t.sched.energySaving}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
