'use client'
import React from 'react'

export function HvacFloorplan() {
    return (
        <div style={{
            display: 'flex', background: '#1e293b', borderRadius: 8, padding: 20,
            border: '1px solid #334155', minHeight: 340, gap: 24, flex: 1
        }}>
            {/* Legend Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 160 }}>
                {['AHU', 'Damper', 'Boiler/Heat Pump', 'Pump', 'Zone Sensor'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                        <div style={{ width: 14, height: 14, border: '1px solid #64748b', borderRadius: 2 }} />
                        {item}
                    </div>
                ))}
                <div style={{ height: 1, background: '#334155', margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#334155' }} /> Online/Offline
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9' }} /> Auto/Manual
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#84cc16' }} /> Override
                </div>
            </div>

            {/* Floorplan Mock Illustration Area */}
            <div style={{ flex: 1, position: 'relative', border: '1px solid #334155', borderRadius: 8, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', border: '2px solid #475569', borderRadius: 4 }}>
                    {/* Mock Rooms */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '50%', borderRight: '2px solid #475569', borderBottom: '2px solid #475569' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', borderLeft: '2px solid #475569' }} />

                    {/* Mock Overlay Dots */}
                    <div title="Critical Alarm" style={{ position: 'absolute', top: '20%', left: '20%', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                    <div title="Override Active" style={{ position: 'absolute', top: '40%', left: '60%', width: 12, height: 12, borderRadius: '50%', background: '#84cc16', boxShadow: '0 0 8px #84cc16' }} />
                    <div title="Auto Mode" style={{ position: 'absolute', bottom: '30%', right: '20%', width: 12, height: 12, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 10, color: '#475569', fontSize: 12, fontWeight: 600, letterSpacing: 2 }}>HVAC SYSTEM MAP</div>
            </div>
        </div>
    )
}
