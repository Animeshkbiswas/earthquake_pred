import { motion } from 'framer-motion'
import type { DamageMeta } from '../utils/labels'

export default function ResultCard({
  prediction,
  meta,
}: {
  prediction: number
  meta: DamageMeta
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-slate-900/40 ${meta.cardAccentClassName}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${meta.badgeClassName}`}>
            Predicted Damage Level: {meta.label}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Model output class index: <span className="font-medium">{prediction}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

