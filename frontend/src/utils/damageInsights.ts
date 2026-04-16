export type CanonicalDamageLabel =
  | 'No Damage'
  | 'Minor Damage'
  | 'Moderate Damage'
  | 'Severe Damage'
  | 'Collapse Risk'

const DAMAGE_IMAGES: Record<CanonicalDamageLabel, string[]> = {
  'No Damage': [],
  'Minor Damage': ['minor_1.jpeg', 'minor_2.jpeg', 'minor_3.jpeg', 'minor_4.jpeg'],
  'Moderate Damage': [
    'moderate_1.jpeg',
    'moderate_2.jpeg',
    'moderate_3.jpg',
    'moderate_4.jpg',
    'moderate_5.jpg',
  ],
  'Severe Damage': [
    'severe_1.jpeg',
    'severe_2.jpeg',
    'severe_3.jpeg',
    'severe_4.jpeg',
    'severe_5.jpg',
  ],
  'Collapse Risk': [
    'severe_1.jpeg',
    'severe_2.jpeg',
    'severe_3.jpeg',
    'severe_4.jpeg',
    'severe_5.jpg',
  ],
}

const DAMAGE_DESCRIPTIONS: Record<CanonicalDamageLabel, string> = {
  'No Damage':
    'The structure exhibits no observable signs of seismic distress. Structural elements remain within elastic limits, with no evidence of cracking, deformation, or foundation settlement. The building retains full operational integrity and requires no remedial action.',
  'Minor Damage':
    'The structure has sustained minor non-structural damage, including superficial cracks in plaster, masonry infill, and finishes. Load-bearing components remain intact, and the overall structural integrity is unaffected. Routine inspection and minor repairs are recommended.',
  'Moderate Damage':
    'The building shows moderate structural distress, characterized by visible cracks in beams, columns, and masonry walls. Partial spalling of concrete and localized yielding may be present. Although the structure remains stable, strengthening and retrofitting measures are required to restore safety.',
  'Severe Damage':
    'The structure has suffered extensive structural damage, including significant cracking, reinforcement exposure, and potential shear failure in primary load-bearing members. Differential settlement and partial structural instability may be observed. Immediate evacuation and comprehensive structural rehabilitation are necessary.',
  'Collapse Risk':
    'The building is at imminent risk of collapse due to critical structural failure. Major deformation, foundation instability, and loss of load-bearing capacity are evident. Emergency evacuation and demolition or complete reconstruction are strongly recommended.',
}

export function normalizeDamageLabel(label: string): CanonicalDamageLabel {
  const value = label.trim().toLowerCase()

  if (value.includes('collapse')) return 'Collapse Risk'
  if (value.includes('severe')) return 'Severe Damage'
  if (value.includes('moderate')) return 'Moderate Damage'
  if (value.includes('minor')) return 'Minor Damage'
  return 'No Damage'
}

export function getRandomDamageImage(label: string): string | null {
  const normalizedLabel = normalizeDamageLabel(label)
  const images = DAMAGE_IMAGES[normalizedLabel]

  if (!images.length) return null

  const imageName = images[Math.floor(Math.random() * images.length)]
  return `/${imageName}`
}

export function getDamageDescription(label: string): string {
  const normalizedLabel = normalizeDamageLabel(label)
  return DAMAGE_DESCRIPTIONS[normalizedLabel]
}
