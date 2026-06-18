import NavLink from './navlink'
import StatusIndicator from './status-indicator'
import Logo from '#/components/ui/logo'

type NavLinks = {
  to: string
  label: string
}

const navLinks: NavLinks[] = [
  { to: '/', label: 'Analyse' },
  { to: '/about', label: 'About' },
]

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex justify-between items-center py-4 px-4 sm:px-6 md:px-10 border-b border-(--border-color) w-full bg-[rgba(11,14,12,0.75)] backdrop-blur-md">
      <Logo />
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex gap-1 md:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-3 md:px-5 py-2 md:py-2.5"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <span className="hidden sm:block h-6 w-px bg-(--border-color)"></span>
        <StatusIndicator />
      </div>
    </nav>
  )
}

export default Navbar
