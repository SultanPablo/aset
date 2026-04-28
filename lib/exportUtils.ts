import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"

type ExportFormat = "csv" | "excel" | "pdf"

interface ExportOptions {
  filename: string
  format: ExportFormat
  title?: string
  columns: { header: string; key: string }[]
  data: any[]
}

export function exportData({ filename, format, title, columns, data }: ExportOptions) {
  // Build raw rows array
  const rows = data.map((item) => {
    const rowObj: Record<string, any> = {}
    columns.forEach((col) => {
      // support nested keys e.g. "golongan.namaGolongan"
      const val = col.key.split('.').reduce((acc, part) => acc && acc[part], item)
      rowObj[col.header] = val !== undefined && val !== null ? val : "-"
    })
    return rowObj
  })

  if (format === "csv") {
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const csvContent = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } 
  else if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  } 
  else if (format === "pdf") {
    const doc = new jsPDF()
    if (title) {
      doc.setFontSize(14)
      doc.text(title, 14, 15)
    }
    
    const tableColumns = columns.map(c => c.header)
    const tableRows = rows.map(r => columns.map(c => r[c.header]))

    // @ts-ignore
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: title ? 22 : 14,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 58, 138] }, // Biru Tua #1E3A8A
    })
    
    doc.save(`${filename}.pdf`)
  }
}
