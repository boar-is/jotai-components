import type { ElementType, JSX } from 'react'
import { createJotaiComponent } from '~/components/create-jotai-component'
import { JotaiMemo } from '~/components/jotai-memo'

export type ProxyValue = {
  memo: typeof JotaiMemo
  create: typeof createJotaiComponent
} & {
  [K in keyof JSX.IntrinsicElements]: ReturnType<typeof createJotaiComponent<K>>
}

const createProxyCacheValue = (key: string) => {
  switch (key) {
    case 'memo': {
      return JotaiMemo
    }
    case 'create': {
      return createJotaiComponent
    }
    default: {
      return createJotaiComponent(key as ElementType)
    }
  }
}

export const createJotaiComponentsProxy = () => {
  const cache = new Map<string, unknown>()

  return new Proxy({} as ProxyValue, {
    get(_, key: string) {
      if (!cache.has(key)) {
        cache.set(key, createProxyCacheValue(key))
      }
      return cache.get(key)
    },
  })
}
