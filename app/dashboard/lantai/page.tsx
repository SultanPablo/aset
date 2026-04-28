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

export default function LantaiPage() {
  const [data, setData] = useState<any[]>([])
  const [propertiList, setPropertiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState("")
  
  const [namaLantai, setNamaLantai] = useState("")
  const [propertiId, setPropertiId] = useState("")
  
  const [dialogError, setDialogError] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resLan, resProp] = await Promise.all([
        fetch("/api/lantai"),
        fetch("/api/properti")
      ]);
      const jsonLan = await resLan.json()
      const jsonProp = await resProp.json()
      setData(Array.isArray(jsonLan) ? jsonLan : [])
      setPropertiList(Array.isArray(jsonProp) ? jsonProp : [])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setNamaLantai("")
    setPropertiId("")
    setDialogError("")
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setIsEditing(true)
    setCurrentId(item.id)
    setNamaLantai(item.namaLantai || "")
    setPropertiId(item.propertiId)
    setDialogError("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setDialogError("")
    if (!namaLantai || !propertiId) {
      setDialogError("Nama Lantai dan Properti wajib diisi")
      return
    }

    try {
      const method = isEditing ? "PUT" : "POST"
      const url = isEditing ? `/api/lantai/${currentId}` : "/api/lantai"
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ namaLantai, propertiId }),
        headers: { "Content-Type": "application/json" }
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Gagal menyimpan")

      toast.success(isEditing ? "Lantai diperbarui" : "Lantai ditambahkan")
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setDialogError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/lantai/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal menghapus")
      
      toast.success("Lantai berhasil dihapus")
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
          <h1 className="text-2xl font-bold tracking-tight">Lantai</h1>
          <p className="text-sm text-slate-500">Kelola lantai yang dimiliki oleh sebuah properti.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="search" 
            placeholder="Cari lantai..." 
            className="w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Lantai
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lantai</TableHead>
              <TableHead>Properti</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center h-24">Memuat data...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center h-24 text-slate-500">Belum ada data</TableCell></TableRow>
            ) : (
              data.filter((i:any) => i.namaLantai?.toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.namaLantai}</TableCell>
                  <TableCell>{item.properti?.namaProperti}</TableCell>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Lantai" : "Tambah Lantai"}</DialogTitle>
            <DialogDescription>Tambahkan lantai untuk didaftarkan pada properti tertentu.</DialogDescription>
          </DialogHeader>
          
          {dialogError && (
            <Alert variant="destructive">
              <AlertDescription>{dialogError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">Nama Lantai</Label>
              <Input 
                id="nama" value={namaLantai} onChange={e => setNamaLantai(e.target.value)} 
                className="col-span-3" placeholder="Misal: Lantai 1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="properti" className="text-right">Properti</Label>
              <div className="col-span-3">
                <SearchableSelect 
                  options={propertiList.map((p: any) => ({ value: p.id, label: p.namaProperti }))}
                  value={propertiId}
                  onChange={setPropertiId}
                  placeholder="Pilih Properti..."
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
            <AlertDialogTitle>Hapus Lantai?</AlertDialogTitle>
            <AlertDialogDescription>Data lantai beserta relasinya terhadap ruangan terkait kemungkinan gagal/terhapus.</AlertDialogDescription>
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
