function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-10 border-b border-(--border-primary) w-full">
      <div className="flex items-center gap-2 rounded-6xl">
        <span className="inline-block w-2 h-2 rounded-xs bg-(--glow-primary) rotate-45 shadow-[0_0_12px_rgba(90,220,150,0.7)]"></span>

        <h1 className="font-serif font-bold">V E S T L Y</h1>
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar
