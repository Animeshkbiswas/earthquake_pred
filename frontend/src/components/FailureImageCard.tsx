type FailureAsset = {
  title: string
  subtitle: string
  src: string | null
}

const PUBLIC_FAILURE_IMAGES = {
  minor: '/images (1).jpg',
  moderate: '/slab damage.jpg',
  severe: '/shear_beam.jpg',
  collapse: '/high damage.jpg',
} as const

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase()
}

function assetForLabel(label: string): FailureAsset {
  const v = normalizeLabel(label)

  if (v.includes('collapse')) {
    return {
      title: 'Failure Mode (Illustration)',
      subtitle: 'Collapse Risk',
      src: PUBLIC_FAILURE_IMAGES.collapse,
    }
  }
  if (v.includes('severe')) {
    return {
      title: 'Failure Mode (Illustration)',
      subtitle: 'Severe',
      src: PUBLIC_FAILURE_IMAGES.severe,
    }
  }
  if (v.includes('moderate')) {
    return {
      title: 'Failure Mode (Illustration)',
      subtitle: 'Moderate',
      src: PUBLIC_FAILURE_IMAGES.moderate,
    }
  }
  if (v.includes('minor')) {
    return {
      title: 'Failure Mode (Illustration)',
      subtitle: 'Minor',
      src: PUBLIC_FAILURE_IMAGES.minor,
    }
  }
  return {
    title: 'Failure Mode (Illustration)',
    subtitle: 'No Damage',
    src: null,
  }
}

export default function FailureImageCard({ label }: { label: string }) {
  const asset = assetForLabel(label)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/20">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800/70">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {asset.title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Auto-selected for: <span className="font-semibold">{asset.subtitle}</span>
          </div>
        </div>
      </div>
      <div className="bg-white/40 p-4 dark:bg-slate-950/20">
        {asset.src ? (
          <img
            src={asset.src}
            alt={`Failure illustration for ${asset.subtitle}`}
            className="h-auto w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800"
            loading="lazy"
          />
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            No visible failure mode detected for this prediction.
          </div>
        )}
      </div>
    </div>
  )
}

