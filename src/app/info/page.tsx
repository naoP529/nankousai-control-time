import Header from '@/components/global/header'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
        <Header></Header>
        <Link href={"/info/Line"}>折れ線グラフ</Link>
        <Link href={"/info/Bar"}>棒グラフ</Link>
        <Link href={"/info/Circle"}>円グラフ</Link>
    </div>
  )
}

export default Page