import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { atom, useSetAtom } from 'jotai'
import { StrictMode } from 'react'
import { describe, it } from 'vitest'
import { jotai } from './index'

describe('jotai.memo', () => {
  it('should increment the counter on button click', async () => {
    const user = userEvent.setup()

    const countAtom = atom(0)

    function Counter() {
      const setCount = useSetAtom(countAtom)
      return (
        <>
          <div>
            <jotai.memo>{countAtom}</jotai.memo>
          </div>
          <button type="button" onClick={() => setCount((it) => it + 1)}>
            inc
          </button>
        </>
      )
    }

    const { getByText, findByText } = render(
      <StrictMode>
        <Counter />
      </StrictMode>,
    )

    await findByText('0')
    await user.click(getByText('inc'))
    await findByText('1')
  })
})
