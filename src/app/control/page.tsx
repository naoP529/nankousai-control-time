"use client"

import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import React, { useEffect, useState } from "react"

type ClassInfo = {
  className: string
  id: number
  waitTime: number
}

export default function Page() {
  const [data, setData] = useState<ClassInfo[]>()

  useEffect(() => {
    async function fetchData() {
      const { data: names, error } = await supabase
        .from("contents")
        .select("className,id,waitTime")

      if (error || !names) {
        alert("データ取得エラー")
        return
      }

      
      const getRank = (name: string) =>
        name.includes("中学") ? 0 : name.includes("高校") ? 1 : 2

      //中学→高校→その他
      const sorted = (names as ClassInfo[]).sort((a, b) => {
        const ra = getRank(a.className)
        const rb = getRank(b.className)
        if (ra !== rb) return ra - rb
        return a.className.localeCompare(b.className, "ja")
      })

      setData(sorted)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
      <div className="my-6">
        {data?.map((item) => (
        <div
          key={item.id}
          className="border-2 border-slate-400 bg-white shadow-md rounded-lg p-8 mb-6 hover:shadow-lg transition-shadow"
        >
          <Link
            href={{
              pathname: "/control/edit",
              query: { name: item.className, id: item.id },
            }}
            className="block"
          >
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {item.className}
              </h3>
              <p className="text-base text-gray-600">
                現在の待ち時間: {item.waitTime}分
              </p>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  )
}