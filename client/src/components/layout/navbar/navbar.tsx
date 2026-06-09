import { Link } from '@tanstack/react-router'
import NavLink from './navlink'

type NavLinks = {
  to: string
  label: string
}

const navLinks: NavLinks[] = [
  { to: '/', label: 'Analyze' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-10 border-b border-(--border-color) w-full">
      <Link to="/" className="flex items-center gap-3">
        <span className="inline-block w-2.5 h-2.5 rounded-xs bg-(--brand-primary) rotate-45 shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>

        <h1 className="font-serif text-[24px] font-bold">V E S T L Y</h1>
      </Link>
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
          <span className="inline-block w-2 h-2 rounded-lg bg-(--brand-primary)  shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>
          <p className="font-mono text-(--text-secondary) text-sm">LIVE</p>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
