"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, QrCode, Download, FolderDown } from "lucide-react"

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

export default function InventarisPage() {
  const [data, setData] = useState<any[]>([])
  const [golonganList, setGolonganList] = useState<any[]>([])
  const [ruanganList, setRuanganList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [dialogError, setDialogError] = useState("")
  
  // Fields
  const [golonganId, setGolonganId] = useState("")
  const [ruanganId, setRuanganId] = useState("")
  const [namaBarang, setNamaBarang] = useState("")
  const [tanggalPerolehan, setTanggalPerolehan] = useState("")
  const [hargaPerolehan, setHargaPerolehan] = useState("")
  const [bahanMerk, setBahanMerk] = useState("")
  const [jumlah, setJumlah] = useState("1")
  const [kondisi, setKondisi] = useState("baik")
  const [keterangan, setKeterangan] = useState("")
  const [pengguna, setPengguna] = useState("")
  const [masaManfaat, setMasaManfaat] = useState("")

  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [qrOpen, setQrOpen] = useState(false)
  const [qrUrl, setQrUrl] = useState("")
  const [qrTitle, setQrTitle] = useState("")

  const [exportOpen, setExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel")
  const [exportRuanganId, setExportRuanganId] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resInv, resGol, resRua] = await Promise.all([
        fetch("/api/inventaris"),
        fetch("/api/golongan"),
        fetch("/api/ruangan")
      ]);
      const jsonInv = await resInv.json()
      const jsonGol = await resGol.json()
      const jsonRua = await resRua.json()
      setData(Array.isArray(jsonInv) ? jsonInv : [])
      setGolonganList(Array.isArray(jsonGol) ? jsonGol : [])
      setRuanganList(Array.isArray(jsonRua) ? jsonRua : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setGolonganId("")
    setRuanganId("")
    setNamaBarang("")
    setTanggalPerolehan("")
    setHargaPerolehan("")
    setBahanMerk("")
    setJumlah("1")
    setKondisi("baik")
    setKeterangan("")
    setPengguna("")
    setMasaManfaat("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setGolonganId(item.golonganId)
    setRuanganId(item.ruanganId)
    setNamaBarang(item.namaBarang)
    setTanggalPerolehan(item.tanggalPerolehan ? new Date(item.tanggalPerolehan).toISOString().split('T')[0] : "")
    setHargaPerolehan(item.hargaPerolehan?.toString() || "")
    setBahanMerk(item.bahanMerk || "")
    setJumlah(item.jumlah?.toString() || "1")
    setKondisi(item.kondisi || "baik")
    setKeterangan(item.keterangan || "")
    setPengguna(item.pengguna || "")
    setMasaManfaat(item.masaManfaat?.toString() || "")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!golonganId || !ruanganId || !namaBarang || !tanggalPerolehan || !hargaPerolehan) {
      setDialogError("Field mandatory wajib diisi (Nama, Golongan, Ruangan, Tanggal, Harga)")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/inventaris/${currentId}` : "/api/inventaris"
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          golonganId, ruanganId, namaBarang, tanggalPerolehan, 
          hargaPerolehan, bahanMerk, jumlah, kondisi, 
          keterangan, pengguna, masaManfaat 
        }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Inventaris diperbarui" : "Inventaris ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/inventaris/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Inventaris berhasil dihapus")
      setAlertOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message)
      setAlertOpen(false)
    }
  }

  const handleExport = () => {
    // Determine data slice
    let filteredData = data;
    if (exportRuanganId && exportRuanganId !== "semua") {
       filteredData = data.filter(i => i.ruanganId === exportRuanganId)
    }

    const rFilter = ruanganList.find(r => r.id === exportRuanganId)
    const exportTitle = exportRuanganId === "semua" || !exportRuanganId ? "Seluruh Inventaris" : `Daftar Inventaris - Ruangan ${rFilter?.namaRuangan || ''}`

    exportData({
      filename: "Data_Inventaris_Manajemen",
      format: exportFormat,
      title: exportTitle,
      columns: [
        { header: "Kode Barang", key: "kodeBarang" },
        { header: "Nama Barang", key: "namaBarang" },
        { header: "Kondisi", key: "kondisi" },
        { header: "Pengguna", key: "pengguna" },
        { header: "Tgl Perolehan", key: "tanggalPerolehan" },
        { header: "Golongan", key: "golongan.namaGolongan" },
        { header: "Ruangan", key: "ruangan.namaRuangan" }
      ],
      data: filteredData
    })

    setExportOpen(false)
    toast.success(`Berhasil mengekspor format ${exportFormat.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventaris</h1>
          <p className="text-sm text-slate-500">Kelola aset bergerak, ATK, mebel, dsb di tiap ruangan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari inventaris..." 
            className="w-48 md:w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary" onClick={() => setExportOpen(true)}>
            <FolderDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Inventaris
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Golongan</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Tgl. Perolehan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada data</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaBarang?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.namaBarang}</TableCell>
                  <TableCell>{item.golongan?.namaGolongan}</TableCell>
                  <TableCell>{item.ruangan?.namaRuangan}</TableCell>
                  <TableCell>{item.kondisi}</TableCell>
                  <TableCell>{item.tanggalPerolehan ? new Date(item.tanggalPerolehan).toLocaleDateString("id-ID") : ""}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => {
                       setQrUrl(`${window.location.origin}/detail/inventaris/${item.id}`)
                       setQrTitle(item.namaBarang)
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
        <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Inventaris" : "Tambah Inventaris"}</DialogTitle>
            <DialogDescription>Masukkan spesifikasi barang inventaris Anda.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Nama Barang *</Label>
                <Input value={namaBarang} onChange={e => setNamaBarang(e.target.value)} className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Golongan *</Label>
                <div className="col-span-2">
                  <SearchableSelect 
                    options={golonganList.map((g: any) => ({ value: g.id, label: `${g.kodeGolongan} - ${g.namaGolongan}` }))}
                    value={golonganId} onChange={setGolonganId}
                    placeholder="Pilih Golongan..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Ruangan *</Label>
                <div className="col-span-2">
                  <SearchableSelect 
                    options={ruanganList.map((r: any) => ({ value: r.id, label: `${r.kodeRuangan} (${r.namaRuangan})` }))}
                    value={ruanganId} onChange={setRuanganId}
                    placeholder="Pilih Ruangan..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Kondisi</Label>
                <select 
                  className="col-span-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                  value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
                  <option value="baik">Baik</option>
                  <option value="kurang_baik">Kurang Baik</option>
                  <option value="rusak_berat">Rusak Berat</option>
                </select>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Jumlah</Label>
                <Input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} className="col-span-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Tgl Perolehan*</Label>
                <Input type="date" value={tanggalPerolehan} onChange={e => setTanggalPerolehan(e.target.value)} className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Harga *</Label>
                <Input type="number" value={hargaPerolehan} onChange={e => setHargaPerolehan(e.target.value)} className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Merek/Bahan</Label>
                <Input value={bahanMerk} onChange={e => setBahanMerk(e.target.value)} className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Pengguna</Label>
                <Input value={pengguna} onChange={e => setPengguna(e.target.value)} className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label className="text-right">Masa (Bulan)</Label>
                <Input type="number" value={masaManfaat} onChange={e => setMasaManfaat(e.target.value)} className="col-span-2" placeholder="opsional" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-[115px_1fr] items-center gap-2 py-2">
            <Label className="text-right">Keterangan</Label>
            <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-[calc(100%-12px)] ml-[12px]" />
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Inventaris?</AlertDialogTitle>
            <AlertDialogDescription>Barang ini akan direkam statusnya dihapus dari database aset.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm flex flex-col items-center py-10">
          <DialogTitle className="mb-4">Scan Label Inventaris</DialogTitle>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <QRCodeSVG value={qrUrl} size={200} />
          </div>
          <p className="text-xs text-center text-slate-500 font-bold mt-4">Peralatan: {qrTitle}</p>
          <p className="text-xs text-center text-slate-400 mt-1 leading-relaxed">
            Scan dari handphone untuk melihat informasi kepemilikan.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => window.open(qrUrl, "_blank")}>
             Buka Detail (Manual)
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
         <DialogContent className="max-w-sm">
            <DialogHeader>
               <DialogTitle>Export Data Inventaris</DialogTitle>
               <DialogDescription>Unduh rekap inventaris berdasarkan ruangan spesifik atau semua data ke format PDF / Excel.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div className="space-y-2">
                  <Label>Format Export</Label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                    value={exportFormat} onChange={(e: any) => setExportFormat(e.target.value)}>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <Label>Filter Berdasarkan Ruangan</Label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-ring"
                    value={exportRuanganId} 
                    onChange={(e) => setExportRuanganId(e.target.value)}
                  >
                    <option value="semua">-- Ekspor Semua Ruangan --</option>
                    {ruanganList.map((r: any) => <option key={r.id} value={r.id}>{r.kodeRuangan} - {r.namaRuangan}</option>)}
                  </select>
               </div>
            </div>
            <DialogFooter>
               <Button onClick={handleExport} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Berkas {exportFormat.toUpperCase()}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
