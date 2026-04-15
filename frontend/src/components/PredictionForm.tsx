import type {
  PredictFormErrors,
  PredictFormState,
} from '../utils/validate'
import { FOUNDATION_OPTIONS, MATERIAL_OPTIONS, SOIL_OPTIONS } from '../utils/labels'

type Props = {
  form: PredictFormState
  errors: PredictFormErrors
  loading: boolean
  onChange: <K extends keyof PredictFormState>(
    key: K,
    value: PredictFormState[K],
  ) => void
  onSubmit: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">{message}</p>
}

export default function PredictionForm({ form, errors, loading, onChange, onSubmit }: Props) {
  const inputClass =
    'w-full rounded-xl border px-3 py-2 shadow-sm transition focus:outline-none focus:ring-0'

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => onChange('latitude', e.target.value)}
            className={`${inputClass} ${
              errors.latitude
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 28.6139"
          />
          <FieldError message={errors.latitude} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => onChange('longitude', e.target.value)}
            className={`${inputClass} ${
              errors.longitude
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 77.2090"
          />
          <FieldError message={errors.longitude} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Vs30
          </label>
          <input
            type="number"
            step="any"
            value={form.vs30}
            onChange={(e) => onChange('vs30', e.target.value)}
            className={`${inputClass} ${
              errors.vs30
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 760"
          />
          <FieldError message={errors.vs30} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Richter Scale (Magnitude)
          </label>
          <input
            type="number"
            step="any"
            value={form.richter}
            onChange={(e) => onChange('richter', e.target.value)}
            className={`${inputClass} ${
              errors.richter
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 6.5"
          />
          <FieldError message={errors.richter} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Soil Type
          </label>
          <select
            value={form.soil_type}
            onChange={(e) => onChange('soil_type', e.target.value as any)}
            className={`${inputClass} ${
              errors.soil_type
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
          >
            {SOIL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.soil_type} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Floors
          </label>
          <input
            type="number"
            step="1"
            value={form.floors}
            onChange={(e) => onChange('floors', e.target.value)}
            className={`${inputClass} ${
              errors.floors
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 3"
          />
          <FieldError message={errors.floors} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Building Material
          </label>
          <select
            value={form.building_material}
            onChange={(e) => onChange('building_material', e.target.value as any)}
            className={`${inputClass} ${
              errors.building_material
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
          >
            {MATERIAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.building_material} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Building Age (years)
          </label>
          <input
            type="number"
            step="1"
            value={form.building_age}
            onChange={(e) => onChange('building_age', e.target.value)}
            className={`${inputClass} ${
              errors.building_age
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            }`}
            placeholder="e.g., 10"
          />
          <FieldError message={errors.building_age} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Foundation Type
          </label>
          <select
            value={form.foundation_type}
            onChange={(e) => onChange('foundation_type', e.target.value as any)}
            disabled
            className={`${inputClass} ${
              errors.foundation_type
                ? 'border-rose-400 bg-white/95 focus:border-rose-500 dark:border-rose-500 dark:bg-slate-950/50'
                : 'border-slate-200 bg-white/80 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950/40'
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {FOUNDATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.foundation_type} />
        </div>
      </div>

      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
              Predicting…
            </>
          ) : (
            'Predict'
          )}
        </button>
      </div>
    </form>
  )
}

