"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const PageInner = () => {
    const [bgImage,setBgImage] = useState<string>()
  return (
    <>
          <div className=" z-50 grid  sm:grid-cols-2 md:grid-cols-4 lg:flex lg:justify-center gap-6 mt-12 transition duration-500">
              {[
                { href: "/info/Line", label: "📈 折れ線グラフ",image:"/線グラフ.png" },
                { href: "/info/Bar", label: "📊 棒グラフ",image:"/棒グラフ.png" },
                { href: "/info/Circle", label: "🟠 円グラフ",image:"/円グラフ.png" },
                { href: "/info/Ad", label: "📰 広告",image:"/AD.png" },
              ].map(({ href, label,image}) => (
              <div
                key={href}
                className="group flex w-[15vw] h-[15vw] bg-slate-50/30 backdrop-blur-md hover:bg-slate-50  border-slate-50 rounded-2xl shadow-lg justify-center items-center p-2 opacity-90 hover:opacity-100 transition-all duration-300 hover:h-[20vw] hover:w-[20vw] overflow-hidden"
                onMouseEnter={()=>setBgImage(image)}
                onMouseLeave={()=>setBgImage("")}
              >
                <Link href={href} className="z-10 text-center font-semibold">
                  {label}
                </Link>

              </div>


              ))}
            </div>
          <div
              className="-z-10 fixed top-20 left-0 w-screen h-screen bg-cover bg-center opacity-50 transition-opacity duration-300 blur-sm"
              style={{ backgroundImage: `url('${bgImage}')` }}
              key={bgImage}
            />
    </>
  )
}

export default PageInner