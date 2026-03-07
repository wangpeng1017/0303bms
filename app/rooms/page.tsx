'use client'

import { useI18n } from '@/components/i18n-provider'
import { useState } from 'react'
import { Card, Statistic, Row, Col, Typography, Button, Space, Tag, Modal, Slider, Select, Form, message } from 'antd'
import { HomeOutlined, TeamOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const floors = ['Alle', 'EG', 'OG1', 'OG2', 'OG3', 'UG']

export default function RoomsPage() {
  const { t } = useI18n()
  const [adjustModal, setAdjustModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [batchModal, setBatchModal] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState('Alle')

  const roomList = [
    { key: '1', name: t.room_data.r1Name, floor: 'EG', type: t.room_data.r1Type, area: 85, temp: 22.3, setpoint: 22, co2: 485, humidity: 44, presence: true, persons: 3, light: 90, shade: 40, ddc: 'DDC-EG-01' },
    { key: '2', name: t.room_data.r2Name, floor: 'EG', type: t.room_data.r2Type, area: 45, temp: 22.0, setpoint: 22, co2: 420, humidity: 43, presence: true, persons: 5, light: 85, shade: 30, ddc: 'DDC-EG-01' },
    { key: '3', name: t.room_data.r3Name, floor: 'EG', type: t.room_data.r3Type, area: 120, temp: 22.5, setpoint: 22, co2: 580, humidity: 52, presence: true, persons: 35, light: 100, shade: 60, ddc: 'DDC-EG-02' },
    { key: '4', name: t.room_data.r4Name, floor: 'OG1', type: t.room_data.r4Type, area: 280, temp: 22.8, setpoint: 22, co2: 620, humidity: 47, presence: true, persons: 28, light: 85, shade: 55, ddc: 'DDC-OG1-01' },
    { key: '5', name: t.room_data.r5Name, floor: 'OG1', type: t.room_data.r5Type, area: 240, temp: 23.1, setpoint: 22, co2: 590, humidity: 48, presence: true, persons: 22, light: 80, shade: 65, ddc: 'DDC-OG1-01' },
    { key: '6', name: t.room_data.r6Name, floor: 'OG1', type: t.room_data.r6Type, area: 35, temp: 23.4, setpoint: 23, co2: 780, humidity: 51, presence: true, persons: 12, light: 100, shade: 75, ddc: 'DDC-OG1-02' },
    { key: '7', name: t.room_data.r7Name, floor: 'OG1', type: t.room_data.r7Type, area: 18, temp: 22.2, setpoint: 22, co2: 450, humidity: 44, presence: true, persons: 1, light: 70, shade: 20, ddc: 'DDC-OG1-02' },
    { key: '8', name: t.room_data.r8Name, floor: 'OG2', type: t.room_data.r8Type, area: 65, temp: 22.1, setpoint: 22, co2: 520, humidity: 43, presence: true, persons: 6, light: 80, shade: 45, ddc: 'DDC-OG2-01' },
    { key: '9', name: t.room_data.r9Name, floor: 'OG2', type: t.room_data.r9Type, area: 55, temp: 22.4, setpoint: 22, co2: 490, humidity: 45, presence: true, persons: 4, light: 75, shade: 40, ddc: 'DDC-OG2-01' },
    { key: '10', name: t.room_data.r10Name, floor: 'OG2', type: t.room_data.r10Type, area: 50, temp: 24.2, setpoint: 23, co2: 940, humidity: 56, presence: true, persons: 18, light: 100, shade: 100, ddc: 'DDC-OG2-02' },
    { key: '11', name: t.room_data.r11Name, floor: 'OG2', type: t.room_data.r11Type, area: 12, temp: 23.0, setpoint: 22, co2: 510, humidity: 48, presence: false, persons: 0, light: 0, shade: 0, ddc: 'DDC-OG2-02' },
    { key: '12', name: t.room_data.r12Name, floor: 'OG3', type: t.room_data.r12Type, area: 65, temp: 21.9, setpoint: 22, co2: 480, humidity: 42, presence: true, persons: 5, light: 80, shade: 35, ddc: 'DDC-OG3-01' },
    { key: '13', name: t.room_data.r13Name, floor: 'OG3', type: t.room_data.r13Type, area: 55, temp: 22.2, setpoint: 22, co2: 410, humidity: 41, presence: true, persons: 2, light: 65, shade: 25, ddc: 'DDC-OG3-01' },
    { key: '14', name: t.room_data.r14Name, floor: 'OG3', type: t.room_data.r14Type, area: 60, temp: 25.1, setpoint: 23, co2: 1050, humidity: 58, presence: true, persons: 22, light: 100, shade: 100, ddc: 'DDC-OG3-02' },
    { key: '15', name: t.room_data.r15Name, floor: 'OG3', type: t.room_data.r15Type, area: 30, temp: 22.0, setpoint: 22, co2: 390, humidity: 40, presence: false, persons: 0, light: 0, shade: 0, ddc: 'DDC-OG3-02' },
    { key: '16', name: t.room_data.r16Name, floor: 'UG', type: t.room_data.r16Type, area: 40, temp: 21.0, setpoint: 21, co2: 390, humidity: 38, presence: false, persons: 0, light: 30, shade: 0, ddc: 'DDC-UG-01' },
  ]

  const filteredRooms = selectedFloor === 'Alle' ? roomList : roomList.filter(r => r.floor === selectedFloor)
  const occupiedRooms = roomList.filter(r => r.presence).length
  const totalPersons = roomList.reduce((a, b) => a + b.persons, 0)
  const avgTemp = +(roomList.reduce((a, b) => a + b.temp, 0) / roomList.length).toFixed(1)
  const avgCo2 = Math.round(roomList.reduce((a, b) => a + b.co2, 0) / roomList.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Title level={4} style={{ margin: 0 }}>{t.nav.rooms}</Title><Text type="secondary">{t.room.subtitle} · {roomList.length} {t.room.roomsLabel} · 5{t.room.floorsLabel}</Text></div>
        <Space>
          <Select value={selectedFloor} onChange={setSelectedFloor} options={floors.map(f => ({ value: f, label: f }))} style={{ width: 100 }} />
          <Button type="primary" icon={<SettingOutlined />} onClick={() => setBatchModal(true)}>{t.room.batchConfig}</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.totalRooms} value={roomList.length} prefix={<HomeOutlined />} /><Text type="secondary">~8.500 m² BGF</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.occupiedRooms} value={occupiedRooms} prefix={<TeamOutlined />} valueStyle={{ color: '#1677ff' }} /><Text type="secondary">{totalPersons} {t.common.persons}</Text></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.avgTemp} value={avgTemp} suffix="°C" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card hoverable><Statistic title={t.room.avgCo2} value={avgCo2} suffix="ppm" valueStyle={{ color: avgCo2 > 800 ? '#fa8c16' : '#52c41a' }} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filteredRooms.map(room => (
          <Col xs={24} sm={12} lg={8} xl={6} key={room.key}>
            <Card
              hoverable
              title={<Space><HomeOutlined /><span style={{ fontSize: 13 }}>{room.name}</span></Space>}
              extra={<Tag color={room.presence ? 'green' : 'default'}>{room.presence ? `${room.persons}P` : t.room.vacant}</Tag>}
              size="small"
            >
              <Row gutter={[8, 6]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>{t.room.tempCtrl}</Text>
                  <div>
                    <Text strong style={{ color: Math.abs(room.temp - room.setpoint) > 1.5 ? '#f5222d' : '#52c41a', fontSize: 15 }}>{room.temp}°C</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}> /{room.setpoint}°C</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>CO₂</Text>
                  <div>
                    <Text strong style={{ color: room.co2 > 1000 ? '#f5222d' : room.co2 > 800 ? '#fa8c16' : '#52c41a', fontSize: 15 }}>{room.co2}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}> ppm</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>{t.room.lightCtrl}</Text>
                  <div>{room.light}%</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>{t.room.shadingPos}</Text>
                  <div>{room.shade}%</div>
                </Col>
              </Row>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 10 }}>{room.ddc} · {room.type} · {room.area}m²</Text>
                <Button size="small" type="primary" ghost onClick={() => { setSelectedRoom(room); setAdjustModal(true) }}>{t.room.adjustRoom}</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={`${t.room.adjustRoom} - ${selectedRoom?.name || ''}`} open={adjustModal} onOk={() => { setAdjustModal(false); message.success(t.room.paramsUpdated) }} onCancel={() => setAdjustModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={`${t.room.setpointLabel} (°C)`}><Slider min={18} max={28} step={0.5} defaultValue={selectedRoom?.setpoint || 22} marks={{18:'18°C',20:'20',22:'22',24:'24',26:'26',28:'28°C'}} /></Form.Item>
          <Form.Item label={t.room.lightCtrl}><Slider min={0} max={100} defaultValue={selectedRoom?.light || 0} marks={{0:t.room.sliderOff,50:'50%',100:'100%'}} /></Form.Item>
          <Form.Item label={t.room.shadingPos}><Slider min={0} max={100} defaultValue={selectedRoom?.shade || 0} marks={{0:t.room.sliderOpen,50:'50%',100:t.room.sliderClose}} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t.room.batchConfig} open={batchModal} onOk={() => { setBatchModal(false); message.success(t.room.batchApplied) }} onCancel={() => setBatchModal(false)} okText={t.actions.save} cancelText={t.actions.cancel}>
        <Form layout="vertical">
          <Form.Item label={t.common.targetFloor}><Select defaultValue="Alle" options={floors.map(f => ({ value: f, label: f }))} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label={`${t.room.allRooms} - ${t.room.setpointLabel}`}><Slider min={18} max={28} step={0.5} defaultValue={22} /></Form.Item>
          <Form.Item label={`${t.room.allRooms} - ${t.room.lightCtrl}`}><Slider min={0} max={100} defaultValue={80} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
