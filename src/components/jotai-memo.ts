import { type Atom, useAtomValue } from 'jotai/index'
import { type ReactNode, memo } from 'react'

export const JotaiMemo = memo(function JotaiMemo({
  children,
}: { children: Atom<ReactNode> }) {
  return useAtomValue(children)
})
