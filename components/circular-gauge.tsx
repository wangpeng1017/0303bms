'use client'

import React from 'react'

interface CircularGaugeProps {
    title: string
    value: string | number
    unit: string
    color: string
    max?: number
}

export function CircularGauge({ title, value, unit, color, max = 100 }: CircularGaugeProps) {
    const parsedValue = typeof value === 'string' ? parseFloat(value) : value
    let percentage = 0
    if (!isNaN(parsedValue) && max > 0) {
        percentage = Math.min((parsedValue / max) * 100, 100)
    }
    if (title === 'Active Alarms') {
        // Treat as full ring if it is an alarm count component
        percentage = 100
    }

    const radius = 46
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = percentage === 100 && title !== 'Active Alarms' ? 0 : circumference - (percentage / 100) * circumference

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
            background: '#1e293b', borderRadius: 8, padding: '16px 12px', height: '100%',
            border: '1px solid #334155'
        }}>
            <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 500 }}>{title}</div>
            <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: title === 'Active Alarms' ? 'rotate(-90deg)' : 'rotate(135deg)' }}>
                    {/* Background Ring */}
                    <circle cx="55" cy="55" r={radius} fill="transparent" stroke="#0f172a" strokeWidth="8"
                        strokeDasharray={title === 'Active Alarms' ? 'none' : `${circumference * 0.75} ${circumference}`}
                        strokeLinecap="round" />
                    {/* Progress Ring */}
                    {title === 'Active Alarms' ? (
                        <circle
                            cx="55" cy="55" r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="8"
                            strokeDasharray={`${circumference * 0.2} ${circumference}`}
                            strokeLinecap="round"
                        />
                    ) : (
                        <circle
                            cx="55" cy="55" r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset * 0.75 + circumference * 0.25}
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        />
                    )}
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>{value}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{unit}</span>
                </div>
            </div>
        </div>
    )
}
