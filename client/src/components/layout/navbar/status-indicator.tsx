import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { checkBackendStatus } from '#/util/health'

const statusStyles = {
  checking: { color: 'var(--text-muted)', glow: 'none', label: '' },
  live: {
    color: 'var(--brand-primary)',
    glow: '0 0 12px rgba(101,226,135,0.7)',
    label: 'LIVE',
  },
  offline: {
    color: '#f87171',
    glow: '0 0 12px rgba(248,113,113,0.7)',
    label: 'OFFLINE',
  },
} as const

function StatusIndicator() {
  const reduced = useReducedMotion()
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    checkBackendStatus().then((ok) => {
      if (active) setOnline(ok)
    })
    return () => {
      active = false
    }
  }, [])

  const state = online === null ? 'checking' : online ? 'live' : 'offline'
  const status = statusStyles[state]

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: status.color, boxShadow: status.glow }}
        animate={
          reduced || state === 'checking' ? {} : { opacity: [0.45, 1, 0.45] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {status.label && (
        <p className="hidden sm:block font-mono text-(--text-secondary) text-sm">
          {status.label}
        </p>
      )}
    </div>
  )
}

export default StatusIndicator
