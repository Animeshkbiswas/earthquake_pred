import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Let Vite handle asset URLs so Leaflet can find marker icons.
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import markerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'

function configureLeafletIcons() {
  // Fix default marker icon paths in bundlers.
  // If this runs multiple times it's fine; Leaflet will just keep the merged options.
  const markerIconUrl = markerIconPng
  const markerIconRetinaUrl = markerIcon2xPng
  const shadowUrl = markerShadowPng

  ;(L.Icon.Default as any).mergeOptions({
    iconRetinaUrl: markerIconRetinaUrl,
    iconUrl: markerIconUrl,
    shadowUrl,
  })
}

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const DEFAULT_CENTER: [number, number] = [22.251208604465074, 84.90576949858426]

export default function LocationPicker({
  latitude,
  longitude,
  onPick,
}: {
  latitude: number | null
  longitude: number | null
  onPick: (lat: number, lng: number) => void
}) {
  useEffect(() => {
    configureLeafletIcons()
  }, [])

  const center: LatLngExpression = useMemo(() => {
    // Default to the project’s fixed location if coordinates are not valid yet.
    const lat = typeof latitude === 'number' ? latitude : DEFAULT_CENTER[0]
    const lng = typeof longitude === 'number' ? longitude : DEFAULT_CENTER[1]
    return [lat, lng]
  }, [latitude, longitude])

  const markerPosition: LatLngExpression | null =
    typeof latitude === 'number' && typeof longitude === 'number'
      ? [latitude, longitude]
      : null

  return (
    <div className="rounded-2xl border bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/20">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Pick Location (Optional)
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Click on the map to set latitude & longitude.
          </div>
        </div>
      </div>
      <div className="h-64 w-full overflow-hidden rounded-xl">
        <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPick onPick={onPick} />
          {markerPosition ? <Marker position={markerPosition} /> : null}
        </MapContainer>
      </div>
    </div>
  )
}

