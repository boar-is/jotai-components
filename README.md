# jotai-components 👻⚛

`jotai-components` allows you to pass [Jotai](https://jotai.org/) atoms as props directly to React components, making your UI reactive without extra boilerplate:

```tsx
const styleAtom = atom({ width: 100 })

// ✅ This component will not re-render
function Parent() {
  // ✅ `jotai.div` will re-render whenever styleAtom's value changes
  return <jotai.div $style={styleAtom}>example</jotai.div>
}
```

## Installation
```bash
npm i jotai-components
```

```bash
yarn add jotai-components 
```

```bash
pnpm add jotai-components
```

## The Problem
Sometimes, you need to use an atom's value within a component,
but this leads to re-renders every time the atom’s value changes:

```tsx
import { atom, useAtomValue } from 'jotai'

const styleAtom = atom({ width: 100 })

// ❌ This component re-renders every time the atom's value changes
function Parent() {
  const style = useAtomValue(styleAtom)
  
  return <div style={style}>example</div>
}
```

To prevent unnecessary re-renders in the parent component, you would normally move the atom logic to a child component:

```tsx
import { type Atom, atom, useAtomValue } from 'jotai'
import {
  type CSSProperties,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
} from 'react'

const styleAtom = atom({ width: 100 })

// ✅ This component will not re-render
function Parent() {
  return <Child styleAtom={styleAtom}>example</Child>
}

// 😕 Based on requirements, this can quickly become cumbersome (imports are also inflated)
const Child = forwardRef<
  HTMLDivElement,
  Omit<HTMLAttributes<HTMLDivElement>, 'style'> & {
  styleAtom: Atom<CSSProperties>
}
>(function Child(props, ref) {
  return <div {...props} ref={ref} />
})
```

While this pattern prevents unnecessary re-renders, it can become cumbersome as the number of atoms grows,
and it increases the complexity of the component hierarchy.


## The Solution

With jotai-components, you can pass atoms directly as props to components,
without needing to create separate child components for each atom:

```tsx
import { atom } from 'jotai'
import { jotai } from 'jotai-components'

const styleAtom = atom({ width: 100 })

// 🤩 Parent does not re-render, and atoms can be passed directly as props
function Parent() {
  return (
    <jotai.div className="ordinary-props-as-well" $style={styleAtom}>
      example
    </jotai.div>
  )
}
```

This solution simplifies the code by removing the need for `useAtomValue` and separate child components.

## API

### `jotai.<tag>`

Use `jotai.<tag>` to create components (e.g., `jotai.span`, `jotai.button`, etc.)
that accept props either as regular values or as atoms (see the example above).

### `jotai.memo`

Use `jotai.memo` to render dynamic content from atoms.
It accepts atoms as children that resolve to values conforming to the ReactNode type:

```tsx
import { atom } from 'jotai'
import { jotai } from 'jotai-components'

const worldAtom = atom('World')

function Parent() {
  return (
    <div>
      {/* Hello, World! */}
      Hello, <jotai.memo>{worldAtom}</jotai.memo>!
    </div>
  )
}
```

### `jotai.create`

You can create reactive components around custom React components:

```tsx
import { atom } from 'jotai'
import { jotai } from 'jotai-components'
import { motion } from 'framer-motion'
import { Button } from 'react-aria-components'

const JotaiMotionButton = jotai.create(motion.create(Button))

const motionStyleAtom = atom({ width: 100 })

function Parent() {
  return (
    <JotaiMotionButton transition={{ duration: 1 }} $animate={motionStyleAtom}>
      example
    </JotaiMotionButton>
  )
}
```

> [!CAUTION]  
> Avoid using `jotai.create` inside render loops, as this will create a new component on every render.
> Instead, move the `jotai.create` call outside the component or use techniques to ensure a stable reference.

> [!WARNING]  
> While this example uses [Framer Motion](https://www.framer.com/motion/) with atoms to update the `animate` prop,
> which can trigger re-renders, it may not be suitable for continuous animation values.
> In those cases, consider using [MotionValues](https://www.framer.com/motion/motionvalue/).

## License

MIT
