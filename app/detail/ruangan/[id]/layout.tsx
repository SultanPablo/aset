import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Ruangan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
