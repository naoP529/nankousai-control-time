import Headers from "@/components/global/header"
import Welcome from "@/components/home/welcome";
import Classes from "@/components/home/classes";
export const metadata ={
    title: '南高待ち時間更新サイトです。',
  description: '南高待ち時間更新サイトです。Supabase × Next.js で作ったアプリです。',
  openGraph: {
    title: '南高待ち時間更新用ページ',
    description: '南高待ち時間更新サイトです',
    url: '',
    siteName: '待ち時間更新サイト',
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