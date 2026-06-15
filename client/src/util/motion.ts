export const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

export const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}
