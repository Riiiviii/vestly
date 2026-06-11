import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'secondary' | 'none'

type ButtonProps = {
  variant?: Variant
} & ComponentProps<'button'>

function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `transition-all duration-200 px-4 py-3 rounded-lg cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_6px_rgba(101,226,135,0.1)]`,
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
      return 'bg-(--brand-primary) text-black font-semibold px-8 py-4 text-lg rounded-xl'
    case 'secondary':
      return 'px-3 py-1.5  font-mono font-medium text-(--text-light) border border-(--border-color) bg-(--input-background) hover:border-[#2d6e45] hover:text-(--brand-primary) transition-[border-color,color] duration-200'
    case 'none':
      return ''
    default:
      throw new Error(`Invalid variant: ${variant satisfies never}`)
  }
}
