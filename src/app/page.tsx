import Link from "next/link";
import Headers from "@/components/global/header"
import Welcome from "@/components/home/welcome";
import Classes from "@/components/home/classes";
export const metadata ={
    title: '南高校祭編集用ページです',
  description: '南高校祭編集用ページです。Supabase × Next.js で作ったアプリです。',
  openGraph: {
    title: '南高校祭編集用ページ',
    description: '南高校祭編集用ページです。',
    url: '',
    siteName: '南高校祭編集用ページ',
    images: [
      {
        url: '/70周年ロゴB.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },

  }
export default function Home(){

  return(
    <div>
      <Headers></Headers>
      <Welcome/>
      <div>
        <Classes></Classes>
      </div>
    </div>
  )
}