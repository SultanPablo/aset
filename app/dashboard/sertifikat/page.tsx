"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, ScrollText } from "lucide-react"

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

export default function SertifikatPage() {
  const [data, setData] = useState<any[]>([])
  const [golonganList, setGolonganList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  const [dialogError, setDialogError] = useState("")
  
  // Fields
  const [golonganId, setGolonganId] = useState("")
  const [noSertifikat, setNoSertifikat] = useState("")
  const [namaJemaat, setNamaJemaat] = useState("")
  const [namaMataJemaat, setNamaMataJemaat] = useState("")
  const [namaKlasis, setNamaKlasis] = useState("")
  const [letakTanah, setLetakTanah] = useState("")
  const [luasM2, setLuasM2] = useState("")
  const [noHak, setNoHak] = useState("")
  const [nib, setNib] = useState("")
  const [tanggalPerolehan, setTanggalPerolehan] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [koordinat, setKoordinat] = useState("")
  const [geojson, setGeojson] = useState("")

  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resSer, resGol] = await Promise.all([
        fetch("/api/sertifikat"),
        fetch("/api/golongan")
      ]);
      const jsonSer = await resSer.json()
      const jsonGol = await resGol.json()
      setData(Array.isArray(jsonSer) ? jsonSer : [])
      setGolonganList(Array.isArray(jsonGol) ? jsonGol : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setGolonganId("")
    setNoSertifikat("")
    setNamaJemaat("")
    setNamaMataJemaat("")
    setNamaKlasis("")
    setLetakTanah("")
    setLuasM2("")
    setNoHak("")
    setNib("")
    setTanggalPerolehan("")
    setKeterangan("")
    setKoordinat("")
    setGeojson("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setGolonganId(item.golonganId)
    setNoSertifikat(item.noSertifikat)
    setNamaJemaat(item.namaJemaat)
    setNamaMataJemaat(item.namaMataJemaat)
    setNamaKlasis(item.namaKlasis)
    setLetakTanah(item.letakTanah)
    setLuasM2(item.luasM2?.toString() || "")
    setNoHak(item.noHak || "")
    setNib(item.nib || "")
    setTanggalPerolehan(item.tanggalPerolehan ? new Date(item.tanggalPerolehan).toISOString().split('T')[0] : "")
    setKeterangan(item.keterangan || "")
    setKoordinat(item.koordinat || "")
    setGeojson(item.geojson || "")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!golonganId || !noSertifikat || !namaJemaat || !namaMataJemaat || !namaKlasis || !letakTanah) {
      setDialogError("Field bertanda * wajib diisi")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/sertifikat/${currentId}` : "/api/sertifikat"
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          golonganId, noSertifikat, namaJemaat, namaMataJemaat, namaKlasis, letakTanah, luasM2, noHak, nib, tanggalPerolehan, keterangan, koordinat, geojson
        }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Sertifikat diperbarui" : "Sertifikat ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/sertifikat/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Sertifikat berhasil dihapus")
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
          <h1 className="text-2xl font-bold tracking-tight">Sertifikat Tanah</h1>
          <p className="text-sm text-slate-500">Rekam dokumen kepemilikan tanah dan NIB.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari sertifikat..." 
            className="w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Sertifikat
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Sertifikat</TableHead>
              <TableHead>Jemaat</TableHead>
              <TableHead>Klasis</TableHead>
              <TableHead>Luas (m²)</TableHead>
              <TableHead>Letak Tanah</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24 text-slate-500">Belum ada data sertifikat</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.noSertifikat?.toLowerCase().includes(searchQuery.toLowerCase()) || i.namaJemaat?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <ScrollText className="h-4 w-4 text-blue-500" />
                    {item.noSertifikat}
                  </TableCell>
                  <TableCell>{item.namaJemaat}</TableCell>
                  <TableCell>{item.namaKlasis}</TableCell>
                  <TableCell>{item.luasM2}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{item.letakTanah}</TableCell>
                  <TableCell className="text-right flex items-center justify-end space-x-2">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Sertifikat" : "Tambah Sertifikat"}</DialogTitle>
            <DialogDescription>Masukkan dokumen ke dalam database.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Golongan *</Label>
                <SearchableSelect 
                  options={golonganList.map((g: any) => ({ value: g.id, label: g.namaGolongan }))}
                  value={golonganId} onChange={setGolonganId}
                  placeholder="Pilih Golongan..."
                />
              </div>
              <div className="space-y-2">
                <Label>No Sertifikat *</Label>
                <Input value={noSertifikat} onChange={e => setNoSertifikat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nama Jemaat *</Label>
                <Input value={namaJemaat} onChange={e => setNamaJemaat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nama Mata Jemaat *</Label>
                <Input value={namaMataJemaat} onChange={e => setNamaMataJemaat(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nama Klasis *</Label>
                <Input value={namaKlasis} onChange={e => setNamaKlasis(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Letak Tanah *</Label>
                <Input value={letakTanah} onChange={e => setLetakTanah(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Luas (m²)</Label>
                    <Input type="number" value={luasM2} onChange={e => setLuasM2(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tgl Perolehan</Label>
                    <Input type="date" value={tanggalPerolehan} onChange={e => setTanggalPerolehan(e.target.value)} />
                  </div>
              </div>
              <div className="space-y-2">
                <Label>No Hak</Label>
                <Input value={noHak} onChange={e => setNoHak(e.target.value)} placeholder="Opsional" />
              </div>
              <div className="space-y-2">
                <Label>NIB</Label>
                <Input value={nib} onChange={e => setNib(e.target.value)} placeholder="Opsional" />
              </div>
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input value={keterangan} onChange={e => setKeterangan(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Koordinat Peta</Label>
                <Input value={koordinat} onChange={e => setKoordinat(e.target.value)} placeholder="-10.1633, 123.5855" />
              </div>
              <div className="space-y-2">
                <Label>GeoJSON</Label>
                <textarea 
                  value={geojson} onChange={e => setGeojson(e.target.value)} 
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder='{"type": "Feature", ...}'
                />
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
            <AlertDialogTitle>Hapus Sertifikat?</AlertDialogTitle>
            <AlertDialogDescription>Data sertifikat ini akan dihapus selamanya dari arsip digital.</AlertDialogDescription>
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
