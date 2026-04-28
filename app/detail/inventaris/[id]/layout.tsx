import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Inventaris",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
