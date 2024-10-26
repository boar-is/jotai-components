import { type Atom, atom, useAtomValue } from 'jotai/index'
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  createElement,
  forwardRef,
} from 'react'
import { getDisplayName } from '~/utils/get-display-name'
import { separate } from '~/utils/separate'
import { useConstant } from '~/utils/use-constant'

type JotaiProps<E extends ElementType, P = ComponentPropsWithoutRef<E>> = {
  [K in keyof P]: P[K]
} & {
  [K in keyof P as `$${K & string}`]: Atom<P[K]>
}

export const createJotaiComponent = <E extends ElementType>(elementType: E) => {
  const JotaiComponent = forwardRef<ElementRef<E>, JotaiProps<E>>(
    (props, ref) => {
      const [atomPropsEntries, basicPropsEntries] = separate(
        Object.entries(props),
        (it) => it[0].startsWith('$'),
      )

      const propsAtom = useConstant(() =>
        atom((get) =>
          Object.fromEntries(
            atomPropsEntries.map((it) => [it[0].replace('$', ''), get(it[1])]),
          ),
        ),
      )

      const atomProps = useAtomValue(propsAtom)
      const { children, ...basicProps } = Object.fromEntries(basicPropsEntries)

      return createElement(
        elementType,
        {
          ref,
          ...basicProps,
          ...atomProps,
        },
        children,
      )
    },
  )

  JotaiComponent.displayName = getDisplayName(elementType)

  return JotaiComponent
}
