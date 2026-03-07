'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, TimePicker, message } from 'antd'
import { CalendarOutlined, PauseCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function SchedulesPage() {
  const { t } = useI18n()
  const [addModal, setAddModal] = useState(false)
  const [holidayModal, setHolidayModal] = useState(false)

  const programs = [
    { key: '1', name: t.sched_data.prog1Name, target: t.sched_data.prog1Target, schedule: t.sched_data.prog1Schedule, priority: 10, status: 'active' },
    { key: '2', name: t.sched_data.prog2Name, target: t.sched_data.prog1Target, schedule: t.sched_data.prog2Schedule, priority: 8, status: 'active' },
    { key: '3', name: t.sched_data.prog3Name, target: t.sched_data.prog3Target, schedule: t.sched_data.prog3Schedule, priority: 10, status: 'active' },
    { key: '4', name: t.sched_data.prog4Name, target: t.sched_data.prog3Target, schedule: t.sched_data.prog4Schedule, priority: 5, status: 'active' },
    { key: '5', name: t.sched_data.prog5Name, target: t.sched_data.prog5Target, schedule: t.sched_data.prog5Schedule, priority: 10, status: 'active' },
    { key: '6', name: t.sched_data.prog6Name, target: t.sched_data.prog6Target, schedule: t.sched_data.prog6Schedule, priority: 6, status: 'active' },
    { key: '7', name: t.sched_data.prog7Name, target: t.sched_data.prog7Target, schedule: t.sched_data.prog7Schedule, priority: 8, status: 'active' },
    { key: '8', name: t.sched_data.prog8Name, target: t.sched_data.prog8Target, schedule: t.sched_data.prog8Schedule, priority: 10, status: 'active' },
    { key: '9', name: t.sched_data.prog9Name, target: t.sched_data.prog9Target, schedule: t.sched_data.prog9Schedule, priority: 8, status: 'active' },
    { key: '10', name: t.sched_data.prog10Name, target: t.sched_data.prog10Target, schedule: t.sched_data.prog10Schedule, priority: 3, status: 'paused' },
  ]

  const holidays = [
    { key: '1', name: t.sched_data.hol1, date: '2026-01-01', mode: 'closed' },
    { key: '2', name: t.sched_data.hol2, date: '2026-01-06', mode: 'closed' },
    { key: '3', name: t.sched_data.hol3, date: '2026-04-03', mode: 'holiday' },
    { key: '4', name: t.sched_data.hol4, date: '2026-04-06', mode: 'holiday' },
    { key: '5', name: t.sched_data.hol5, date: '2026-05-01', mode: 'closed' },
    { key: '6', name: t.sched_data.hol6, date: '2026-05-14', mode: 'holiday' },
    { key: '7', name: t.sched_data.hol7, date: '2026-05-25', mode: 'holiday' },
    { key: '8', name: t.sched_data.hol8, date: '2026-06-04', mode: 'holiday' },
    { key: '9', name: t.sched_data.hol9, date: '2026-08-15', mode: 'closed' },
    { key: '10', name: t.sched_data.hol10, date: '2026-10-03', mode: 'closed' },
    { key: '11', name: t.sched_data.hol11, date: '2026-11-01', mode: 'closed' },
    { key: '12', name: t.sched_data.hol12, date: '2026-12-24 ~ 12-26', mode: 'holiday' },
    { key: '13', name: t.sched_data.hol13, date: '2026-12-27 ~ 2027-01-02', mode: 'closed' },
  ]

  const activePrograms = programs.filter(p => p.status === 'active').length
  const pausedPrograms = programs.filter(p => p.status === 'paused').length

  const progCols = [
    { title: t.sched.programName, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.sched.targetSystem, dataIndex: 'target', key: 'target' },
    { title: t.sched.timeArrange, dataIndex: 'schedule', key: 'schedule' },
    { title: t.common.priority, dataIndex: 'priority', key: 'priority', width: 80, align: 'center' as const },
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
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.schedules}</Title><Text type="secondary">{t.sched.subtitle} · {t.sched.bavariaHolidays}</Text></div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>{t.sched.addProgram}</Button>
          <Button icon={<CalendarOutlined />} onClick={() => setHolidayModal(true)}>{t.sched.addHoliday}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.activePrograms} value={activePrograms} valueStyle={{ color: '#52c41a' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.pausedPrograms} value={pausedPrograms} valueStyle={{ color: '#fa8c16' }} prefix={<PauseCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.holidays} value={holidays.length} prefix={<CalendarOutlined />} /><Text type="secondary">{t.sched.bavYear}</Text></Card></Col>
      </Row>

      <Card title={t.sched.programList} extra={<Text type="secondary">{programs.length} {t.sched.programs}</Text>}>
        <Table columns={progCols} dataSource={programs} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.sched.holidayCalendar} extra={<Text type="secondary">{t.sched.federalState}: {t.sched.bavaria}</Text>}>
        <Table columns={holCols} dataSource={holidays} pagination={false} size="small" />
      </Card>

      <Modal title={t.sched.addProgram} open={addModal} onOk={() => { setAddModal(false); message.success(t.sched.programCreated) }} onCancel={() => setAddModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.sched.programName}><Input /></Form.Item>
          <Form.Item label={t.sched.targetSystem}>
            <Select options={[
              {value: t.sched_data.optRlt, label: t.sched_data.optRlt},
              {value: t.sched_data.optHeat, label: t.sched_data.optHeat},
              {value: t.sched_data.optDali, label: t.sched_data.optDali},
              {value: t.sched_data.optBlind, label: t.sched_data.optBlind},
              {value: t.sched_data.optAllSys, label: t.sched_data.optAllSys},
            ]} />
          </Form.Item>
          <Form.Item label={t.sched.timeArrange}><Space><TimePicker format="HH:mm" /><Text>~</Text><TimePicker format="HH:mm" /></Space></Form.Item>
          <Form.Item label="Priorität"><Select options={[{value:10,label:t.sched.priorityHigh},{value:8,label:'8'},{value:5,label:t.sched.priorityMid},{value:3,label:t.sched.priorityLow}]} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.sched.addHoliday} open={holidayModal} onOk={() => { setHolidayModal(false); message.success(t.sched.holidayCreated) }} onCancel={() => setHolidayModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input /></Form.Item>
          <Form.Item label={t.common.date}><Input placeholder="2026-05-01" /></Form.Item>
          <Form.Item label={t.common.mode}><Select options={[{value:'closed',label:t.sched.closed},{value:'holiday',label:t.sched.holidayMode},{value:'energySaving',label:t.sched.energySaving}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
