"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
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
import { SearchableSelect } from "@/components/searchable-select"

export default function MutasiPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inventarisList, setInventarisList] = useState<any[]>([])
  const [ruanganList, setRuanganList] = useState<any[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  
  // fields
  const [inventarisId, setInventarisId] = useState("")
  const [ruanganAsalId, setRuanganAsalId] = useState("")
  const [ruanganTujuanId, setRuanganTujuanId] = useState("")
  const [kondisiSebelum, setKondisiSebelum] = useState("baik")
  const [kondisiSesudah, setKondisiSesudah] = useState("baik")
  const [jumlah, setJumlah] = useState("1")
  const [keterangan, setKeterangan] = useState("")
  const [tanggalMutasi, setTanggalMutasi] = useState(new Date().toISOString().split('T')[0])

  const [dialogError, setDialogError] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resMut, resInv, resRu] = await Promise.all([
        fetch("/api/mutasi"),
        fetch("/api/inventaris"),
        fetch("/api/ruangan")
      ]);
      const jsonMut = await resMut.json()
      const jsonInv = await resInv.json()
      const jsonRu = await resRu.json()
      setData(Array.isArray(jsonMut) ? jsonMut : [])
      setInventarisList(Array.isArray(jsonInv) ? jsonInv : [])
      setRuanganList(Array.isArray(jsonRu) ? jsonRu : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setInventarisId("")
    setRuanganAsalId("")
    setRuanganTujuanId("")
    setKondisiSebelum("baik")
    setKondisiSesudah("baik")
    setJumlah("1")
    setKeterangan("")
    setTanggalMutasi(new Date().toISOString().split('T')[0])
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!inventarisId || !ruanganTujuanId) {
      setDialogError("Field Inventaris dan Ruangan Tujuan wajib diisi")
      return
    }

    try {
      const inv = inventarisList.find(i => i.id === inventarisId);
      const ruanganA = ruanganAsalId ? ruanganList.find(r => r.id === ruanganAsalId) : { namaRuangan: "-" };
      const ruanganT = ruanganTujuanId ? ruanganList.find(r => r.id === ruanganTujuanId) : { namaRuangan: "-" };

      const res = await fetch("/api/mutasi", {
        method: "POST",
        body: JSON.stringify({ 
          inventarisId,
          ruanganAsalId,
          ruanganTujuanId,
          namaBarangSnapshot: inv?.namaBarang || "Unknown",
          golonganSnapshot: inv?.golongan?.namaGolongan || "Unknown",
          ruanganAsalSnapshot: ruanganA?.namaRuangan || "-",
          ruanganTujuanSnapshot: ruanganT?.namaRuangan || "-",
          jumlah: parseInt(jumlah),
          kondisiSebelum,
          kondisiSesudah,
          tanggalMutasi,
          keterangan
        }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success("Catatan Mutasi berhasil ditambahkan!")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  // Mutasi history shouldn't normally be edited, but let's just do delete
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/mutasi/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus")
      toast.success("Catatan berhasil dihapus")
      setAlertOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
      setAlertOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Mutasi</h1>
          <p className="text-sm text-slate-500">Log mutasi dan perpindahan aset Inventaris antar ruangan.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" placeholder="Cari barang..." className="w-64"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Proses Mutasi Baru
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Mutasi</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Ruangan Asal</TableHead>
              <TableHead>Ruangan Tujuan</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada riwayat mutasi</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaBarangSnapshot?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{new Date(item.tanggalMutasi).toLocaleDateString()}</TableCell>
                  <TableCell>{item.namaBarangSnapshot}</TableCell>
                  <TableCell>{item.ruanganAsalSnapshot}</TableCell>
                  <TableCell className="font-bold">{item.ruanganTujuanSnapshot}</TableCell>
                  <TableCell>{item.kondisiSesudah}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => { setDeleteId(item.id); setAlertOpen(true) }}>
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
            <DialogTitle>Formulir Mutasi Aset</DialogTitle>
            <DialogDescription>Mutasi aset akan memindahkan kepemilkian Ruangan aset tersebut pada Inventaris.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pilih Inventaris *</Label>
                <SearchableSelect 
                  options={inventarisList.map((g: any) => ({ value: g.id, label: g.namaBarang }))}
                  value={inventarisId} onChange={(val) => {
                     setInventarisId(val)
                     // auto default ruangan asal
                     const sel = inventarisList.find(i => i.id === val);
                     if (sel && sel.ruanganId) setRuanganAsalId(sel.ruanganId);
                     if (sel && sel.kondisi) setKondisiSebelum(sel.kondisi);
                  }}
                  placeholder="Ketik nama inventaris..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Ruangan Asal</Label>
                   <SearchableSelect 
                     options={ruanganList.map((r: any) => ({ value: r.id, label: r.namaRuangan }))}
                     value={ruanganAsalId} onChange={setRuanganAsalId}
                     placeholder="Ruangan Awal..."
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Ruangan Tujuan *</Label>
                   <SearchableSelect 
                     options={ruanganList.map((r: any) => ({ value: r.id, label: r.namaRuangan }))}
                     value={ruanganTujuanId} onChange={setRuanganTujuanId}
                     placeholder="Pindah ke..."
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Kondisi Sesudah</Label>
                   <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                      value={kondisiSesudah} onChange={(e) => setKondisiSesudah(e.target.value)}>
                      <option value="baik">Baik</option>
                      <option value="rusak-ringan">Rusak Ringan</option>
                      <option value="rusak-berat">Rusak Berat</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                    <Label>Jumlah Mutasi</Label>
                    <Input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Tanggal Mutasi</Label>
                    <Input type="date" value={tanggalMutasi} onChange={e => setTanggalMutasi(e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label>Keterangan</Label>
                    <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} />
                 </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Proses Mutasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
            <AlertDialogDescription>Hal ini hanya akan menghapus log riwayat mutasi dari database, tidak memperbarui status barang.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus Log</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
