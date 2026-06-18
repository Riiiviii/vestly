import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { checkBackendStatus } from '#/util/health'

const statusStyles = {
  checking: {
    color: 'var(--text-muted)',
    glow: 'none',
    label: '',
    srLabel: 'Checking backend status',
  },
  live: {
    color: 'var(--brand-primary)',
    glow: '0 0 12px rgba(101,226,135,0.7)',
    label: 'LIVE',
    srLabel: 'Backend online',
  },
  offline: {
    color: '#f87171',
    glow: '0 0 12px rgba(248,113,113,0.7)',
    label: 'OFFLINE',
    srLabel: 'Backend offline',
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
    <div role="status" aria-live="polite" className="flex items-center gap-2">
      <span className="sr-only">{status.srLabel}</span>
      <motion.span
        aria-hidden="true"
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: status.color, boxShadow: status.glow }}
        animate={
          reduced || state === 'checking' ? {} : { opacity: [0.45, 1, 0.45] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {status.label && (
        <p
          aria-hidden="true"
          className="hidden sm:block font-mono text-(--text-secondary) text-sm"
        >
          {status.label}
        </p>
      )}
    </div>
  )
}

export default StatusIndicator
