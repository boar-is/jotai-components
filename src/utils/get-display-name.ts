import type { ElementType } from 'react'

export const getDisplayName = (
  elementType: ElementType | (NonNullable<unknown> & string),
) => {
  if (typeof elementType === 'string') {
    return elementType
  }

  return elementType.displayName ?? elementType.name
}
