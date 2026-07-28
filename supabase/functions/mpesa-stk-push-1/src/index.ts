const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const phone = typeof body?.phone === 'string' ? body.phone : ''
    const amount = Number(body?.amount)
    const accountReference = typeof body?.accountReference === 'string' ? body.accountReference : ''

    if (!phone || !Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ error: 'Phone and a valid amount are required' }, 400)
    }

    let formattedPhone = phone.replace(/\s+/g, '').replace(/^0/, '254').replace(/^\+/, '')
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = `254${formattedPhone}`
    }

    const environment =
      (Deno.env.get('MPESA_ENV') ?? 'sandbox').trim().toLowerCase() === 'production'
        ? 'production'
        : 'sandbox'
    const baseUrl =
      environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke'

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

    console.log(`Using M-Pesa environment: ${environment}`)
    console.log(`Using shortcode: ${shortCode}`)

    if (environment === 'sandbox' && shortCode !== '174379') {
      return jsonResponse(
        {
          success: false,
          error:
            'Sandbox STK push is using a non-sandbox shortcode. Update MPESA_SHORTCODE to 174379 and MPESA_PASSKEY to the standard sandbox passkey, or switch MPESA_ENV to production for live credentials.',
        },
        400
      )
    }

    const authString = btoa(`${consumerKey}:${consumerSecret}`)
    console.log('Requesting OAuth token...')

    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${authString}` },
    })

    const tokenText = await tokenRes.text()
    console.log('Token response status:', tokenRes.status)

    if (!tokenRes.ok) {
      console.error('Token response body:', tokenText)
      return jsonResponse({ error: 'Failed to authenticate with M-Pesa', details: tokenText }, 500)
    }

    let tokenData: { access_token?: string; expires_in?: string }
    try {
      tokenData = JSON.parse(tokenText)
    } catch {
      console.error('Invalid token response body:', tokenText)
      return jsonResponse({ error: 'Invalid response from M-Pesa auth' }, 500)
    }

    const accessToken = tokenData.access_token
    if (!accessToken) {
      console.error('No access token returned from OAuth:', tokenData)
      return jsonResponse({ error: 'Failed to get M-Pesa access token', details: tokenData }, 500)
    }

    console.log('Got access token successfully')

    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
    const password = btoa(`${shortCode}${passkey}${timestamp}`)
    const callbackUrl = `${callbackBaseUrl}/functions/v1/mpesa-callback`

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

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    })

    const stkText = await stkRes.text()
    console.log('STK response status:', stkRes.status)
    console.log('STK Push response:', stkText)

    let stkData: Record<string, string>
    try {
      stkData = JSON.parse(stkText)
    } catch {
      return jsonResponse({ success: false, error: 'Invalid STK response from M-Pesa', details: stkText }, 500)
    }

    if (stkData.ResponseCode === '0') {
      return jsonResponse({
        success: true,
        checkoutRequestID: stkData.CheckoutRequestID,
        merchantRequestID: stkData.MerchantRequestID,
        message: stkData.CustomerMessage,
      })
    }

    return jsonResponse(
      {
        success: false,
        error: stkData.errorMessage || stkData.ResponseDescription || 'STK Push failed',
        details: stkData,
      },
      400
    )
  } catch (error) {
    console.error('M-Pesa error:', error)
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unknown M-Pesa error' },
      500
    )
  }
})