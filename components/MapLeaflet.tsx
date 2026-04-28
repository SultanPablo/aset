"use client"

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useState } from "react"

export default function MapLeaflet({ dataList }: { dataList: any[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[500px] w-full flex items-center justify-center bg-slate-100 animate-pulse text-slate-400">Loading Map...</div>

  // default center point Kupang
  const defaultCenter: [number, number] = [-10.1633, 123.5855]

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {dataList.map((item, idx) => {
          // If has koordinat "lat,lng" text
          let pos: [number, number] | null = null
          if (item.koordinat && item.koordinat.includes(",")) {
            const splitted = item.koordinat.split(",")
            if (splitted.length === 2 && !isNaN(parseFloat(splitted[0]))) {
              pos = [parseFloat(splitted[0]), parseFloat(splitted[1])]
            }
          }

          // If GeoJSON exists
          let geojsonData = null
          if (item.geojson && item.geojson.trim().startsWith("{")) {
             try {
                geojsonData = JSON.parse(item.geojson)
             } catch (e) {}
          }

          return (
            <div key={item.id || idx}>
              {pos && (
                <Marker position={pos}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold">{item.namaProperti || item.noSertifikat || "Aset"}</h3>
                      <p className="text-sm mt-1">{item.keterangan || item.letakTanah}</p>
                      <span className="text-xs text-blue-500 font-semibold uppercase">{item.namaProperti ? "Properti" : "Sertifikat Tanah"}</span>
                    </div>
                  </Popup>
                </Marker>
              )}
              {geojsonData && (
                <GeoJSON 
                  data={geojsonData} 
                  style={{ color: item.namaProperti ? "#3B82F6" : "#22c55e", weight: 3 }}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(`<b>${item.namaProperti || item.noSertifikat}</b><br/>Area GeoJSON`)
                  }}
                />
              )}
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}
