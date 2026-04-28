import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ruangan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
