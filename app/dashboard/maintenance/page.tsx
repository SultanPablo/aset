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

export default function MaintenancePage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogError, setDialogError] = useState("")

  const [asetType, setAsetType] = useState("kendaraan")
  const [namaAsetSnapshot, setNamaAsetSnapshot] = useState("")
  const [jenisTindakan, setJenisTindakan] = useState("")
  const [kondisiSesudah, setKondisiSesudah] = useState("baik")
  const [keterangan, setKeterangan] = useState("")
  const [biaya, setBiaya] = useState("")
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])

  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/maintenance")
      const json = await res.json()
      setData(Array.isArray(json) ? json : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setAsetType("kendaraan")
    setNamaAsetSnapshot("")
    setJenisTindakan("")
    setKondisiSesudah("baik")
    setBiaya("")
    setKeterangan("")
    setTanggal(new Date().toISOString().split('T')[0])
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!namaAsetSnapshot || !jenisTindakan) {
      setDialogError("Field Nama Aset dan Tindakan wajib diisi")
      return
    }
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        body: JSON.stringify({ 
          asetType, 
          namaAsetSnapshot, 
          jenisTindakan, 
          kondisiSesudah, 
          tanggal,
          biaya,
          keterangan 
        }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Gagal menyimpan")
      toast.success("Catatan Maintenance bertambah!")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/maintenance/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal menghapus")
      toast.success("Log berhasil dihapus")
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
          <h1 className="text-2xl font-bold tracking-tight">Maintenance & Perbaikan</h1>
          <p className="text-sm text-slate-500">Mencatat riwayat biaya servis dan perbaikan aset.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" placeholder="Cari..." className="w-64"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Catatan
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tgl Servis</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Nama Aset</TableHead>
              <TableHead>Tindakan</TableHead>
              <TableHead>Biaya</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada data</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaAsetSnapshot?.toLowerCase().includes(searchQuery.toLowerCase()) || i.jenisTindakan?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{new Date(item.tanggal).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{item.asetType}</TableCell>
                  <TableCell>{item.namaAsetSnapshot}</TableCell>
                  <TableCell>{item.jenisTindakan}</TableCell>
                  <TableCell>Rp {item.biaya?.toLocaleString()}</TableCell>
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
            <DialogTitle>Catat Maintenance / Servis Aset</DialogTitle>
          </DialogHeader>
          {dialogError && (
            <Alert variant="destructive"><AlertDescription>{dialogError}</AlertDescription></Alert>
          )}

          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Tipe Aset</Label>
                   <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                      value={asetType} onChange={(e) => setAsetType(e.target.value)}>
                      <option value="kendaraan">Kendaraan</option>
                      <option value="inventaris">Inventaris</option>
                      <option value="properti">Properti</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                    <Label>Nama / ID Aset *</Label>
                    <Input value={namaAsetSnapshot} placeholder="Ketikan unit spesifik..." onChange={e => setNamaAsetSnapshot(e.target.value)} />
                 </div>
             </div>

             <div className="space-y-2">
                 <Label>Tindakan Maintenance / Servis *</Label>
                 <Input value={jenisTindakan} onChange={e => setJenisTindakan(e.target.value)} placeholder="Misal: Ganti Oli Mesin / Renovasi Atap" />
             </div>

             <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Tanggal Servis</Label>
                    <Input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label>Total Biaya (Rp)</Label>
                    <Input type="number" value={biaya} onChange={e => setBiaya(e.target.value)} placeholder="0" />
                 </div>
                 <div className="space-y-2">
                   <Label>Kondisi Pasca-Servis</Label>
                   <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                      value={kondisiSesudah} onChange={(e) => setKondisiSesudah(e.target.value)}>
                      <option value="baik">Baik (Normal)</option>
                      <option value="kurang">Kurang Baik</option>
                   </select>
                 </div>
             </div>
             <div className="space-y-2">
                 <Label>Keterangan Bengkel/Vendor (Opsional)</Label>
                 <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan Catatan Servis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
