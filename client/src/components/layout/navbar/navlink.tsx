import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

type NavLinkProps = ComponentProps<typeof Link>

function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      className={twMerge(
        'transition-colors px-5 py-2.5 rounded-lg cursor-pointer font-semibold',
        className,
      )}
      activeProps={{
        className:
          'text-(--brand-primary) bg-(--brand-secondary) cursor-default',
      }}
      inactiveProps={{
        className: 'text-(--text-muted) hover:text-white hover:bg-[#141a16]',
      }}
    />
  )
}

export default NavLink
