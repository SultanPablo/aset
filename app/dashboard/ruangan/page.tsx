"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, QrCode } from "lucide-react"

import { QRCodeSVG } from "qrcode.react"

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

export default function RuanganPage() {
  const [data, setData] = useState<any[]>([])
  const [propertiList, setPropertiList] = useState<any[]>([])
  const [lantaiList, setLantaiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [kodeRuangan, setKodeRuangan] = useState("")
  const [namaRuangan, setNamaRuangan] = useState("")
  const [propertiId, setPropertiId] = useState("")
  const [lantaiId, setLantaiId] = useState("")
  const [keterangan, setKeterangan] = useState("")
  
  const [dialogError, setDialogError] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [qrOpen, setQrOpen] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [qrTitle, setQrTitle] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resRua, resProp, resLan] = await Promise.all([
        fetch("/api/ruangan"),
        fetch("/api/properti"),
        fetch("/api/lantai")
      ]);
      const jsonRua = await resRua.json()
      const jsonProp = await resProp.json()
      const jsonLan = await resLan.json()
      setData(Array.isArray(jsonRua) ? jsonRua : [])
      setPropertiList(Array.isArray(jsonProp) ? jsonProp : [])
      setLantaiList(Array.isArray(jsonLan) ? jsonLan : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setKodeRuangan("")
    setNamaRuangan("")
    setPropertiId("")
    setLantaiId("")
    setKeterangan("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setKodeRuangan(item.kodeRuangan || "")
    setNamaRuangan(item.namaRuangan || "")
    setPropertiId(item.propertiId)
    setLantaiId(item.lantaiId || "")
    setKeterangan(item.keterangan || "")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!namaRuangan || !propertiId || !kodeRuangan) {
      setDialogError("Kode, Nama, dan Properti wajib diisi")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/ruangan/${currentId}` : "/api/ruangan"
      
      const payload: any = { kodeRuangan, namaRuangan, propertiId, keterangan }
      if (lantaiId) payload.lantaiId = lantaiId;

      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Ruangan diperbarui" : "Ruangan ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/ruangan/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Ruangan berhasil dihapus")
      setAlertOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
      setAlertOpen(false)
    }
  }

  const filteredLantai = propertiId ? lantaiList.filter((l: any) => l.propertiId === propertiId) : lantaiList;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ruangan</h1>
          <p className="text-sm text-slate-500">Kelola master data ruangan di dalam properti.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari ruangan..." 
            className="w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Ruangan
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama Ruangan</TableHead>
              <TableHead>Properti</TableHead>
              <TableHead>Lantai</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">Belum ada data</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaRuangan?.toLowerCase().includes(searchQuery.toLowerCase()) || i.kodeRuangan?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kodeRuangan}</TableCell>
                  <TableCell>{item.namaRuangan}</TableCell>
                  <TableCell>{item.properti?.namaProperti}</TableCell>
                  <TableCell>{item.lantai?.namaLantai || "-"}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => {
                       setQrUrl(`${window.location.origin}/detail/ruangan/${item.id}`)
                       setQrTitle(item.namaRuangan)
                       setQrOpen(true)
                    }}>
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => { setDeleteId(item.id); setAlertOpen(true) }}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Ruangan" : "Tambah Ruangan"}</DialogTitle>
            <DialogDescription>Penempatan ruangan pada sebuah properti (dan lantai opsional).</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kode" className="text-right">Kode Ruangan</Label>
              <Input 
                id="kode" value={kodeRuangan} onChange={e => setKodeRuangan(e.target.value)} 
                className="col-span-3" placeholder="R-01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">Nama Ruangan</Label>
              <Input 
                id="nama" value={namaRuangan} onChange={e => setNamaRuangan(e.target.value)} 
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="properti" className="text-right">Properti</Label>
              <div className="col-span-3">
                <SearchableSelect 
                  options={propertiList.map((p: any) => ({ value: p.id, label: p.namaProperti }))}
                  value={propertiId}
                  onChange={(val) => { setPropertiId(val); setLantaiId(""); }}
                  placeholder="Pilih Properti..."
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lantai" className="text-right">Lantai (Opsional)</Label>
              <div className="col-span-3">
                <SearchableSelect 
                  options={filteredLantai.map((l: any) => ({ value: l.id, label: l.namaLantai }))}
                  value={lantaiId}
                  onChange={setLantaiId}
                  placeholder="Pilih Lantai..."
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keterangan" className="text-right">Keterangan</Label>
              <Input 
                id="keterangan" value={keterangan} onChange={e => setKeterangan(e.target.value)} 
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Ruangan?</AlertDialogTitle>
            <AlertDialogDescription>Data ruangan akan dihapus. Perhatikan bahwa aset inventaris yang terkait tidak dapat dihapus jika bergantung.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm flex flex-col items-center py-10">
          <DialogTitle className="mb-4">Label Ruang</DialogTitle>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <QRCodeSVG value={qrUrl} size={200} />
          </div>
          <p className="text-sm font-bold text-slate-800 mt-4 text-center">{qrTitle}</p>
          <p className="text-xs text-center text-slate-400 mt-1 leading-relaxed">
            Tempelkan di ambang pintu ruangan. Pengunjung dapat memindai kode ini untuk melihat rekap inventaris real-time.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => window.open(qrUrl, "_blank")}>
             Preview
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
