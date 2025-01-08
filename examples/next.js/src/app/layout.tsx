import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Algorand-Rust-FFI",
  description: "Experiments with Algorand and Rust FFI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
