'use client'

import { type Atom, atom, useAtomValue } from 'jotai'
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactDOM,
  type ReactNode,
  createElement,
  forwardRef,
  isValidElement,
  useState,
} from 'react'

const isAtom = (obj: unknown) =>
  obj !== null && typeof obj === 'object' && 'read' in obj

const separate = <T>(array: Array<T>, predicate: (item: T) => boolean) =>
  array.reduce(
    (acc: [Array<T>, Array<T>], item: T) => {
      if (predicate(item)) {
        acc[0].push(item)
      } else {
        acc[1].push(item)
      }
      return acc
    },
    [[], []],
  )

const getDisplayName = (
  elementType: ElementType | (NonNullable<unknown> & string),
) => {
  if (typeof elementType === 'string') {
    return elementType
  }

  return elementType.displayName ?? elementType.name
}

type AtomicProps<
  ElementTypeT extends ElementType,
  ComponentPropsT = ComponentPropsWithoutRef<ElementTypeT>,
> = {
  [P in keyof ComponentPropsT]: ComponentPropsT[P] | Atom<ComponentPropsT[P]>
}

export const isReactNode = (node: ReactNode | unknown): node is ReactNode =>
  isValidElement(node) ||
  (Array.isArray(node) && node.every(isReactNode)) ||
  node == null ||
  typeof node !== 'object'

function componentFactory<ElementTypeT extends ElementType>(
  elementType: ElementTypeT,
) {
  const Component = forwardRef<ElementTypeT, AtomicProps<ElementTypeT>>(
    (allProps, ref) => {
      const [atomPropsEntries, propsEntries] = separate(
        Object.entries(allProps),
        (it) => isAtom(it[1]),
      )

      const props = Object.fromEntries(propsEntries)

      const [propsAtom] = useState(() =>
        atom((get) =>
          Object.fromEntries(
            atomPropsEntries.map((it) => {
              return [it[0], get(it[1])] as const
            }),
          ),
        ),
      )

      const atomProps = useAtomValue(propsAtom)

      let children: ReactNode | Array<ReactNode>
      if ('children' in props && isReactNode(props['children'])) {
        children = props['children']
        props['children'] = undefined
      } else if (
        'children' in atomProps &&
        isReactNode(atomProps['children'])
      ) {
        children = atomProps['children']
        // @ts-expect-error
        atomProps['children'] = undefined
      }

      return createElement(
        elementType,
        {
          ref,
          ...props,
          ...atomProps,
        },
        children,
      )
    },
  )
  Component.displayName = getDisplayName(elementType)

  return Component
}

type ProxyValue = {
  [P in keyof ReactDOM]: ReturnType<typeof componentFactory<P>>
} & {
  create: typeof componentFactory
}

function createJotaiComponentsProxy() {
  const cache = new Map<string, unknown>()

  return new Proxy<ProxyValue>({} as ProxyValue, {
    get(_, key: string) {
      if (key === 'create') {
        return componentFactory
      }

      if (!cache.has(key)) {
        cache.set(key, componentFactory(key as ElementType))
      }
      return cache.get(key)
    },
  })
}

export const atomic = createJotaiComponentsProxy()
