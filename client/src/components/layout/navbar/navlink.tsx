import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

type NavLinkProps = ComponentProps<typeof Link>

function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      className={twMerge('transition-colors px-4 py-3 rounded-lg cursor-pointer', className)}
      activeProps={{ className: 'text-(--brand-primary) bg-(--brand-secondary) cursor-default' }}
      inactiveProps={{ className: 'text-zinc-300 hover:text-white hover:bg-[#141a16]' }}
    />
  )
}

export default NavLink
