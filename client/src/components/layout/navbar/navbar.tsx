import Button from '../../ui/button'
import NavLink from './navlink'

type NavLinks = {
  href: string
  label: string
}

const navLinks: NavLinks[] = [
  { href: '/', label: 'Analyze' },
  { href: '/about', label: 'About' },
]

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-8 border-b border-(--border-color) w-full">
      <Button variant="none" className="flex items-center gap-3">
        <span className="inline-block w-3 h-3 rounded-xs bg-(--brand-primary) rotate-45 shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>

        <h1 className="font-serif text-2xl font-bold">V E S T L Y</h1>
      </Button>
      <div className="flex items-center">
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.href} to={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
