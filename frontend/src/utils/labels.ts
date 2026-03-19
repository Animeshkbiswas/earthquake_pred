export type SoilType = 'rock' | 'sand' | 'clay' | 'alluvium'
export type BuildingMaterial = 'rc' | 'brick' | 'steel' | 'wood'
export type FoundationType = 'pile' | 'shallow' | 'raft'

export const SOIL_OPTIONS: Array<{ value: SoilType; label: string }> = [
  { value: 'rock', label: 'Rock' },
  { value: 'sand', label: 'Sand' },
  { value: 'clay', label: 'Clay' },
  { value: 'alluvium', label: 'Alluvium' },
]

export const MATERIAL_OPTIONS: Array<{ value: BuildingMaterial; label: string }> = [
  { value: 'rc', label: 'RC (Reinforced Concrete)' },
  { value: 'brick', label: 'Brick' },
  { value: 'steel', label: 'Steel' },
  { value: 'wood', label: 'Wood' },
]

export const FOUNDATION_OPTIONS: Array<{ value: FoundationType; label: string }> = [
  { value: 'pile', label: 'Pile' },
  { value: 'shallow', label: 'Shallow' },
  { value: 'raft', label: 'Raft' },
]

export type DamageTone = 'green' | 'yellow' | 'red'

export type DamageMeta = {
  label: string
  predictionIndex: number
  tone: DamageTone
  badgeClassName: string
  cardAccentClassName: string
  barClassName: string
}

export const DAMAGE_META_BY_INDEX: Record<number, DamageMeta> = {
  0: {
    label: 'No Damage',
    predictionIndex: 0,
    tone: 'green',
    badgeClassName:
      'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-800',
    cardAccentClassName: 'border-emerald-200 dark:border-emerald-800',
    barClassName: 'bg-emerald-500 dark:bg-emerald-400',
  },
  1: {
    label: 'Minor',
    predictionIndex: 1,
    tone: 'yellow',
    badgeClassName:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800',
    cardAccentClassName: 'border-amber-200 dark:border-amber-800',
    barClassName: 'bg-amber-500 dark:bg-amber-400',
  },
  2: {
    label: 'Moderate',
    predictionIndex: 2,
    tone: 'yellow',
    badgeClassName:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800',
    cardAccentClassName: 'border-amber-200 dark:border-amber-800',
    barClassName: 'bg-amber-500 dark:bg-amber-400',
  },
  3: {
    label: 'Severe',
    predictionIndex: 3,
    tone: 'red',
    badgeClassName:
      'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-800',
    cardAccentClassName: 'border-rose-200 dark:border-rose-800',
    barClassName: 'bg-rose-500 dark:bg-rose-400',
  },
  4: {
    label: 'Collapse Risk',
    predictionIndex: 4,
    tone: 'red',
    badgeClassName:
      'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-800',
    cardAccentClassName: 'border-rose-200 dark:border-rose-800',
    barClassName: 'bg-rose-500 dark:bg-rose-400',
  },
}

export function getDamageMeta(predictionIndex: number): DamageMeta {
  const idx = Number.isFinite(predictionIndex) ? Math.trunc(predictionIndex) : 0
  return DAMAGE_META_BY_INDEX[idx] ?? DAMAGE_META_BY_INDEX[0]
}

export function riskPercentFromIndex(predictionIndex: number): number {
  const idx = Math.max(0, Math.min(4, Math.trunc(predictionIndex)))
  return Math.round((idx / 4) * 100)
}

