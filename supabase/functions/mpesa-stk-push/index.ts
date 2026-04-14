const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

type MpesaEnvironment = 'production' | 'sandbox'
type JsonRecord = Record<string, unknown>

type AccessTokenResult = {
  accessToken: string
  body: JsonRecord | null
  bodyText: string
  ok: boolean
  status: number
}

type StkPushResult = {
  body: JsonRecord | null
  bodyText: string
  ok: boolean
  status: number
}

export const formatPhoneNumber = (phone: string) => {
  let formattedPhone = phone.trim().replace(/[^\d+]/g, '').replace(/^\+/, '')

  if (formattedPhone.startsWith('0')) {
    formattedPhone = `254${formattedPhone.slice(1)}`
  }

  if (!formattedPhone.startsWith('254')) {
    formattedPhone = `254${formattedPhone}`
  }

  return formattedPhone
}

export const isValidKenyanPhoneNumber = (phone: string) => /^254(1|7)\d{8}$/.test(phone)

const parseJson = (value: string): JsonRecord | null => {
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? (parsed as JsonRecord) : null
  } catch {
    return null
  }
}

const getBaseUrl = (environment: MpesaEnvironment) =>
  environment === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

export const getEnvironmentOrder = (
  configuredEnvironment: string | undefined,
  shortCode: string
): MpesaEnvironment[] => {
  const normalizedEnvironment = (configuredEnvironment ?? '').trim().toLowerCase()

  if (normalizedEnvironment === 'production') {
    return ['production']
  }

  if (normalizedEnvironment === 'sandbox') {
    return ['sandbox']
  }

  return shortCode === '174379' ? ['sandbox', 'production'] : ['production', 'sandbox']
}

const getErrorMessage = (body: JsonRecord | null, bodyText: string, fallback: string) => {
  const candidates = [
    typeof body?.errorMessage === 'string' ? body.errorMessage : '',
    typeof body?.ResponseDescription === 'string' ? body.ResponseDescription : '',
    typeof body?.CustomerMessage === 'string' ? body.CustomerMessage : '',
    typeof body?.error === 'string' ? body.error : '',
    bodyText,
  ]

  return candidates.find((candidate) => candidate.trim().length > 0) ?? fallback
}

export const isAccessTokenError = (
  status: number,
  bodyText: string,
  body: JsonRecord | null
) => {
  if (status === 401 || status === 403) {
    return true
  }

  const errorCode = typeof body?.errorCode === 'string' ? body.errorCode : ''
  const errorMessage = typeof body?.errorMessage === 'string' ? body.errorMessage : ''
  const responseDescription =
    typeof body?.ResponseDescription === 'string' ? body.ResponseDescription : ''

  return (
    errorCode === '404.001.03' ||
    /invalid access token/i.test(bodyText) ||
    /invalid access token/i.test(errorMessage) ||
    /invalid access token/i.test(responseDescription)
  )
}

const requestAccessToken = async (
  baseUrl: string,
  consumerKey: string,
  consumerSecret: string
): Promise<AccessTokenResult> => {
  const authString = btoa(`${consumerKey}:${consumerSecret}`)
  const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${authString}` },
  })

  const bodyText = await tokenRes.text()
  const body = parseJson(bodyText)

  return {
    accessToken: typeof body?.access_token === 'string' ? body.access_token : '',
    body,
    bodyText,
    ok: tokenRes.ok,
    status: tokenRes.status,
  }
}

const requestStkPush = async (
  baseUrl: string,
  accessToken: string,
  stkPayload: Record<string, string | number>
): Promise<StkPushResult> => {
  const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stkPayload),
  })

  const bodyText = await stkRes.text()

  return {
    body: parseJson(bodyText),
    bodyText,
    ok: stkRes.ok,
    status: stkRes.status,
  }
}

export const handler = async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body: JsonRecord

    try {
      const parsedBody = await req.json()
      body = parsedBody && typeof parsedBody === 'object' ? (parsedBody as JsonRecord) : {}
    } catch {
      return jsonResponse({ error: 'Request body must be valid JSON' }, 400)
    }

    const phone = typeof body?.phone === 'string' ? body.phone : ''
    const amount = Number(body?.amount)
    const accountReference = typeof body?.accountReference === 'string' ? body.accountReference : ''

    if (!phone || !Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ error: 'Phone and a valid amount are required' }, 400)
    }

    const formattedPhone = formatPhoneNumber(phone)

    if (!isValidKenyanPhoneNumber(formattedPhone)) {
      return jsonResponse(
        {
          error: 'Use a valid Kenyan mobile number in the format 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX',
        },
        400
      )
    }

    const consumerKey = (Deno.env.get('MPESA_CONSUMER_KEY') ?? '').trim()
    const consumerSecret = (Deno.env.get('MPESA_CONSUMER_SECRET') ?? '').trim()
    const passkey = (Deno.env.get('MPESA_PASSKEY') ?? '').trim()
    const shortCode = (Deno.env.get('MPESA_SHORTCODE') ?? '').trim()
    const callbackBaseUrl = (Deno.env.get('SUPABASE_URL') ?? '').trim()

    if (!consumerKey || !consumerSecret || !passkey || !shortCode || !callbackBaseUrl) {
      console.error('Missing M-Pesa credentials:', {
        hasKey: !!consumerKey,
        hasSecret: !!consumerSecret,
        hasPasskey: !!passkey,
        hasShortCode: !!shortCode,
        hasCallbackBaseUrl: !!callbackBaseUrl,
      })
      return jsonResponse({ error: 'M-Pesa credentials not configured' }, 500)
    }

    console.log(`Using shortcode: ${shortCode}`)
    const environments = getEnvironmentOrder(Deno.env.get('MPESA_ENV') ?? undefined, shortCode)
    const callbackUrl = `${callbackBaseUrl}/functions/v1/mpesa-callback`

    console.log(`Trying M-Pesa environments in order: ${environments.join(' -> ')}`)

    let lastError: { body: unknown; status: number } | null = null

    for (const environment of environments) {
      const baseUrl = getBaseUrl(environment)

      console.log(`Requesting OAuth token from ${environment} environment...`)
      const tokenResult = await requestAccessToken(baseUrl, consumerKey, consumerSecret)
      console.log('Token response status:', tokenResult.status)

      if (!tokenResult.ok || !tokenResult.accessToken) {
        console.error('Token response body:', tokenResult.bodyText)

        lastError = {
          body: {
            error: getErrorMessage(
              tokenResult.body,
              tokenResult.bodyText,
              'Failed to authenticate with M-Pesa'
            ),
            details: tokenResult.body ?? tokenResult.bodyText,
            environment,
          },
          status: 500,
        }

        if (environment !== environments[environments.length - 1]) {
          console.warn(`Token request failed in ${environment}; trying alternate environment.`)
          continue
        }

        return jsonResponse(lastError.body, lastError.status)
      }

      console.log('Got access token successfully')

      const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
      const password = btoa(`${shortCode}${passkey}${timestamp}`)

      const stkPayload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference || 'KCCA',
        TransactionDesc: 'Chess Event Registration',
      }

      console.log(
        'Sending STK push with payload:',
        JSON.stringify({ ...stkPayload, Password: '[redacted]' })
      )

      const stkResult = await requestStkPush(baseUrl, tokenResult.accessToken, stkPayload)
      console.log('STK response status:', stkResult.status)
      console.log('STK Push response:', stkResult.bodyText)

      if (
        stkResult.body &&
        typeof stkResult.body.ResponseCode === 'string' &&
        stkResult.body.ResponseCode === '0'
      ) {
        return jsonResponse({
          success: true,
          checkoutRequestID:
            typeof stkResult.body.CheckoutRequestID === 'string'
              ? stkResult.body.CheckoutRequestID
              : undefined,
          merchantRequestID:
            typeof stkResult.body.MerchantRequestID === 'string'
              ? stkResult.body.MerchantRequestID
              : undefined,
          message:
            typeof stkResult.body.CustomerMessage === 'string'
              ? stkResult.body.CustomerMessage
              : 'STK Push sent successfully',
        })
      }

      const failureBody = {
        success: false,
        error: getErrorMessage(stkResult.body, stkResult.bodyText, 'STK Push failed'),
        details: stkResult.body ?? stkResult.bodyText,
        environment,
      }

      if (
        environment !== environments[environments.length - 1] &&
        isAccessTokenError(stkResult.status, stkResult.bodyText, stkResult.body)
      ) {
        console.warn(
          `STK push returned an access token error in ${environment}; trying alternate environment.`
        )
        lastError = { body: failureBody, status: 400 }
        continue
      }

      return jsonResponse(failureBody, stkResult.ok ? 400 : stkResult.status)
    }

    return jsonResponse(lastError?.body ?? { error: 'Unknown M-Pesa error' }, lastError?.status ?? 500)
  } catch (error) {
    console.error('M-Pesa error:', error)
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unknown M-Pesa error' },
      500
    )
  }
}

if (import.meta.main) {
  Deno.serve(handler)
}
