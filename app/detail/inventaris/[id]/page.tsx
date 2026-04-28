import prisma from "@/prisma"
import { notFound } from "next/navigation"

export default async function InventarisPublicDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  
  const item = await prisma.inventaris.findUnique({
    where: { id },
    include: { 
       golongan: true, 
       ruangan: { include: { properti: true, lantai: true } } 
    }
  })

  if (!item) return notFound()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-blue-900 text-white p-6 text-center">
           <h1 className="text-2xl font-bold tracking-tight mb-1">Status Aset</h1>
           <p className="text-blue-200 text-sm opacity-90">{item.id}</p>
        </div>
        <div className="p-6 space-y-6">
           <div>
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Barang</h2>
             <p className="text-lg font-semibold text-slate-800">{item.namaBarang}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Spesifikasi</h2>
                <p className="text-sm font-medium text-slate-700">{item.bahanMerk || "-"}</p>
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Kondisi</h2>
                <div className="inline-block px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded capitalize border">
                   {item.kondisi}
                </div>
              </div>
           </div>

           <div className="border-t pt-4">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Golongan</h2>
             <p className="text-sm font-medium text-slate-700">{item.golongan?.namaGolongan}</p>
           </div>
           
           <div className="border-t pt-4">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lokasi Terkini</h2>
             <div className="bg-slate-50 p-3 rounded-lg border text-sm">
                <p><span className="font-semibold text-slate-600">Properti:</span> {item.ruangan?.properti?.namaProperti || "-"}</p>
                <p><span className="font-semibold text-slate-600">Ruang:</span> {item.ruangan?.namaRuangan || "Tidak Ditempati"}</p>
             </div>
           </div>

           <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tgl Perolehan</h2>
                <p className="text-sm text-slate-600">{item.tanggalPerolehan ? new Date(item.tanggalPerolehan).toLocaleDateString() : "-"}</p>
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Penanggungjawab</h2>
                <p className="text-sm text-slate-600">{item.pengguna || "-"}</p>
              </div>
           </div>
        </div>
      </div>
      <p className="mt-8 text-xs text-slate-400 text-center">Data diperbarui pada {new Date(item.updatedAt).toLocaleString()}</p>
    </div>
  )
}
