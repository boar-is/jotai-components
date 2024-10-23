import { useRef } from 'react'

export const useConstant = <T>(fn: () => T): T => {
  const ref = useRef<{ v: T }>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
