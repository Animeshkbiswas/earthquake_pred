import { useMemo, useRef, useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import PredictionForm from './components/PredictionForm'
import ResultCard from './components/ResultCard'
import RiskBar from './components/RiskBar'
import LocationPicker from './components/LocationPicker'
import FailureImageCard from './components/FailureImageCard'
import { getDamageMeta } from './utils/labels'
import type { DamageMeta } from './utils/labels'
import { predictDamage } from './api/predictApi'
import type { PredictFormErrors, PredictFormState } from './utils/validate'
import { formToPayload, validatePredictForm } from './utils/validate'

function parseNullableNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

export default function App() {
  const [form, setForm] = useState<PredictFormState>({
    latitude: '22.251208604465074',
    longitude: '84.90576949858426',
    vs30: '',
    richter: '',
    soil_type: 'rock',
    floors: '',
    building_material: 'rc',
    building_age: '',
    foundation_type: 'pile',
  })

  const [errors, setErrors] = useState<PredictFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const [result, setResult] = useState<{
    prediction: number
    meta: DamageMeta
  } | null>(null)

  const activeRequestAbortRef = useRef<AbortController | null>(null)

  const latitudeNum = parseNullableNumber(form.latitude)
  const longitudeNum = parseNullableNumber(form.longitude)

  const onChange = <K extends keyof PredictFormState>(key: K, value: PredictFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    // Keep the UX snappy: clear the error for the field being edited.
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const canSend = useMemo(() => {
    // Lightweight pre-check; final validation happens in submit.
    return Boolean(
      form.latitude &&
        form.longitude &&
        form.vs30 &&
        form.richter &&
        form.floors &&
        form.building_age,
    )
  }, [form])

  const onSubmit = async () => {
    if (loading) return
    setApiError(null)

    const nextErrors = validatePredictForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (!canSend) return

    // Cancel any in-flight request so repeated clicks don't overlap.
    if (activeRequestAbortRef.current) activeRequestAbortRef.current.abort()
    const abortController = new AbortController()
    activeRequestAbortRef.current = abortController

    setLoading(true)
    try {
      const payload = formToPayload(form)
      const res = await predictDamage(payload, { signal: abortController.signal })

      const baseMeta = getDamageMeta(res.prediction)
      const label = typeof res.label === 'string' && res.label.trim() ? res.label : baseMeta.label

      setResult({
        prediction: res.prediction,
        meta: { ...baseMeta, label },
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message =
        err instanceof Error ? err.message : 'Failed to get prediction. Please try again.'
      setApiError(message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const mapLat = latitudeNum
  const mapLng = longitudeNum

  const showResultPage = Boolean(result) && !loading

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/70 bg-white/30 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/30">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
                Earthquake Damage Predictor
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Enter building and site details to instantly estimate predicted damage level.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {showResultPage ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setResult(null)
                  setApiError(null)
                }}
                className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult(null)
                  setApiError(null)
                  setErrors({})
                  setForm((prev) => ({ ...prev, vs30: '', richter: '', floors: '', building_age: '' }))
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                New prediction
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="space-y-4 lg:col-span-2">
                <ResultCard prediction={result!.prediction} meta={result!.meta} />
                <RiskBar predictionIndex={result!.prediction} />
              </section>
              <aside className="space-y-4 lg:col-span-1">
                <FailureImageCard label={result!.meta.label} />
              </aside>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/20">
                <PredictionForm
                  form={form}
                  errors={errors}
                  loading={loading}
                  onChange={onChange}
                  onSubmit={onSubmit}
                />
              </div>

              <LocationPicker
                latitude={mapLat}
                longitude={mapLng}
                onPick={(lat, lng) => {
                  onChange('latitude', lat.toString())
                  onChange('longitude', lng.toString())
                }}
              />

              <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Legend
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                      Green: No Damage
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      Yellow: Minor/Moderate
                    </span>
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
                      Red: Severe/Collapse
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4 lg:col-span-1">
              {apiError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 shadow-sm dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
                  <div className="font-semibold">Could not predict</div>
                  <div className="mt-1 whitespace-pre-wrap">{apiError}</div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/20">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Ready to predict
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Fill the form and click <span className="font-semibold">Predict</span>.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

