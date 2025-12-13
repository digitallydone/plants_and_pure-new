const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function initializePayment({ email, amount, reference, callbackUrl, metadata }) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  })

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || "Failed to initialize payment")
  }

  return data.data
}

export async function verifyPayment(reference) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await response.json()

  if (!data.status) {
    throw new Error(data.message || "Failed to verify payment")
  }

  return data.data
}
