import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { DamageMeta } from '../utils/labels'

export default function ResultCard({
  prediction,
  meta,
  imagePath,
  technicalDescription,
}: {
  prediction: number
  meta: DamageMeta
  imagePath: string | null
  technicalDescription: string
}) {
  const [imageAvailable, setImageAvailable] = useState(Boolean(imagePath))

  useEffect(() => {
    setImageAvailable(Boolean(imagePath))
  }, [imagePath])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`overflow-hidden rounded-2xl border bg-slate-900 p-6 shadow-xl ${meta.cardAccentClassName}`}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${meta.badgeClassName}`}>
            Predicted Damage Level: {meta.label}
          </div>
          <div className="text-sm text-slate-300">
            Model output class index: <span className="font-medium">{prediction}</span>
          </div>
        </div>

        {imagePath && imageAvailable ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
            <div className="overflow-hidden rounded-xl border border-slate-700">
              <img
                src={imagePath}
                alt={`${meta.label} sample damage`}
                className="h-56 w-full object-cover sm:h-72 lg:h-80"
                loading="lazy"
                onError={() => setImageAvailable(false)}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Representative post-earthquake damage sample selected from the public asset set.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 px-4 py-3 text-sm font-medium text-emerald-200">
            No visible damage image is shown for this prediction.
          </div>
        )}

        <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Technical Structural Assessment
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{technicalDescription}</p>
        </div>
      </div>
    </motion.div>
  )
}

