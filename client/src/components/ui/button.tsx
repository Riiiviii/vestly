import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'none' | 'navbar'
type Active = true | false

type ButtonProps = {
  variant?: Variant
  active?: boolean
} & ComponentProps<'button'>

function Button({
  variant = 'primary',
  active = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `transition-colors px-4 py-3 rounded-lg cursor-pointer`,
        getVariantStyles(variant, active),
        className,
      )}
    />
  )
}

export default Button

function getVariantStyles(variant: Variant, active: Active) {
  if (variant === 'navbar') return getNavbarStyles(active)

  switch (variant) {
    case 'primary':
      return ''
    case 'none':
      return ''
    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`)
  }
}

function getNavbarStyles(active: Active) {
  switch (active) {
    case true:
      return 'text-(--brand-primary) bg-(--brand-secondary) cursor-default disabled:cursor-not-allowed'
    case false:
      return 'text-zinc-300 hover:text-white hover:bg-[#141a16]'
    default:
      throw new Error(`Invalid variant: ${active satisfies never}`)
  }
}
