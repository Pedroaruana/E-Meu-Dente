import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Clinic } from '../api/client'
import './ClinicMap.css'

interface ClinicMapProps {
  origin: { lat: number; lon: number }
  clinics: Clinic[]
}

// marcadores desenhados na mao com divIcon em vez dos pins padrao do
// leaflet — os pins default apontam pra uns .png dentro do pacote que o
// bundler nao resolve direito sem configuracao extra, e assim ja sai com
// a cor do resto do app em vez do azul generico do leaflet.
function markerIcon(kind: 'origin' | 'clinic') {
  const color = kind === 'origin' ? '#ff6b6b' : '#2fc4de'
  return L.divIcon({
    className: 'clinic-map__marker',
    html: `<span style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export function ClinicMap({ origin, clinics }: ClinicMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = L.map(container, { zoomControl: true }).setView([origin.lat, origin.lon], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map
    markersRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const markers = markersRef.current
    if (!map || !markers) return

    markers.clearLayers()

    L.marker([origin.lat, origin.lon], { icon: markerIcon('origin') })
      .bindPopup('Você está aqui')
      .addTo(markers)

    const bounds = L.latLngBounds([[origin.lat, origin.lon]])
    for (const clinic of clinics) {
      L.marker([clinic.lat, clinic.lon], { icon: markerIcon('clinic') })
        .bindPopup(`<strong>${clinic.name}</strong><br>${clinic.address}<br>${clinic.distanceKm} km`)
        .addTo(markers)
      bounds.extend([clinic.lat, clinic.lon])
    }

    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
  }, [origin, clinics])

  return <div ref={containerRef} className="clinic-map" />
}

export default ClinicMap
