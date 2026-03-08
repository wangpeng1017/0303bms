'use client'

import { ConfigProvider, App, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ReactNode } from 'react'

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#52c41a', // Screenshot emphasizes greenish online dots and blue active states, we use a distinct tech green as primary
          colorBgBase: '#0f172a',
          colorBgContainer: '#1e293b',
          colorBgElevated: '#1e293b',
          colorBorderSecondary: '#334155',
          borderRadius: 8,
        },
        components: {
          Card: {
            colorBgContainer: '#1e293b',
            colorBorderSecondary: '#334155',
          },
          Table: {
            colorBgContainer: '#1e293b',
            colorBorderSecondary: '#334155',
            headerBg: '#0f172a',
          }
        }
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}
