import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ヤングケアラーSNS",
  description: "名称未定のヤングケアラー支援SNS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
