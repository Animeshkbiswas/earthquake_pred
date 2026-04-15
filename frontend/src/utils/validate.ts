import type {
  BuildingMaterial,
  FoundationType,
  SoilType,
} from './labels'

export type PredictFormState = {
  latitude: string
  longitude: string
  vs30: string
  richter: string
  soil_type: SoilType
  floors: string
  building_material: BuildingMaterial
  building_age: string
  foundation_type: FoundationType
}

export type PredictPayload = {
  latitude: number
  longitude: number
  vs30: number
  richter: number
  soil_type: SoilType
  floors: number
  building_material: BuildingMaterial
  building_age: number
  foundation_type: FoundationType
}

export type PredictFormErrors = Partial<Record<keyof PredictFormState, string>>

function parseFiniteNumber(value: string): number | null {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

export function validatePredictForm(form: PredictFormState): PredictFormErrors {
  const errors: PredictFormErrors = {}

  const latitude = parseFiniteNumber(form.latitude)
  if (latitude === null) errors.latitude = 'Latitude must be a valid number.'
  else if (latitude < -90 || latitude > 90)
    errors.latitude = 'Latitude must be between -90 and 90.'

  const longitude = parseFiniteNumber(form.longitude)
  if (longitude === null) errors.longitude = 'Longitude must be a valid number.'
  else if (longitude < -180 || longitude > 180)
    errors.longitude = 'Longitude must be between -180 and 180.'

  const vs30 = parseFiniteNumber(form.vs30)
  if (vs30 === null) errors.vs30 = 'Vs30 must be a valid number.'
  else if (vs30 <= 0) errors.vs30 = 'Vs30 must be greater than 0.'

  const richter = parseFiniteNumber(form.richter)
  if (richter === null) errors.richter = 'Richter scale must be a valid number.'
  else if (richter < 0) errors.richter = 'Richter scale cannot be negative.'
  else if (richter > 10) errors.richter = 'Richter scale should be between 0 and 10.'

  const floorsNum = parseFiniteNumber(form.floors)
  if (floorsNum === null) errors.floors = 'Floors must be a valid number.'
  else if (!Number.isInteger(floorsNum)) errors.floors = 'Floors must be an integer.'
  else if (floorsNum < 1) errors.floors = 'Floors must be at least 1.'
  else if (floorsNum > 200) errors.floors = 'Floors looks too large.'

  const ageNum = parseFiniteNumber(form.building_age)
  if (ageNum === null) errors.building_age = 'Building age must be a valid number.'
  else if (!Number.isInteger(ageNum)) errors.building_age = 'Building age must be an integer.'
  else if (ageNum < 0) errors.building_age = 'Building age cannot be negative.'
  else if (ageNum > 200) errors.building_age = 'Building age looks too large.'

  // Basic safety checks for dropdowns.
  if (!form.soil_type) errors.soil_type = 'Soil type is required.'
  if (!form.building_material) errors.building_material = 'Building material is required.'
  if (!form.foundation_type) errors.foundation_type = 'Foundation type is required.'

  return errors
}

export function formToPayload(form: PredictFormState): PredictPayload {
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)
  const vs30 = Number(form.vs30)
  const richter = Number(form.richter)
  const floors = Number(form.floors)
  const building_age = Number(form.building_age)

  return {
    latitude,
    longitude,
    vs30,
    richter,
    soil_type: form.soil_type,
    floors,
    building_material: form.building_material,
    building_age,
    foundation_type: form.foundation_type,
  }
}

