import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properti",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
