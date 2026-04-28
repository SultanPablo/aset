const fs = require('fs');
const path = require('path');

const items = [
  { dir: 'dashboard/kategori', title: 'Kategori' },
  { dir: 'dashboard/golongan', title: 'Golongan' },
  { dir: 'dashboard/properti', title: 'Properti' },
  { dir: 'dashboard/lantai', title: 'Lantai' },
  { dir: 'dashboard/ruangan', title: 'Ruangan' },
  { dir: 'dashboard/inventaris', title: 'Inventaris' },
  { dir: 'dashboard/kendaraan', title: 'Kendaraan' },
  { dir: 'dashboard/sertifikat', title: 'Sertifikat Tanah' },
  { dir: 'dashboard/peta', title: 'Peta Geolocation' },
  { dir: 'dashboard/mutasi', title: 'Riwayat Mutasi' },
  { dir: 'dashboard/maintenance', title: 'Maintenance' },
  { dir: 'dashboard/penghapusan', title: 'Penghapusan' },
  { dir: 'login', title: 'Login' },
  { dir: 'signup', title: 'Pendaftaran' },
  { dir: 'detail/inventaris/[id]', title: 'Detail Inventaris' },
  { dir: 'detail/kendaraan/[id]', title: 'Detail Kendaraan' },
  { dir: 'detail/ruangan/[id]', title: 'Detail Ruangan' }
];

items.forEach(item => {
    const layoutPath = path.join(__dirname, 'app', item.dir.replace(/\//g, path.sep), 'layout.tsx');
    const content = `import { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "${item.title}",\n};\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <>{children}</>;\n}\n`;
    fs.mkdirSync(path.dirname(layoutPath), { recursive: true });
    fs.writeFileSync(layoutPath, content);
});
console.log('Layouts metadata applied successfully.');
