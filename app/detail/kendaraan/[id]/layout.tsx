import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Kendaraan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
