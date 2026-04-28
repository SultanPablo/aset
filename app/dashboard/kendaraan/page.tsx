"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, QrCode, Download } from "lucide-react"

import { QRCodeSVG } from "qrcode.react"
import { exportData } from "@/lib/exportUtils"

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

export default function KendaraanPage() {
  const [data, setData] = useState<any[]>([])
  const [golonganList, setGolonganList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [dialogError, setDialogError] = useState("")
  
  // Fields
  const [golonganId, setGolonganId] = useState("")
  const [namaKendaraan, setNamaKendaraan] = useState("")
  const [merek, setMerek] = useState("")
  const [tipe, setTipe] = useState("")
  const [noPolisi, setNoPolisi] = useState("")
  const [tahunPerolehan, setTahunPerolehan] = useState("")
  const [pengguna, setPengguna] = useState("")
  const [kondisi, setKondisi] = useState("baik")
  const [keterangan, setKeterangan] = useState("")

  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [qrOpen, setQrOpen] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [qrTitle, setQrTitle] = useState("")

  const handleExport = (format: "excel" | "pdf") => {
    const filteredRecord = data.filter((i:any) => i.merekTipe?.toLowerCase().includes(searchQuery.toLowerCase()) || i.noPolisi?.toLowerCase().includes(searchQuery.toLowerCase()) || i.namaKendaraan?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    exportData({
      filename: "Daftar_Kendaraan",
      format,
      title: "Laporan Armada Kendaraan",
      columns: [
        { header: "Nama Kendaraan", key: "namaKendaraan" },
        { header: "Merek", key: "merek" },
        { header: "No. Polisi", key: "noPolisi" },
        { header: "Pengguna", key: "pengguna" },
        { header: "Kondisi", key: "kondisi" },
      ],
      data: filteredRecord
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resKen, resGol] = await Promise.all([
        fetch("/api/kendaraan"),
        fetch("/api/golongan")
      ]);
      const jsonKen = await resKen.json()
      const jsonGol = await resGol.json()
      setData(Array.isArray(jsonKen) ? jsonKen : [])
      setGolonganList(Array.isArray(jsonGol) ? jsonGol : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setGolonganId("")
    setNamaKendaraan("")
    setMerek("")
    setTipe("")
    setNoPolisi("")
    setTahunPerolehan("")
    setPengguna("")
    setKondisi("baik")
    setKeterangan("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setGolonganId(item.golonganId)
    setNamaKendaraan(item.namaKendaraan)
    setMerek(item.merek || "")
    setTipe(item.tipe || "")
    setNoPolisi(item.noPolisi || "")
    setTahunPerolehan(item.tahunPerolehan?.toString() || "")
    setPengguna(item.pengguna)
    setKondisi(item.kondisi || "baik")
    setKeterangan(item.keterangan || "")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!golonganId || !namaKendaraan || !pengguna) {
      setDialogError("Nama Kendaraan, Golongan, dan Pengguna wajib diisi")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/kendaraan/${currentId}` : "/api/kendaraan"
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          golonganId, namaKendaraan, merek, tipe, noPolisi, 
          tahunPerolehan, pengguna, kondisi, keterangan 
        }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Kendaraan diperbarui" : "Kendaraan ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/kendaraan/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Kendaraan berhasil dihapus")
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
          <h1 className="text-2xl font-bold tracking-tight">Kendaraan</h1>
          <p className="text-sm text-slate-500">Kelola inventaris armada mobil, motor, atau kendaraan lain.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari kendaraan..." 
            className="w-48 md:w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kendaraan
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kendaraan</TableHead>
              <TableHead>No. Polisi</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada armada</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.merekTipe?.toLowerCase().includes(searchQuery.toLowerCase()) || i.noPolisi?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.namaKendaraan} {item.merek && `(${item.merek})`}</TableCell>
                  <TableCell>{item.noPolisi || "-"}</TableCell>
                  <TableCell>{item.pengguna}</TableCell>
                  <TableCell>{item.tahunPerolehan || "-"}</TableCell>
                  <TableCell>{item.kondisi}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => {
                       setQrUrl(`${window.location.origin}/detail/kendaraan/${item.id}`)
                       setQrTitle(item.noPolisi || item.namaKendaraan)
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Kendaraan" : "Tambah Kendaraan"}</DialogTitle>
            <DialogDescription>Masukkan spesifikasi unit kendaraan.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Kendaraan *</Label>
                <Input value={namaKendaraan} onChange={e => setNamaKendaraan(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Golongan *</Label>
                <SearchableSelect 
                  options={golonganList.map((g: any) => ({ value: g.id, label: g.namaGolongan }))}
                  value={golonganId} onChange={setGolonganId}
                  placeholder="Pilih Golongan..."
                />
              </div>
              <div className="space-y-2">
                <Label>Merek</Label>
                <Input value={merek} onChange={e => setMerek(e.target.value)} placeholder="Contoh: Toyota" />
              </div>
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Input value={tipe} onChange={e => setTipe(e.target.value)} placeholder="Contoh: Kijang Innova" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nomor Polisi</Label>
                <Input value={noPolisi} onChange={e => setNoPolisi(e.target.value)} placeholder="DH 1234 XY" />
              </div>
              <div className="space-y-2">
                <Label>Pengguna *</Label>
                <Input value={pengguna} onChange={e => setPengguna(e.target.value)} placeholder="Nama / Divisi Pengguna" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Tahun</Label>
                    <Input type="number" value={tahunPerolehan} onChange={e => setTahunPerolehan(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Kondisi</Label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                      value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
                      <option value="baik">Baik</option>
                      <option value="kurang_baik">Kurang Baik</option>
                      <option value="rusak_berat">Rusak Berat</option>
                    </select>
                  </div>
              </div>
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} />
              </div>
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
            <AlertDialogTitle>Hapus Kendaraan?</AlertDialogTitle>
            <AlertDialogDescription>Data kendaraan ini akan dihapus selamanya.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm flex flex-col items-center py-10">
          <DialogTitle className="mb-4">Scan QR Code ({qrTitle})</DialogTitle>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <QRCodeSVG value={qrUrl} size={200} />
          </div>
          <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
            Tempelkan stiker QR ini pada bodi kendaraan agar dapat dengan mudah memindai detail spesifikasi perawatan unit bersangkutan.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => window.open(qrUrl, "_blank")}>
             Buka Tautan (Test Preview)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
