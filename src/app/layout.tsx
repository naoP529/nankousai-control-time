import type { Metadata } from "next";
import { Kiwi_Maru } from "next/font/google";
import "./globals.css";



const kiwi_Maru = Kiwi_Maru({weight:["300","400","500"], subsets:["latin"]})

export const metadata: Metadata = {
  title: "待ち時間更新ページ",
  description: "待ち時間の更新ができます",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>編集ページ</title>
      </head>

      <body
        className={`${kiwi_Maru.className}`}
      >
        {children}
      </body>
    </html>
  );
}
