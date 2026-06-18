import { Link } from '@tanstack/react-router'

function Logo() {
  return (
    <Link to="/" reloadDocument className="flex items-center gap-3">
      <span className="inline-block w-2.5 h-2.5 rounded-xs bg-(--brand-primary) rotate-45 shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>

      <span className="font-serif text-[24px] font-bold">V E S T L Y</span>
    </Link>
  )
}

export default Logo
