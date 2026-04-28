import prisma from "@/prisma"
import { notFound } from "next/navigation"

export default async function RuanganPublicDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  
  const ruangan = await prisma.ruangan.findUnique({
    where: { id },
    include: { 
       properti: true,
       inventaris: {
           include: { golongan: true },
           orderBy: { namaBarang: 'asc' }
       }
    }
  })

  if (!ruangan) return notFound()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white rounded-xl shadow border p-6 border-blue-100">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                 <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">{ruangan.properti?.namaProperti || "Properti"}</h2>
                 <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{ruangan.namaRuangan}</h1>
                 <p className="text-slate-500 mt-1">Kode Ruang: {ruangan.kodeRuangan}</p>
              </div>
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mt-4 md:mt-0 text-center border border-blue-100">
                 <p className="text-3xl font-bold">{ruangan.inventaris.length}</p>
                 <p className="text-xs uppercase font-semibold">Total Item</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">
           <div className="p-4 bg-slate-50 border-b">
              <h2 className="font-semibold text-slate-700">Daftar Inventaris Dalam Ruangan</h2>
           </div>
           {ruangan.inventaris.length === 0 ? (
             <div className="p-12 text-center text-slate-400">Ruangan ini tidak memiliki catatan inventaris.</div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                     <tr>
                        <th className="px-6 py-4 font-semibold">Nama Barang</th>
                        <th className="px-6 py-4 font-semibold">Kondisi</th>
                        <th className="px-6 py-4 font-semibold">Golongan</th>
                        <th className="px-6 py-4 font-semibold">Spesifikasi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {ruangan.inventaris.map((inv: any) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-900">{inv.namaBarang}</td>
                           <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs capitalize font-bold border">
                                {inv.kondisi}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-slate-600">{inv.golongan?.namaGolongan}</td>
                           <td className="px-6 py-4 text-slate-500 text-xs">{inv.spesifikasi || "-"}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
