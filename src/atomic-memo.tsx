import { type Atom, useAtomValue } from 'jotai'
import type { ReactNode } from 'react'

export const AtomicMemo = function AtomicMemo({
  children,
}: { children: Atom<ReactNode> }) {
  return useAtomValue(children)
}
