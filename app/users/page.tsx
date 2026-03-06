'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { TeamOutlined, UserOutlined, SafetyOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const userList = [
  { key: '1', name: 'Schulz, Thomas', role: 'Administrator', email: 't.schulz@westpark-fm.de', dept: '设施管理', lastLogin: '2026-03-06 08:15', status: 'online' },
  { key: '2', name: 'Weber, Michael', role: 'Engineer', email: 'm.weber@westpark-fm.de', dept: 'MSR技术', lastLogin: '2026-03-06 07:45', status: 'online' },
  { key: '3', name: 'Müller, Sabine', role: 'Engineer', email: 's.mueller@westpark-fm.de', dept: 'MSR技术', lastLogin: '2026-03-06 09:00', status: 'online' },
  { key: '4', name: 'Schmidt, Lars', role: 'Operator', email: 'l.schmidt@westpark-fm.de', dept: '楼宇运维', lastLogin: '2026-03-06 06:00', status: 'online' },
  { key: '5', name: 'Fischer, Anna', role: 'Operator', email: 'a.fischer@westpark-fm.de', dept: '楼宇运维', lastLogin: '2026-03-05 18:00', status: 'offline' },
  { key: '6', name: 'Bauer, Klaus', role: 'Operator', email: 'k.bauer@westpark-fm.de', dept: '楼宇运维', lastLogin: '2026-03-06 06:30', status: 'online' },
  { key: '7', name: 'Klein, Petra', role: 'Viewer', email: 'p.klein@westpark.de', dept: '行政管理', lastLogin: '2026-03-05 16:30', status: 'offline' },
  { key: '8', name: 'Wagner, Stefan', role: 'Viewer', email: 's.wagner@westpark.de', dept: '管理层', lastLogin: '2026-03-04 11:00', status: 'offline' },
  { key: '9', name: 'Siemens Service', role: 'Vendor', email: 'service@siemens.com', dept: '外部 (维保)', lastLogin: '2026-02-28 10:00', status: 'offline' },
  { key: '10', name: 'Kampmann Service', role: 'Vendor', email: 'support@kampmann.de', dept: '外部 (空调)', lastLogin: '2026-02-15 14:00', status: 'offline' },
]

const roles = [
  { key: '1', role: 'Administrator', permissions: '完全访问 (配置+控制+管理)', users: 1, level: '第4级' },
  { key: '2', role: 'Engineer', permissions: '配置+控制+确认+监控', users: 2, level: '第3级' },
  { key: '3', role: 'Operator', permissions: '控制+确认+监控', users: 3, level: '第2级' },
  { key: '4', role: 'Viewer', permissions: '仅监控 (只读)', users: 2, level: '第1级' },
  { key: '5', role: 'Vendor', permissions: '受限访问 (限时, VPN)', users: 2, level: '供应商级' },
]

const auditLog = [
  { key: '1', time: '14:23:08', user: 'Weber, Michael', action: '报警确认: RLT-03 变频器故障 (A级报警)', level: 'alarm' },
  { key: '2', time: '13:30:12', user: 'Müller, Sabine', action: 'PID参数修改: OG2会议区 (Kp: 2.5→3.0)', level: 'config' },
  { key: '3', time: '11:45:00', user: 'Schulz, Thomas', action: '新增用户: Kampmann Service (供应商)', level: 'admin' },
  { key: '4', time: '09:15:00', user: 'Schmidt, Lars', action: '设定值修改: HK-03 供水温度 52°C→54°C', level: 'config' },
  { key: '5', time: '09:00:00', user: 'Müller, Sabine', action: '登录 (IP: 192.168.20.15)', level: 'auth' },
  { key: '6', time: '08:15:00', user: 'Schulz, Thomas', action: '登录 (IP: 192.168.20.10)', level: 'auth' },
  { key: '7', time: '07:45:00', user: 'Weber, Michael', action: '登录 (IP: 192.168.20.12)', level: 'auth' },
  { key: '8', time: '06:30:00', user: 'Bauer, Klaus', action: '登录 (IP: 192.168.20.18)', level: 'auth' },
  { key: '9', time: '06:00:00', user: 'Schmidt, Lars', action: '登录 (IP: 192.168.20.16)', level: 'auth' },
  { key: '10', time: '02:00:05', user: 'System', action: '自动数据备份完成 (268 MB)', level: 'system' },
]

export default function UsersPage() {
  const { t } = useI18n()
  const [addUserModal, setAddUserModal] = useState(false)
  const [editRoleModal, setEditRoleModal] = useState(false)

  const onlineUsers = userList.filter(u => u.status === 'online').length

  const userCols = [
    { title: t.usr.user, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.usr.role, dataIndex: 'role', key: 'role', width: 110, render: (v: string) => <Tag color={v === 'Administrator' ? 'red' : v === 'Engineer' ? 'blue' : v === 'Operator' ? 'green' : v === 'Vendor' ? 'purple' : 'default'}>{v}</Tag> },
    { title: '部门', dataIndex: 'dept', key: 'dept', width: 140 },
    { title: t.usr.email, dataIndex: 'email', key: 'email' },
    { title: t.usr.lastLogin, dataIndex: 'lastLogin', key: 'lastLogin', width: 140 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'default'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  const roleCols = [
    { title: t.usr.role, dataIndex: 'role', key: 'role', render: (v: string) => <Text strong>{v}</Text> },
    { title: '等级', dataIndex: 'level', key: 'level', width: 80 },
    { title: t.usr.permissions, dataIndex: 'permissions', key: 'permissions' },
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
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.totalUsers} value={userList.length} prefix={<TeamOutlined />} /><Text type="secondary">含 {userList.filter(u => u.role === 'Vendor').length} 外部人员</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.onlineUsers} value={onlineUsers} valueStyle={{ color: '#52c41a' }} prefix={<UserOutlined />} /><Text type="secondary">{t.usr.currentOnline}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.roleCount} value={roles.length} prefix={<SafetyOutlined />} /><Text type="secondary">VDI 3814 等级</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.todayOps} value={auditLog.length} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>

      <Card title={t.usr.userList}><Table columns={userCols} dataSource={userList} pagination={false} size="small" scroll={{ x: 900 }} /></Card>
      <Card title={t.usr.rolePerms} extra={<Text type="secondary">依据 VDI 3814 操作层级</Text>}><Table columns={roleCols} dataSource={roles} pagination={false} size="small" /></Card>
      <Card title={t.usr.auditLog} extra={<Text type="secondary">Heute · {auditLog.length} 条记录</Text>}><Table columns={auditCols} dataSource={auditLog} pagination={false} size="small" scroll={{ x: 700 }} /></Card>

      <Modal title={t.usr.addUser} open={addUserModal} onOk={() => { setAddUserModal(false); message.success('用户已创建') }} onCancel={() => setAddUserModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input placeholder="姓, 名" /></Form.Item>
          <Form.Item label={t.usr.email}><Input type="email" /></Form.Item>
          <Form.Item label="Abteilung"><Input /></Form.Item>
          <Form.Item label={t.usr.role}><Select options={roles.map(r => ({ value: r.role, label: `${r.role} (${r.level})` }))} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.usr.editRole} open={editRoleModal} onOk={() => { setEditRoleModal(false); message.success('角色已更新') }} onCancel={() => setEditRoleModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.usr.role}><Input /></Form.Item>
          <Form.Item label={t.usr.permissions}><Select mode="multiple" options={[{value:'view',label:'监控'},{value:'acknowledge',label:'确认报警'},{value:'control',label:'控制操作'},{value:'config',label:'参数配置'},{value:'admin',label:'系统管理'}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
