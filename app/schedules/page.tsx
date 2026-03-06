'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, TimePicker, message } from 'antd'
import { CalendarOutlined, PauseCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const programs = [
  { key: '1', name: 'RLT 正常运行', target: 'RLT-01 至 RLT-04', schedule: '周一至周五 06:00-20:00', priority: 10, status: 'active' },
  { key: '2', name: 'RLT 夜间散热', target: 'RLT-01 至 RLT-04', schedule: '周一至周五 22:00-06:00 (>26°C)', priority: 8, status: 'active' },
  { key: '3', name: '供暖夜间回降', target: 'HK-01 至 HK-06', schedule: '每日 22:00-05:00', priority: 10, status: 'active' },
  { key: '4', name: '供暖周末模式', target: 'HK-01 至 HK-06', schedule: '周六日全天 (回降)', priority: 5, status: 'active' },
  { key: '5', name: '办公照明', target: 'DALI-G3 至 G8', schedule: '周一至周五 07:00-19:30', priority: 10, status: 'active' },
  { key: '6', name: '保洁照明', target: '全部 DALI 组', schedule: '周一至周五 19:30-21:00', priority: 6, status: 'active' },
  { key: '7', name: '室外照明', target: 'DALI-G11', schedule: '每日 黄昏-22:00', priority: 8, status: 'active' },
  { key: '8', name: '遮阳自动模式', target: '全部百叶窗', schedule: '每日 06:00-21:00', priority: 10, status: 'active' },
  { key: '9', name: '地下车库通风', target: 'RLT-05', schedule: '周一至周五 07:00-09:00, 17:00-19:00', priority: 8, status: 'active' },
  { key: '10', name: '节能模式', target: '全部系统', schedule: '周六日全天', priority: 3, status: 'paused' },
]

const holidays = [
  { key: '1', name: '元旦', date: '2026-01-01', mode: 'closed' },
  { key: '2', name: '三王节', date: '2026-01-06', mode: 'closed' },
  { key: '3', name: '耶稣受难日', date: '2026-04-03', mode: 'holiday' },
  { key: '4', name: '复活节周一', date: '2026-04-06', mode: 'holiday' },
  { key: '5', name: '劳动节', date: '2026-05-01', mode: 'closed' },
  { key: '6', name: '耶稣升天节', date: '2026-05-14', mode: 'holiday' },
  { key: '7', name: '圣灵降临节周一', date: '2026-05-25', mode: 'holiday' },
  { key: '8', name: '基督圣体节', date: '2026-06-04', mode: 'holiday' },
  { key: '9', name: '圣母升天节', date: '2026-08-15', mode: 'closed' },
  { key: '10', name: '德国统一日', date: '2026-10-03', mode: 'closed' },
  { key: '11', name: '万圣节', date: '2026-11-01', mode: 'closed' },
  { key: '12', name: '圣诞节', date: '2026-12-24 ~ 12-26', mode: 'holiday' },
  { key: '13', name: '公司假期', date: '2026-12-27 ~ 2027-01-02', mode: 'closed' },
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
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 80, align: 'center' as const },
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
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.schedules}</Title><Text type="secondary">{t.sched.subtitle} · 巴伐利亚 (含节假日)</Text></div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModal(true)}>{t.sched.addProgram}</Button>
          <Button icon={<CalendarOutlined />} onClick={() => setHolidayModal(true)}>{t.sched.addHoliday}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.activePrograms} value={activePrograms} valueStyle={{ color: '#52c41a' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.pausedPrograms} value={pausedPrograms} valueStyle={{ color: '#fa8c16' }} prefix={<PauseCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card hoverable><Statistic title={t.sched.holidays} value={holidays.length} prefix={<CalendarOutlined />} /><Text type="secondary">巴伐利亚 2026</Text></Card></Col>
      </Row>

      <Card title={t.sched.programList} extra={<Text type="secondary">{programs.length} 个程序</Text>}>
        <Table columns={progCols} dataSource={programs} pagination={false} size="small" scroll={{ x: 900 }} />
      </Card>

      <Card title={t.sched.holidayCalendar} extra={<Text type="secondary">联邦州: 巴伐利亚</Text>}>
        <Table columns={holCols} dataSource={holidays} pagination={false} size="small" />
      </Card>

      <Modal title={t.sched.addProgram} open={addModal} onOk={() => { setAddModal(false); message.success('程序已创建') }} onCancel={() => setAddModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.sched.programName}><Input /></Form.Item>
          <Form.Item label={t.sched.targetSystem}><Select options={[{value:'RLT (全部)'},{value:'供暖回路'},{value:'DALI 照明'},{value:'百叶窗'},{value:'全部系统'}]} /></Form.Item>
          <Form.Item label={t.sched.timeArrange}><Space><TimePicker format="HH:mm" /><Text>~</Text><TimePicker format="HH:mm" /></Space></Form.Item>
          <Form.Item label="Priorität"><Select options={[{value:10,label:'10 (高)'},{value:8,label:'8'},{value:5,label:'5 (中)'},{value:3,label:'3 (低)'}]} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.sched.addHoliday} open={holidayModal} onOk={() => { setHolidayModal(false); message.success('节假日已创建') }} onCancel={() => setHolidayModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input /></Form.Item>
          <Form.Item label={t.common.date}><Input placeholder="2026-05-01" /></Form.Item>
          <Form.Item label={t.common.mode}><Select options={[{value:'closed',label:t.sched.closed},{value:'holiday',label:t.sched.holidayMode},{value:'energySaving',label:t.sched.energySaving}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
