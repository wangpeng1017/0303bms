'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { TeamOutlined, UserOutlined, SafetyOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const userList = [
  { key: '1', name: 'Admin', role: 'Administrator', email: 'admin@bms.com', lastLogin: '2026-03-05 14:00', status: 'online' },
  { key: '2', name: 'Engineer Wang', role: 'Engineer', email: 'wang@bms.com', lastLogin: '2026-03-05 13:30', status: 'online' },
  { key: '3', name: 'Operator Li', role: 'Operator', email: 'li@bms.com', lastLogin: '2026-03-05 09:00', status: 'online' },
  { key: '4', name: 'Viewer Zhang', role: 'Viewer', email: 'zhang@bms.com', lastLogin: '2026-03-04 17:00', status: 'offline' },
]

const roles = [
  { key: '1', role: 'Administrator', permissions: 'Full Access', users: 1 },
  { key: '2', role: 'Engineer', permissions: 'Config + Monitor + Acknowledge', users: 2 },
  { key: '3', role: 'Operator', permissions: 'Monitor + Acknowledge', users: 3 },
  { key: '4', role: 'Viewer', permissions: 'View Only', users: 5 },
]

const auditLog = [
  { key: '1', time: '14:00:05', user: 'Admin', action: 'Modified PID parameters (Cooling Zone A)', level: 'config' },
  { key: '2', time: '13:30:12', user: 'Engineer Wang', action: 'Acknowledged alarm: AHU-01 VFD fault', level: 'alarm' },
  { key: '3', time: '09:00:00', user: 'Operator Li', action: 'Login', level: 'auth' },
  { key: '4', time: '08:30:00', user: 'Admin', action: 'Backup database', level: 'system' },
]

export default function UsersPage() {
  const { t } = useI18n()
  const [addUserModal, setAddUserModal] = useState(false)
  const [editRoleModal, setEditRoleModal] = useState(false)

  const userCols = [
    { title: t.usr.user, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.usr.role, dataIndex: 'role', key: 'role', render: (v: string) => <Tag color={v === 'Administrator' ? 'red' : v === 'Engineer' ? 'blue' : v === 'Operator' ? 'green' : 'default'}>{v}</Tag> },
    { title: t.usr.email, dataIndex: 'email', key: 'email' },
    { title: t.usr.lastLogin, dataIndex: 'lastLogin', key: 'lastLogin' },
    { title: t.common.status, dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'green' : 'default'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  const roleCols = [
    { title: t.usr.role, dataIndex: 'role', key: 'role' },
    { title: t.usr.permissions, dataIndex: 'permissions', key: 'permissions' },
    { title: t.usr.userCount, dataIndex: 'users', key: 'users' },
    { title: t.common.operation, key: 'op', render: () => <Button size="small" type="link" onClick={() => setEditRoleModal(true)}>{t.usr.editRole}</Button> },
  ]

  const auditCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 100 },
    { title: t.usr.user, dataIndex: 'user', key: 'user' },
    { title: t.common.content, dataIndex: 'action', key: 'action' },
    { title: t.common.type, dataIndex: 'level', key: 'level', render: (v: string) => <Tag>{v}</Tag> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.users}</Title><Text type="secondary">{t.usr.subtitle}</Text></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddUserModal(true)}>{t.usr.addUser}</Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.totalUsers} value={11} prefix={<TeamOutlined />} /><Text type="secondary">{t.usr.registered}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.onlineUsers} value={3} valueStyle={{ color: '#52c41a' }} prefix={<UserOutlined />} /><Text type="secondary">{t.usr.currentOnline}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.roleCount} value={4} prefix={<SafetyOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.todayOps} value={24} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>
      <Card title={t.usr.userList}><Table columns={userCols} dataSource={userList} pagination={false} size="small" /></Card>
      <Card title={t.usr.rolePerms}><Table columns={roleCols} dataSource={roles} pagination={false} size="small" /></Card>
      <Card title={t.usr.auditLog}><Table columns={auditCols} dataSource={auditLog} pagination={false} size="small" /></Card>
      <Modal title={t.usr.addUser} open={addUserModal} onOk={() => { setAddUserModal(false); message.success('OK') }} onCancel={() => setAddUserModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input /></Form.Item>
          <Form.Item label={t.usr.email}><Input type="email" /></Form.Item>
          <Form.Item label={t.usr.role}><Select options={[{value:'Administrator'},{value:'Engineer'},{value:'Operator'},{value:'Viewer'}]} /></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.usr.editRole} open={editRoleModal} onOk={() => { setEditRoleModal(false); message.success('OK') }} onCancel={() => setEditRoleModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.usr.role}><Input /></Form.Item>
          <Form.Item label={t.usr.permissions}><Select mode="multiple" options={[{value:'view'},{value:'monitor'},{value:'acknowledge'},{value:'config'},{value:'admin'}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
