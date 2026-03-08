import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { AntdProvider } from "@/components/antd-provider";
import { Sidebar } from "@/components/sidebar";
import { LanguageSelector } from "@/components/language-selector";

export const metadata: Metadata = {
  title: "MSR BMS - Building Management System",
  description: "Building Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased" style={{ background: '#0f172a', color: '#f8fafc' }}>
        <I18nProvider>
          <AntdProvider>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              <Sidebar />
              <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>
                <header style={{
                  position: 'sticky', top: 0, zIndex: 40,
                  background: '#1e293b', borderBottom: '1px solid #334155',
                  padding: '12px 24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>MSR BMS</h1>
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Building Automation Management System</p>
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
