const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(body))

    // Safaricom sends the result in Body.stkCallback
    const callback = body?.Body?.stkCallback
    if (callback) {
      const resultCode = callback.ResultCode
      const resultDesc = callback.ResultDesc
      const checkoutRequestID = callback.CheckoutRequestID

      if (resultCode === 0) {
        // Payment successful
        const items = callback.CallbackMetadata?.Item || []
        const receipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value
        const amount = items.find((i: any) => i.Name === 'Amount')?.Value
        const phone = items.find((i: any) => i.Name === 'PhoneNumber')?.Value

        console.log(`Payment successful: Receipt=${receipt}, Amount=${amount}, Phone=${phone}, CheckoutID=${checkoutRequestID}`)
      } else {
        console.log(`Payment failed: ${resultDesc}, CheckoutID=${checkoutRequestID}`)
      }
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Callback error:', error)
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
