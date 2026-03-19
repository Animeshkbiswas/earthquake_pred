import type { DamageMeta } from '../utils/labels'
import { getDamageMeta, riskPercentFromIndex } from '../utils/labels'

export default function RiskBar({ predictionIndex }: { predictionIndex: number }) {
  const meta: DamageMeta = getDamageMeta(predictionIndex)
  const percent = riskPercentFromIndex(predictionIndex)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Risk Indicator
        </span>
        <span className="text-sm text-slate-600 dark:text-slate-300">{percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${meta.barClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-300">
        {meta.label}
      </div>
    </div>
  )
}

