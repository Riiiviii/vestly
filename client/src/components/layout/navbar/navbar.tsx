import NavLink from './navlink'
import Logo from '#/components/ui/logo'
import { motion, useReducedMotion } from 'motion/react'

type NavLinks = {
  to: string
  label: string
}

const navLinks: NavLinks[] = [
  { to: '/', label: 'Analyse' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  const reduced = useReducedMotion()

  return (
    <nav className="fixed top-0 z-50 flex justify-between items-center py-4 px-10 border-b border-(--border-color) w-full bg-[rgba(11,14,12,0.75)] backdrop-blur-md">
      <Logo />
      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <span className="h-6 w-px bg-(--border-color)"></span>
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-block w-2 h-2 rounded-lg bg-(--brand-primary) shadow-[0_0_12px_rgba(90,220,150,0.7)]"
            animate={reduced ? {} : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="font-mono text-(--text-secondary) text-sm">LIVE</p>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
