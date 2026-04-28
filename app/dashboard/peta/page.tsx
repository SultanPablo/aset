"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Import leaflet dynamically with ssr disabled
const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), { ssr: false })

export default function PetaPage() {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [resProp, resSert] = await Promise.all([
          fetch("/api/properti"),
          fetch("/api/sertifikat")
        ])
        const jsonProp = await resProp.json()
        const jsonSert = await resSert.json()

        const combined = [
          ...(Array.isArray(jsonProp) ? jsonProp : []),
          ...(Array.isArray(jsonSert) ? jsonSert : [])
        ]
        
        setDataList(combined)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Peta Spasial Geolocation</h1>
          <p className="text-sm text-slate-500">Visualisasi area aset Properti dan letak Sertifikat Tanah di atas Peta.</p>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-card border rounded-lg p-2 shadow-sm relative">
         {loading ? (
           <div className="h-[600px] flex items-center justify-center animate-pulse text-slate-400">Loading Datasets...</div>
         ) : (
           <MapLeaflet dataList={dataList} />
         )}
      </div>
    </div>
  )
}
