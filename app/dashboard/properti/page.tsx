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

export default function PropertiPage() {
  const [data, setData] = useState<any[]>([])
  const [golonganList, setGolonganList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [namaProperti, setNamaProperti] = useState("")
  const [golonganId, setGolonganId] = useState("")
  const [bertingkat, setBertingkat] = useState(false)
  const [jumlahLantai, setJumlahLantai] = useState("1")
  const [keterangan, setKeterangan] = useState("")
  const [koordinat, setKoordinat] = useState("")
  const [geojson, setGeojson] = useState("")
  
  const [dialogError, setDialogError] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resProp, resGol] = await Promise.all([
        fetch("/api/properti"),
        fetch("/api/golongan")
      ]);
      const jsonProp = await resProp.json()
      const jsonGol = await resGol.json()
      setData(Array.isArray(jsonProp) ? jsonProp : [])
      setGolonganList(Array.isArray(jsonGol) ? jsonGol : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setNamaProperti("")
    setGolonganId("")
    setBertingkat(false)
    setJumlahLantai("1")
    setKeterangan("")
    setKoordinat("")
    setGeojson("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setNamaProperti(item.namaProperti)
    setGolonganId(item.golonganId)
    setBertingkat(item.bertingkat)
    setJumlahLantai(item.jumlahLantai?.toString() || "1")
    setKeterangan(item.keterangan || "")
    setKoordinat(item.koordinat || "")
    setGeojson(item.geojson || "")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!namaProperti || !golonganId) {
      setDialogError("Nama Properti dan Golongan wajib diisi")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/properti/${currentId}` : "/api/properti"
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ 
          namaProperti, 
          golonganId, 
          bertingkat, 
          jumlahLantai: parseInt(jumlahLantai), 
          keterangan,
          koordinat,
          geojson
        }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Properti diperbarui" : "Properti ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/properti/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Properti berhasil dihapus")
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
          <h1 className="text-2xl font-bold tracking-tight">Properti</h1>
          <p className="text-sm text-slate-500">Kelola pendataan gedung, tanah, atau properti.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari properti..." 
            className="w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Properti
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Properti</TableHead>
              <TableHead>Golongan</TableHead>
              <TableHead>Bertingkat?</TableHead>
              <TableHead>Jumlah Lantai</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">Belum ada data</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaProperti.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.namaProperti}</TableCell>
                  <TableCell>{item.golongan?.namaGolongan}</TableCell>
                  <TableCell>{item.bertingkat ? "Ya" : "Tidak"}</TableCell>
                  <TableCell>{item.jumlahLantai}</TableCell>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Properti" : "Tambah Properti"}</DialogTitle>
            <DialogDescription>Masukkan detail identitas properti.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">Nama Properti</Label>
              <Input 
                id="nama" value={namaProperti} onChange={e => setNamaProperti(e.target.value)} 
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="golongan" className="text-right">Golongan</Label>
              <div className="col-span-3">
                <SearchableSelect 
                  options={golonganList.map((g: any) => ({ value: g.id, label: g.namaGolongan }))}
                  value={golonganId}
                  onChange={setGolonganId}
                  placeholder="Pilih Golongan..."
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bertingkat" className="text-right">Bertingkat?</Label>
              <div className="col-span-3 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="bertingkat" 
                  checked={bertingkat} 
                  onChange={e => setBertingkat(e.target.checked)} 
                  className="w-4 h-4"
                />
                <span className="text-sm">Ya, gedung ini bertingkat</span>
              </div>
            </div>
            {bertingkat && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jmlLantai" className="text-right">Jml Lantai</Label>
                <Input 
                  id="jmlLantai" type="number" min="1" value={jumlahLantai} onChange={e => setJumlahLantai(e.target.value)} 
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keterangan" className="text-right">Keterangan</Label>
              <Input 
                id="keterangan" value={keterangan} onChange={e => setKeterangan(e.target.value)} 
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="koordinat" className="text-right">Koordinat Peta</Label>
              <Input 
                id="koordinat" value={koordinat} onChange={e => setKoordinat(e.target.value)} 
                className="col-span-3" placeholder="-10.1633, 123.5855"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="geojson" className="text-right mt-2">GeoJSON Area</Label>
              <textarea 
                id="geojson" value={geojson} onChange={e => setGeojson(e.target.value)} 
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder='{"type": "Feature", ...}'
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
            <AlertDialogTitle>Hapus Properti?</AlertDialogTitle>
            <AlertDialogDescription>Data properti akan dihapus selamanya.</AlertDialogDescription>
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
