import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { AntdProvider } from "@/components/antd-provider";
import { Sidebar } from "@/components/sidebar";
import { LanguageSelector } from "@/components/language-selector";

export const metadata: Metadata = {
  title: "MSR BMS - Building Management System",
  description: "Building Management System Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased" style={{ background: '#f5f5f5' }}>
        <I18nProvider>
          <AntdProvider>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              <Sidebar />
              <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header style={{
                  position: 'sticky', top: 0, zIndex: 40,
                  background: '#fff', borderBottom: '1px solid #f0f0f0',
                  padding: '12px 24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1f1f1f' }}>MSR BMS Demo</h1>
                      <p style={{ margin: 0, fontSize: 12, color: '#8c8c8c' }}>Building Automation Management System</p>
                    </div>
                    <LanguageSelector />
                  </div>
                </header>
                <main style={{ flex: 1, padding: 24 }}>
                  {children}
                </main>
              </div>
            </div>
          </AntdProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
