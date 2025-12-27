import type { Metadata } from "next";
import "./globals.css";
import { SpectrumProvider } from "@/components/SpectrumProvider";

export const metadata: Metadata = {
  title: "SIBIMA - Sistem Bimbingan Mahasiswa",
  description: "Platform terintegrasi untuk manajemen bimbingan akademik mahasiswa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <SpectrumProvider>
          {children}
        </SpectrumProvider>
      </body>
    </html>
  );
}
