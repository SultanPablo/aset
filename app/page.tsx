import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, PackageSearch, BarChart3, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b bg-white shadow-sm">
        <div className="flex items-center gap-2 text-[#1E3A8A]">
          <Database className="h-6 w-6" />
          <span className="font-extrabold text-xl tracking-tight">SIGMA ASET</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-medium">
              Log In Sistem
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#3B82F6] hover:bg-[#1E3A8A] text-white font-medium">
              Daftar Admin Baru
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Sistem <span className="text-[#3B82F6]">Manajemen Aset</span> <br /> Institusional & Enterprise
        </h1>
        <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Kendalikan seluruh pergerakan aset mulai dari peralatan, sertifikat, dan kendaraan dengan sistem lacak berpedoman QR otomatis dan pemetaan spasial inovatif.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/login">
             <Button size="lg" className="bg-[#1E3A8A] hover:bg-blue-800 text-white shadow-lg text-lg px-8">
                Masuk ke Dashboard
             </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-left">
           <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-[#3B82F6] mb-4">
                 <PackageSearch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">QR Tracing System</h3>
              <p className="text-slate-500 text-sm">Gunakan scan barcode untuk mendata spesifikasi di lapangan secara real-time.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-[#3B82F6] mb-4">
                 <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Peta Lahan & Properti</h3>
              <p className="text-slate-500 text-sm">Pusat penataan geografis inventaris berbasis peta OpenStreetMap dan GIS Leaflet.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-[#3B82F6] mb-4">
                 <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Hierarki Tabularisasi</h3>
              <p className="text-slate-500 text-sm">Kemampuan penyortiran PDF dan Excel berdasar Ruangan, Lantai, hingga gedung spesifik.</p>
           </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Sistem Manajemen Aset. All rights reserved.</p>
      </footer>
    </div>
  )
}
