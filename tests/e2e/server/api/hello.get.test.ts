import { describe, expect, it } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Hello world API tests', async () => {
  await setup({
    server: true,
  })

  it('returns correct string', async () => {
    const res = await $fetch('/api/hello')

    expect(res).toBe('Hello world!')
  })
})
