"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PenghapusanPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogError, setDialogError] = useState("")

  const [asetType, setAsetType] = useState("inventaris")
  const [asetId, setAsetId] = useState("0") // placeholder id
  const [namaAsetSnapshot, setNamaAsetSnapshot] = useState("")
  const [alasan, setAlasan] = useState("")
  const [jumlah, setJumlah] = useState("1")
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])
  const [keterangan, setKeterangan] = useState("")

  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/penghapusan")
      const json = await res.json()
      setData(Array.isArray(json) ? json : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setAsetType("inventaris")
    setNamaAsetSnapshot("")
    setAlasan("")
    setJumlah("1")
    setTanggal(new Date().toISOString().split('T')[0])
    setKeterangan("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!namaAsetSnapshot || !alasan) {
      setDialogError("Nama aset terpilih dan Alasan Penghapusan wajib diisi")
      return
    }

    try {
      const res = await fetch("/api/penghapusan", {
        method: "POST",
        body: JSON.stringify({ 
          asetType, 
          asetId, 
          namaAsetSnapshot, 
          alasan, 
          jumlah: parseInt(jumlah),
          tanggal, 
          keterangan 
        }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Gagal menyimpan riwayat penghapusan")
      toast.success("Catatan Penghapusan berhasil dijurnalkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/penghapusan/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus log")
      toast.success("Log Penghapusan dihapus")
      setAlertOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Penghapusan</h1>
          <p className="text-sm text-slate-500">Mendata aset yang dilelang, dimusnahkan, atau hilang.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" placeholder="Cari aset..." className="w-64"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd} className="bg-destructive hover:bg-destructive/90 text-white">
            <Plus className="mr-2 h-4 w-4" /> Entri Penghapusan Baru
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Nama Aset Terhapus</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Alasan Eksekusi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada data penghapusan</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaAsetSnapshot?.toLowerCase().includes(searchQuery.toLowerCase()) || i.alasan?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id} className="opacity-80">
                  <TableCell className="font-medium text-slate-500">{new Date(item.tanggal).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{item.asetType}</TableCell>
                  <TableCell className="line-through">{item.namaAsetSnapshot}</TableCell>
                  <TableCell>{item.jumlah}</TableCell>
                  <TableCell className="text-destructive font-semibold uppercase text-xs">{item.alasan}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => { setDeleteId(item.id); setAlertOpen(true) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Surat Penghapusan Aset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Kategori Aset yg Dihapus</Label>
                   <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring border-red-200"
                      value={asetType} onChange={(e) => setAsetType(e.target.value)}>
                      <option value="inventaris">Inventaris / Barang Mebel</option>
                      <option value="kendaraan">Kendaraan Armada</option>
                      <option value="properti">Properti & Tanah</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                    <Label>Ketik Identitas Aset *</Label>
                    <Input value={namaAsetSnapshot} placeholder="Laptop Acer Spin..." onChange={e => setNamaAsetSnapshot(e.target.value)} />
                 </div>
             </div>
             
             <div className="space-y-2">
                 <Label>Alasan Penghapusan Berita Acara *</Label>
                 <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring border-red-200"
                      value={alasan} onChange={(e) => setAlasan(e.target.value)}>
                      <option value="" disabled>Pilih status dasar penghapusan</option>
                      <option value="dimusnahkan">Rusak Total / Dimusnahkan</option>
                      <option value="dilelang">Dilelang / Dijual</option>
                      <option value="hilang">Hilang / Dicuri</option>
                      <option value="dihibahkan">Dihibahkan ke pihak lain</option>
                 </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Jumlah Barang (Unit)</Label>
                    <Input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label>Tanggal Surat Penghapusan</Label>
                    <Input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
                 </div>
             </div>

             <div className="space-y-2">
                 <Label>Keterangan Tambahan / Nomor Surat Rekomendasi Klasis</Label>
                 <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} />
             </div>
             {dialogError && <p className="text-red-500 text-sm mt-2 font-medium">{dialogError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleSave}>Finalisasi Hapus Aset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Keputusan Berita Acara?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <AlertDialogCancel onClick={() => setAlertOpen(false)}>Kembali</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus Permanen Log</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
