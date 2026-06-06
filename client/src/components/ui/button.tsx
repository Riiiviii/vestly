import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'secondary' | 'ghost-destructive' | 'none'

type ButtonProps = {
  variant?: Variant
} & ComponentProps<'button'>

function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `transition-colors px-2 py-1 `,
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
      return 'bg-violet-600 hover:bg-violet-500'
    case 'secondary':
      return
    case 'ghost-destructive':
      return
    case 'none':
      return
    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`)
  }
}
