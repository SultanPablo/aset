import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Mutasi",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
