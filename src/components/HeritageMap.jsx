/**
 * HeritageMap.jsx
 * Interactive heritage map with glowing markers using Leaflet.
 */
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* Custom heritage marker icon */
const heritageIcon = new L.DivIcon({
  className: 'heritage-marker',
  html: `<div class="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg shadow-amber-500/50 animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

/* Fly to new center when coords change */
function FlyTo({ center }) {
  const map = useMap()
  React.useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 1.5 })
  }, [center, map])
  return null
}

export default function HeritageMap({ center, sites = [], onSiteClick }) {
  if (!center) return null

  return (
    <div className="rounded-sm overflow-hidden border border-heritage-200 shadow-md h-[300px] mb-8">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: '#f5f0e8' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={[center.lat, center.lon]} />
        {sites.filter(s => s.lat && s.lon).map(site => (
          <Marker
            key={site.pageid}
            position={[site.lat, site.lon]}
            icon={heritageIcon}
            eventHandlers={{ click: () => onSiteClick?.(site) }}
          >
            <Popup>
              <strong className="text-heritage-800 font-serif">{site.title}</strong>
              {site.dist && <p className="text-xs text-heritage-500 mt-1">{(site.dist / 1000).toFixed(1)} km away</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
