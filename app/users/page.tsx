'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { TeamOutlined, UserOutlined, SafetyOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const roles = [
  { key: '1', role: 'Administrator', permissions: 'fullAccess', users: 1, level: 'level4' },
  { key: '2', role: 'Engineer', permissions: 'configCtrlAck', users: 2, level: 'level3' },
  { key: '3', role: 'Operator', permissions: 'ctrlAck', users: 3, level: 'level2' },
  { key: '4', role: 'Viewer', permissions: 'viewOnly', users: 2, level: 'level1' },
  { key: '5', role: 'Vendor', permissions: 'vendorAccess', users: 2, level: 'vendorLevel' },
]

export default function UsersPage() {
  const { t } = useI18n()
  const [addUserModal, setAddUserModal] = useState(false)
  const [editRoleModal, setEditRoleModal] = useState(false)

  const userList = [
    { key: '1', name: 'Schulz, Thomas', role: 'Administrator', email: 't.schulz@westpark-fm.de', dept: t.usr_data.deptFm, lastLogin: '2026-03-06 08:15', status: 'online' },
    { key: '2', name: 'Weber, Michael', role: 'Engineer', email: 'm.weber@westpark-fm.de', dept: t.usr_data.deptMsr, lastLogin: '2026-03-06 07:45', status: 'online' },
    { key: '3', name: 'Müller, Sabine', role: 'Engineer', email: 's.mueller@westpark-fm.de', dept: t.usr_data.deptMsr, lastLogin: '2026-03-06 09:00', status: 'online' },
    { key: '4', name: 'Schmidt, Lars', role: 'Operator', email: 'l.schmidt@westpark-fm.de', dept: t.usr_data.deptOps, lastLogin: '2026-03-06 06:00', status: 'online' },
    { key: '5', name: 'Fischer, Anna', role: 'Operator', email: 'a.fischer@westpark-fm.de', dept: t.usr_data.deptOps, lastLogin: '2026-03-05 18:00', status: 'offline' },
    { key: '6', name: 'Bauer, Klaus', role: 'Operator', email: 'k.bauer@westpark-fm.de', dept: t.usr_data.deptOps, lastLogin: '2026-03-06 06:30', status: 'online' },
    { key: '7', name: 'Klein, Petra', role: 'Viewer', email: 'p.klein@westpark.de', dept: t.usr_data.deptAdmin, lastLogin: '2026-03-05 16:30', status: 'offline' },
    { key: '8', name: 'Wagner, Stefan', role: 'Viewer', email: 's.wagner@westpark.de', dept: t.usr_data.deptMgmt, lastLogin: '2026-03-04 11:00', status: 'offline' },
    { key: '9', name: 'Siemens Service', role: 'Vendor', email: 'service@siemens.com', dept: t.usr_data.deptExt1, lastLogin: '2026-02-28 10:00', status: 'offline' },
    { key: '10', name: 'Kampmann Service', role: 'Vendor', email: 'support@kampmann.de', dept: t.usr_data.deptExt2, lastLogin: '2026-02-15 14:00', status: 'offline' },
  ]

  const auditLog = [
    { key: '1', time: '14:23:08', user: 'Weber, Michael', action: t.usr_data.act1, level: 'alarm' },
    { key: '2', time: '13:30:12', user: 'Müller, Sabine', action: t.usr_data.act2, level: 'config' },
    { key: '3', time: '11:45:00', user: 'Schulz, Thomas', action: t.usr_data.act3, level: 'admin' },
    { key: '4', time: '09:15:00', user: 'Schmidt, Lars', action: t.usr_data.act4, level: 'config' },
    { key: '5', time: '09:00:00', user: 'Müller, Sabine', action: t.usr_data.act5, level: 'auth' },
    { key: '6', time: '08:15:00', user: 'Schulz, Thomas', action: t.usr_data.act6, level: 'auth' },
    { key: '7', time: '07:45:00', user: 'Weber, Michael', action: t.usr_data.act7, level: 'auth' },
    { key: '8', time: '06:30:00', user: 'Bauer, Klaus', action: t.usr_data.act8, level: 'auth' },
    { key: '9', time: '06:00:00', user: 'Schmidt, Lars', action: t.usr_data.act9, level: 'auth' },
    { key: '10', time: '02:00:05', user: 'System', action: t.usr_data.act10, level: 'system' },
  ]

  const onlineUsers = userList.filter(u => u.status === 'online').length

  const permMap: Record<string, string> = {
    fullAccess: t.usr.fullAccess,
    configCtrlAck: t.usr.configCtrlAck,
    ctrlAck: t.usr.ctrlAck,
    viewOnly: t.usr.viewOnly,
    vendorAccess: t.usr.vendorAccess,
  }

  const levelMap: Record<string, string> = {
    level4: t.usr.level4,
    level3: t.usr.level3,
    level2: t.usr.level2,
    level1: t.usr.level1,
    vendorLevel: t.usr.vendorLevel,
  }

  const userCols = [
    { title: t.usr.user, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.usr.role, dataIndex: 'role', key: 'role', width: 110, render: (v: string) => <Tag color={v === 'Administrator' ? 'red' : v === 'Engineer' ? 'blue' : v === 'Operator' ? 'green' : v === 'Vendor' ? 'purple' : 'default'}>{v}</Tag> },
    { title: t.common.department, dataIndex: 'dept', key: 'dept', width: 140 },
    { title: t.usr.email, dataIndex: 'email', key: 'email' },
    { title: t.usr.lastLogin, dataIndex: 'lastLogin', key: 'lastLogin', width: 140 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'default'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  const roleCols = [
    { title: t.usr.role, dataIndex: 'role', key: 'role', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.common.rank, dataIndex: 'level', key: 'level', width: 80, render: (v: string) => levelMap[v] || v },
    { title: t.usr.permissions, dataIndex: 'permissions', key: 'permissions', render: (v: string) => permMap[v] || v },
    { title: t.usr.userCount, dataIndex: 'users', key: 'users', width: 80, align: 'center' as const },
    { title: t.common.operation, key: 'op', width: 100, render: () => <Button size="small" type="link" onClick={() => setEditRoleModal(true)}>{t.usr.editRole}</Button> },
  ]

  const auditCols = [
    { title: t.common.time, dataIndex: 'time', key: 'time', width: 90 },
    { title: t.usr.user, dataIndex: 'user', key: 'user', width: 130 },
    { title: t.common.content, dataIndex: 'action', key: 'action' },
    { title: t.common.type, dataIndex: 'level', key: 'level', width: 80, render: (v: string) => {
      const map: Record<string, {color: string}> = { alarm: {color: 'red'}, config: {color: 'orange'}, admin: {color: 'blue'}, auth: {color: 'green'}, system: {color: 'default'} }
      return <Tag color={map[v]?.color || 'default'}>{v}</Tag>
    }},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.users}</Title><Text type="secondary">{t.usr.subtitle} · VDI 3814 konform</Text></div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddUserModal(true)}>{t.usr.addUser}</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.totalUsers} value={userList.length} prefix={<TeamOutlined />} /><Text type="secondary">{t.common.externalStaff}: {userList.filter(u => u.role === 'Vendor').length}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.onlineUsers} value={onlineUsers} valueStyle={{ color: '#52c41a' }} prefix={<UserOutlined />} /><Text type="secondary">{t.usr.currentOnline}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.roleCount} value={roles.length} prefix={<SafetyOutlined />} /><Text type="secondary">{t.usr.vdiLevel}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.todayOps} value={auditLog.length} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>

      <Card title={t.usr.userList}><Table columns={userCols} dataSource={userList} pagination={false} size="small" scroll={{ x: 900 }} /></Card>
      <Card title={t.usr.rolePerms} extra={<Text type="secondary">{t.usr.vdiLevelRef}</Text>}><Table columns={roleCols} dataSource={roles} pagination={false} size="small" /></Card>
      <Card title={t.usr.auditLog} extra={<Text type="secondary">Heute · {auditLog.length} {t.usr_data.recordsLabel}</Text>}><Table columns={auditCols} dataSource={auditLog} pagination={false} size="small" scroll={{ x: 700 }} /></Card>

      <Modal title={t.usr.addUser} open={addUserModal} onOk={() => { setAddUserModal(false); message.success(t.usr.userCreated) }} onCancel={() => setAddUserModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input placeholder={t.usr_data.namePlaceholder} /></Form.Item>
          <Form.Item label={t.usr.email}><Input type="email" /></Form.Item>
          <Form.Item label={t.common.department}><Input /></Form.Item>
          <Form.Item label={t.usr.role}><Select options={roles.map(r => ({ value: r.role, label: `${r.role} (${levelMap[r.level] || r.level})` }))} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.usr.editRole} open={editRoleModal} onOk={() => { setEditRoleModal(false); message.success(t.usr.roleUpdated) }} onCancel={() => setEditRoleModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.usr.role}><Input /></Form.Item>
          <Form.Item label={t.usr.permissions}><Select mode="multiple" options={[{value:'view',label:t.usr.permView},{value:'acknowledge',label:t.usr.permAck},{value:'control',label:t.usr.permCtrl},{value:'config',label:t.usr.permConfig},{value:'admin',label:t.usr.permAdmin}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
