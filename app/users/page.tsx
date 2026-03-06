'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Table, Tag, Row, Col, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd'
import { TeamOutlined, UserOutlined, SafetyOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const userList = [
  { key: '1', name: 'Schulz, Thomas', role: 'Administrator', email: 't.schulz@westpark-fm.de', dept: 'Facility Management', lastLogin: '2026-03-06 08:15', status: 'online' },
  { key: '2', name: 'Weber, Michael', role: 'Engineer', email: 'm.weber@westpark-fm.de', dept: 'MSR-Technik', lastLogin: '2026-03-06 07:45', status: 'online' },
  { key: '3', name: 'Müller, Sabine', role: 'Engineer', email: 's.mueller@westpark-fm.de', dept: 'MSR-Technik', lastLogin: '2026-03-06 09:00', status: 'online' },
  { key: '4', name: 'Schmidt, Lars', role: 'Operator', email: 'l.schmidt@westpark-fm.de', dept: 'Gebäudebetrieb', lastLogin: '2026-03-06 06:00', status: 'online' },
  { key: '5', name: 'Fischer, Anna', role: 'Operator', email: 'a.fischer@westpark-fm.de', dept: 'Gebäudebetrieb', lastLogin: '2026-03-05 18:00', status: 'offline' },
  { key: '6', name: 'Bauer, Klaus', role: 'Operator', email: 'k.bauer@westpark-fm.de', dept: 'Gebäudebetrieb', lastLogin: '2026-03-06 06:30', status: 'online' },
  { key: '7', name: 'Klein, Petra', role: 'Viewer', email: 'p.klein@westpark.de', dept: 'Verwaltung', lastLogin: '2026-03-05 16:30', status: 'offline' },
  { key: '8', name: 'Wagner, Stefan', role: 'Viewer', email: 's.wagner@westpark.de', dept: 'Geschäftsführung', lastLogin: '2026-03-04 11:00', status: 'offline' },
  { key: '9', name: 'Siemens Service', role: 'Vendor', email: 'service@siemens.com', dept: 'Extern (Wartung)', lastLogin: '2026-02-28 10:00', status: 'offline' },
  { key: '10', name: 'Kampmann Service', role: 'Vendor', email: 'support@kampmann.de', dept: 'Extern (RLT)', lastLogin: '2026-02-15 14:00', status: 'offline' },
]

const roles = [
  { key: '1', role: 'Administrator', permissions: 'Vollzugriff (Config + Steuerung + Verwaltung)', users: 1, level: 'Stufe 4' },
  { key: '2', role: 'Engineer', permissions: 'Konfiguration + Steuerung + Quittierung + Monitoring', users: 2, level: 'Stufe 3' },
  { key: '3', role: 'Operator', permissions: 'Steuerung + Quittierung + Monitoring', users: 3, level: 'Stufe 2' },
  { key: '4', role: 'Viewer', permissions: 'Nur Monitoring (Lesezugriff)', users: 2, level: 'Stufe 1' },
  { key: '5', role: 'Vendor', permissions: 'Eingeschränkter Zugriff (zeitbegrenzt, VPN)', users: 2, level: 'Stufe V' },
]

const auditLog = [
  { key: '1', time: '14:23:08', user: 'Weber, Michael', action: 'Alarm quittiert: RLT-03 VFD-Störung (A-Alarm)', level: 'alarm' },
  { key: '2', time: '13:30:12', user: 'Müller, Sabine', action: 'PID-Parameter geändert: Zone OG2-Konferenz (Kp: 2.5→3.0)', level: 'config' },
  { key: '3', time: '11:45:00', user: 'Schulz, Thomas', action: 'Benutzer hinzugefügt: Kampmann Service (Vendor)', level: 'admin' },
  { key: '4', time: '09:15:00', user: 'Schmidt, Lars', action: 'Sollwert geändert: HK-03 Vorlauf 52°C→54°C', level: 'config' },
  { key: '5', time: '09:00:00', user: 'Müller, Sabine', action: 'Anmeldung (IP: 192.168.20.15)', level: 'auth' },
  { key: '6', time: '08:15:00', user: 'Schulz, Thomas', action: 'Anmeldung (IP: 192.168.20.10)', level: 'auth' },
  { key: '7', time: '07:45:00', user: 'Weber, Michael', action: 'Anmeldung (IP: 192.168.20.12)', level: 'auth' },
  { key: '8', time: '06:30:00', user: 'Bauer, Klaus', action: 'Anmeldung (IP: 192.168.20.18)', level: 'auth' },
  { key: '9', time: '06:00:00', user: 'Schmidt, Lars', action: 'Anmeldung (IP: 192.168.20.16)', level: 'auth' },
  { key: '10', time: '02:00:05', user: 'System', action: 'Automatische Datensicherung abgeschlossen (268 MB)', level: 'system' },
]

export default function UsersPage() {
  const { t } = useI18n()
  const [addUserModal, setAddUserModal] = useState(false)
  const [editRoleModal, setEditRoleModal] = useState(false)

  const onlineUsers = userList.filter(u => u.status === 'online').length

  const userCols = [
    { title: t.usr.user, dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: t.usr.role, dataIndex: 'role', key: 'role', width: 110, render: (v: string) => <Tag color={v === 'Administrator' ? 'red' : v === 'Engineer' ? 'blue' : v === 'Operator' ? 'green' : v === 'Vendor' ? 'purple' : 'default'}>{v}</Tag> },
    { title: 'Abteilung', dataIndex: 'dept', key: 'dept', width: 140 },
    { title: t.usr.email, dataIndex: 'email', key: 'email' },
    { title: t.usr.lastLogin, dataIndex: 'lastLogin', key: 'lastLogin', width: 140 },
    { title: t.common.status, dataIndex: 'status', key: 'status', width: 80, render: (v: string) => <Tag color={v === 'online' ? 'green' : 'default'}>{v === 'online' ? t.status.online : t.status.offline}</Tag> },
    { title: t.common.operation, key: 'op', width: 120, render: () => <Space><Button size="small" type="link">{t.actions.edit}</Button><Button size="small" type="link" danger>{t.actions.delete}</Button></Space> },
  ]

  const roleCols = [
    { title: t.usr.role, dataIndex: 'role', key: 'role', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Stufe', dataIndex: 'level', key: 'level', width: 80 },
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
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.totalUsers} value={userList.length} prefix={<TeamOutlined />} /><Text type="secondary">inkl. {userList.filter(u => u.role === 'Vendor').length} Externe</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.onlineUsers} value={onlineUsers} valueStyle={{ color: '#52c41a' }} prefix={<UserOutlined />} /><Text type="secondary">{t.usr.currentOnline}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.roleCount} value={roles.length} prefix={<SafetyOutlined />} /><Text type="secondary">VDI 3814 Stufen</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.usr.todayOps} value={auditLog.length} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>

      <Card title={t.usr.userList}><Table columns={userCols} dataSource={userList} pagination={false} size="small" scroll={{ x: 900 }} /></Card>
      <Card title={t.usr.rolePerms} extra={<Text type="secondary">Gemäß VDI 3814 Bedienebenen</Text>}><Table columns={roleCols} dataSource={roles} pagination={false} size="small" /></Card>
      <Card title={t.usr.auditLog} extra={<Text type="secondary">Heute · {auditLog.length} Einträge</Text>}><Table columns={auditCols} dataSource={auditLog} pagination={false} size="small" scroll={{ x: 700 }} /></Card>

      <Modal title={t.usr.addUser} open={addUserModal} onOk={() => { setAddUserModal(false); message.success('Benutzer erstellt') }} onCancel={() => setAddUserModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.name}><Input placeholder="Nachname, Vorname" /></Form.Item>
          <Form.Item label={t.usr.email}><Input type="email" /></Form.Item>
          <Form.Item label="Abteilung"><Input /></Form.Item>
          <Form.Item label={t.usr.role}><Select options={roles.map(r => ({ value: r.role, label: `${r.role} (${r.level})` }))} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.usr.editRole} open={editRoleModal} onOk={() => { setEditRoleModal(false); message.success('Rolle aktualisiert') }} onCancel={() => setEditRoleModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.usr.role}><Input /></Form.Item>
          <Form.Item label={t.usr.permissions}><Select mode="multiple" options={[{value:'view',label:'Monitoring'},{value:'acknowledge',label:'Quittierung'},{value:'control',label:'Steuerung'},{value:'config',label:'Konfiguration'},{value:'admin',label:'Verwaltung'}]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
