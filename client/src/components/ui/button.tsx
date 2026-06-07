import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'none'

type ButtonProps = {
  variant?: Variant
} & ComponentProps<'button'>

function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `transition-colors px-4 py-3 rounded-lg cursor-pointer`,
        getVariantStyles(variant),
        className,
      )}
    />
  )
}

export default Button

function getVariantStyles(variant: Variant) {
  switch (variant) {
    case 'primary':
      return ''
    case 'none':
      return ''
    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`)
  }
}
