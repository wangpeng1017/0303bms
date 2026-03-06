'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/components/i18n-provider'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined, DatabaseOutlined, FireOutlined, CloudOutlined,
  ExperimentOutlined, BulbOutlined, BlockOutlined, CalendarOutlined,
  AlertOutlined, ThunderboltOutlined, HomeOutlined, LineChartOutlined,
  ApiOutlined, TeamOutlined, LaptopOutlined, SettingOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Sider } = Layout

const iconMap: Record<string, React.ReactNode> = {
  '/': <DashboardOutlined />,
  '/data-acquisition': <DatabaseOutlined />,
  '/heating': <FireOutlined />,
  '/ventilation': <CloudOutlined />,
  '/cooling': <ExperimentOutlined />,
  '/lighting': <BulbOutlined />,
  '/shading': <BlockOutlined />,
  '/schedules': <CalendarOutlined />,
  '/alarms': <AlertOutlined />,
  '/energy': <ThunderboltOutlined />,
  '/rooms': <HomeOutlined />,
  '/trends': <LineChartOutlined />,
  '/interfaces': <ApiOutlined />,
  '/users': <TeamOutlined />,
  '/remote': <LaptopOutlined />,
  '/settings': <SettingOutlined />,
}

const navKeys = [
  'dashboard', 'dataAcquisition', 'heating', 'ventilation', 'cooling',
  'lighting', 'shading', 'schedules', 'alarms', 'energy', 'rooms',
  'trends', 'interfaces', 'users', 'remote', 'settings'
]

const navPaths = [
  '/', '/data-acquisition', '/heating', '/ventilation', '/cooling',
  '/lighting', '/shading', '/schedules', '/alarms', '/energy', '/rooms',
  '/trends', '/interfaces', '/users', '/remote', '/settings'
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()

  const menuItems: MenuProps['items'] = navPaths.map((path, i) => ({
    key: path,
    icon: iconMap[path],
    label: t.nav[navKeys[i] as keyof typeof t.nav],
  }))

  return (
    <Sider
      width={240}
      theme="light"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: '#1677ff', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ThunderboltOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1f1f1f' }}>MSR BMS</div>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>Building Management</div>
          </div>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ borderRight: 'none', paddingTop: 8 }}
      />
      <div style={{
        position: 'absolute', bottom: 0, width: '100%',
        padding: '12px 0', textAlign: 'center',
        borderTop: '1px solid #f0f0f0', fontSize: 11, color: '#8c8c8c',
      }}>
        v1.0.0
      </div>
    </Sider>
  )
}
