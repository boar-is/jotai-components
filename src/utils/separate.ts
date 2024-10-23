export const separate = <T>(array: Array<T>, predicate: (item: T) => boolean) =>
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
