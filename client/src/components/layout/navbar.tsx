import Button from '../ui/button'

function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-8 border-b border-(--border-primary) w-full">
      <Button variant="none" className="flex items-center gap-3">
        <span className="inline-block w-3 h-3 rounded-xs bg-(--glow-primary) rotate-45 shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>

        <h1 className="font-serif text-2xl font-bold">V E S T L Y</h1>
      </Button>
      <div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
