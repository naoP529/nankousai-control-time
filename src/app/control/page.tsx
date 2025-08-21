"use client"

import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import MiniClockArc from "../info/Circle/MiniClockArc"

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
  className="border border-slate-300 bg-white shadow-sm rounded-xl p-6 mb-6 hover:shadow-md transition-shadow duration-300"
        >
          <Link
            href={{
              pathname: "/control/edit",
              query: { name: item.className, id: item.id },
            }}
            className="block hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <div className="flex items-center justify-between gap-6">
              
              <div className="flex flex-col justify-center">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">{item.className}</h3>
                <p className="text-lg lg:text-xl text-gray-600 mt-1">
                  現在の待ち時間: <span className="font-medium text-blue-600">{item.waitTime}分</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <MiniClockArc minutes={item.waitTime} />
              </div>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  )
}