import type { PredictPayload } from '../utils/validate'

export type PredictResponse = {
  prediction: number
  label?: string
}

export async function predictDamage(
  payload: PredictPayload,
  opts?: { signal?: AbortSignal },
): Promise<PredictResponse> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 15000)

  if (opts?.signal) {
    // If the caller aborts, ensure we abort the request too.
    if (opts.signal.aborted) controller.abort()
    else opts.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`API request failed (${res.status}). ${text}`.trim())
    }

    const data = (await res.json()) as unknown
    if (
      typeof data === 'object' &&
      data !== null &&
      'prediction' in data &&
      typeof (data as any).prediction !== 'undefined'
    ) {
      const prediction = Number((data as any).prediction)
      return {
        prediction,
        label: typeof (data as any).label === 'string' ? (data as any).label : undefined,
      }
    }

    throw new Error('Unexpected API response format.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

