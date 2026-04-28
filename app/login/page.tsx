"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal login")
      }

      toast.success("Login berhasil!")
      router.push("/dashboard/kategori")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex bg-slate-50 dark:bg-background min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-card shadow-xl rounded-2xl border border-blue-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">SirajAset</h1>
          <p className="text-sm text-slate-500">Silakan masuk ke akun Anda</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nama@contoh.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Belum punya akun? <Link href="/signup" className="text-primary font-medium hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
