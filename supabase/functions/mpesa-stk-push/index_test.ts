import { assert } from 'https://deno.land/std@0.224.0/assert/assert.ts'
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/assert_equals.ts'

import {
  formatPhoneNumber,
  getEnvironmentOrder,
  isAccessTokenError,
  isValidKenyanPhoneNumber,
} from './index.ts'

Deno.test('formats Kenyan phone numbers including 01 prefixes', () => {
  assertEquals(formatPhoneNumber('0112345678'), '254112345678')
  assertEquals(formatPhoneNumber('0712345678'), '254712345678')
  assertEquals(formatPhoneNumber('+254712345678'), '254712345678')
})

Deno.test('validates Kenyan mobile numbers for 01 and 07 prefixes', () => {
  assert(isValidKenyanPhoneNumber('254112345678'))
  assert(isValidKenyanPhoneNumber('254712345678'))
  assertEquals(isValidKenyanPhoneNumber('254212345678'), false)
})

Deno.test('falls back to the likely environment when MPESA_ENV is missing', () => {
  assertEquals(getEnvironmentOrder(undefined, '4167473'), ['production', 'sandbox'])
  assertEquals(getEnvironmentOrder(undefined, '174379'), ['sandbox', 'production'])
  assertEquals(getEnvironmentOrder('production', '174379'), ['production'])
})

Deno.test('detects invalid access token responses that should trigger a retry', () => {
  assert(
    isAccessTokenError(400, 'Invalid Access Token', {
      errorCode: '404.001.03',
      errorMessage: 'Invalid Access Token',
    })
  )

  assertEquals(
    isAccessTokenError(400, 'Bad Request', {
      errorCode: '400.002.02',
      errorMessage: 'Bad Request',
    }),
    false
  )
})