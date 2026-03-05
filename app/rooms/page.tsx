'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Row, Col, Typography, Button, Space, Tag, Modal, Slider, Form, message } from 'antd'
import { HomeOutlined, TeamOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const roomList = [
  { key: '1', name: 'Room 101', temp: 22.5, setpoint: 22, co2: 520, humidity: 45, presence: true, light: 85, shade: 60 },
  { key: '2', name: 'Room 201', temp: 23.1, setpoint: 23, co2: 680, humidity: 50, presence: true, light: 90, shade: 75 },
  { key: '3', name: 'Room 301', temp: 24.0, setpoint: 22, co2: 920, humidity: 55, presence: true, light: 70, shade: 100 },
  { key: '4', name: 'Room 401', temp: 21.8, setpoint: 22, co2: 450, humidity: 42, presence: false, light: 0, shade: 0 },
  { key: '5', name: 'Room 102', temp: 22.2, setpoint: 22, co2: 380, humidity: 48, presence: false, light: 0, shade: 0 },
  { key: '6', name: 'Room 202', temp: 23.5, setpoint: 23, co2: 710, humidity: 52, presence: true, light: 80, shade: 50 },
]

export default function RoomsPage() {
  const { t } = useI18n()
  const [adjustModal, setAdjustModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [batchModal, setBatchModal] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.rooms}</Title><Text type="secondary">{t.room.subtitle}</Text></div>
        <Space>
          <Button type="primary" icon={<SettingOutlined />} onClick={() => setBatchModal(true)}>{t.room.batchConfig}</Button>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.totalRooms} value={6} prefix={<HomeOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.occupiedRooms} value={4} prefix={<TeamOutlined />} valueStyle={{ color: '#1677ff' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.avgTemp} value={22.9} suffix="°C" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.avgCo2} value={610} suffix="ppm" /></Card></Col>
      </Row>
      <Row gutter={[16, 16]}>
        {roomList.map(room => (
          <Col xs={24} sm={12} lg={8} key={room.key}>
            <Card hoverable title={<Space><HomeOutlined />{room.name}</Space>} extra={<Tag color={room.presence ? 'green' : 'default'}>{room.presence ? t.room.occupied : t.room.vacant}</Tag>}>
              <Row gutter={[8, 8]}>
                <Col span={12}><Text type="secondary">{t.room.tempCtrl}</Text><div><Text strong style={{ color: Math.abs(room.temp - room.setpoint) > 1 ? '#f5222d' : '#52c41a' }}>{room.temp}°C</Text> / {room.setpoint}°C</div></Col>
                <Col span={12}><Text type="secondary">CO₂</Text><div><Text strong style={{ color: room.co2 > 800 ? '#f5222d' : '#52c41a' }}>{room.co2} ppm</Text></div></Col>
                <Col span={12}><Text type="secondary">{t.room.lightCtrl}</Text><div>{room.light}%</div></Col>
                <Col span={12}><Text type="secondary">{t.room.shadingPos}</Text><div>{room.shade}%</div></Col>
              </Row>
              <div style={{ marginTop: 12, textAlign: 'right' }}>
                <Button size="small" type="primary" ghost onClick={() => { setSelectedRoom(room); setAdjustModal(true) }}>{t.room.adjustRoom}</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title={`${t.room.adjustRoom} - ${selectedRoom?.name || ''}`} open={adjustModal} onOk={() => { setAdjustModal(false); message.success('OK') }} onCancel={() => setAdjustModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.room.setpointLabel} (°C)`}><Slider min={18} max={28} defaultValue={selectedRoom?.setpoint || 22} marks={{18:'18',22:'22',28:'28'}} /></Form.Item>
          <Form.Item label={t.room.lightCtrl}><Slider min={0} max={100} defaultValue={selectedRoom?.light || 0} /></Form.Item>
          <Form.Item label={t.room.shadingPos}><Slider min={0} max={100} defaultValue={selectedRoom?.shade || 0} /></Form.Item>
        </Form>
      </Modal>
      <Modal title={t.room.batchConfig} open={batchModal} onOk={() => { setBatchModal(false); message.success('OK') }} onCancel={() => setBatchModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.room.allRooms} - ${t.room.setpointLabel}`}><Slider min={18} max={28} defaultValue={22} /></Form.Item>
          <Form.Item label={`${t.room.allRooms} - ${t.room.lightCtrl}`}><Slider min={0} max={100} defaultValue={80} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
