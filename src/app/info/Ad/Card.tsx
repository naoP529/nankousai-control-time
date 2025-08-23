"use client"
import { skeleton, toBase64 } from '@/components/global/skeleton'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { IoTimeOutline } from 'react-icons/io5'
import { MdOutlinePlace } from 'react-icons/md'
import ScrollContainer from 'react-indiana-drag-scroll'
import ClockArc from '../Circle/ClockArc'
import Image from 'next/image';
import { KaiseiDecol } from '@/fonts'
import MiniClockArc from '../Circle/MiniClockArc'
type Event ={
    className:string,
    title:string,
    place:string,
    time:string[],
    comment:string,
    backImg:string,
    frontImg:string,
    types:string[],
    waitTime:number,
    tagline:string,//キャッチコピー
    content:string,
}
type Props ={
    data:Event,
    life:number
}
const kaiseiDecol = KaiseiDecol
const Card = ({data,life}:Props) => {
        const Tags = [
        {id:"tenji", name:"展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"food", name:"フード", color:"from-orange-400 via-orange-400 to-yellow-400"},
        {id:"class", name:"クラス展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"club", name:"部活動展示", color:"from-blue-500 via-indigo-500 to-purple-500"},
        {id:"junior", name:"中学", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"high", name:"高校", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"act", name:"体験", color:"from-green-300 via-teal-400 to-cyan-500"},
        {id:"live", name:"ライブ", color:"from-purple-300 via-fuchsia-400 to-pink-400"},
        {id:"perform", name:"パフォーマンス", color:"from-blue-400 via-sky-300 to-sky-200"},
        {id:"attraction", name:"アトラクション", color:"from-red-200 via-purple-400 to-blue-500"},
        {id:"shopping", name:"ショッピング", color:"from-red-200 to-purple-400"},
        {id:"horror", name:"ホラー", color:"from-red-500 to-rose-300"},
        {id:"cafe", name:"食堂", color:"from-orange-400 via-orange-400 to-yellow-400"},
        {id:"pta", name:"PTA", color:"from-yellow-300 via-lime-400 to-green-400"},
        {id:"rest", name:"休憩", color:"from-cyan-500 to-yellow-300"},
        {id:"j-1", name:"中学1年", color:" from-yellow-300  to-amber-400"},
        {id:"j-2", name:"中学2年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"j-3", name:"中学3年", color:"from-sky-400 via-blue-400 to-indigo-400"},
        {id:"h-1", name:"高校1年", color:"from-yellow-300 to-amber-400"},
        {id:"h-2", name:"高校2年", color:"from-pink-300 via-rose-400 to-red-400"},
        {id:"h-3", name:"高校3年", color:"from-sky-400 via-blue-400 to-indigo-400" },
        {id:"other", name:"その他", color:"from-sky-600 to-sky-200"},
    ]
    const rectRef = useRef<SVGRectElement>(null)

    useEffect(() => {
      const rect = rectRef.current
      if (rect) {
        rect.style.transition = 'none'
        rect.style.strokeDashoffset = '496' // 初期化
    
        requestAnimationFrame(() => {
          rect.style.transition = `stroke-dashoffset ${life}s ease-out`
          rect.style.strokeDashoffset = '0' // アニメーション開始
        })
      }
    }, [data])
    const setTextColor = (e:string[]) => {
        let result = ""


        if(e.includes("フード")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-orange-400 via-orange-400 to-yellow-400"
            return result
        }
        
        if(e.includes("ライブ")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-purple-300 via-fuchsia-400 to-pink-400"
            return result
        }

        if(e.includes("パフォーマンス")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-blue-500 via-sky-300 to-sky-200"
            return result
        }

        if(e.includes("アトラクション")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-red-300 via-purple-400 to-blue-500"
            return result
        }

        if(e.includes("体験")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-green-500 via-teal-400 to-cyan-500"
            return result
        }

        if(e.includes("休憩")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-cyan-500 to-yellow-300"
            return result
        }

        if(e.includes("PTA")) {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-yellow-400 via-lime-400 to-green-400"
            return result
        }

        if(e.includes("クラス展示") || e.includes("部活動展示")){
            result = "bg-gradient-to-br bg-clip-text text-transparent from-blue-500 via-indigo-500 to-purple-500"
            return result
        }

        if(result == "") {
            result = "bg-gradient-to-br bg-clip-text text-transparent from-sky-600 to-sky-100 "
        } 

        return result
    }
  return (
    <div className="relative  w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] aspect-[4/5] sm:aspect-[5/4] lg:aspect-[16/9] bg-white/30 backdrop-blur-md border-white/40 shadow-xl rounded-[50px] z-20 ">
        <svg viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-50">
            <defs>
              <linearGradient id="rectStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(61, 200, 194, 1)" />
                <stop offset="30%" stopColor='rgba(206, 216, 0, 1)'/>
                <stop offset="74%" stopColor="rgba(255, 174, 68, 1)" />
                <stop offset="100%" stopColor="rgba(234, 114, 0, 1)" />
              </linearGradient>
            </defs>

            <rect
              ref={rectRef}
              x="0.5"
              y="0.5"
              width="159"
              height="89"
              rx="5"
              ry="5"
              stroke="url(#rectStrokeGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="496"
              strokeDashoffset="496"
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center z-10">
            {data &&
            
            
            
            <div className="flex w-full h-full p-10 ">
            <div className="basis-[60%] bg-slate-100 p-6 rounded-l-xl  space-y-4">
                <div className={`text-4xl text-gray-500 tracking-wide ${setTextColor(data.types)}`}>{data.className}</div>
                <div className={`text-6xl font-bold text-gray-800 ${KaiseiDecol.className}`}>{data.title}</div>

                <div className="flex flex-nowrap gap-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <MdOutlinePlace className="text-blue-500 text-lg" />
                      <span className="text-4xl">{data.place}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <IoTimeOutline className="text-blue-500 text-lg" />
                        <span className="text-4xl">
                            {data.time.map((value,i)=>(
                                <span key={i} className='pl-1'>
                                    {value}
                                </span>
                            ))}
                        </span>
                    </div>
                </div>
                <div className='flex gap-4'>
                    {data.types.map((value,i)=>(
                        <div key={i}className={`py-3 px-2 min-w-40 bg-gradient-to-br ${
                                          Tags.find((item) => item.name === value)?.color ??
                                          "bg-gradient-to-r from-pink-500 to-pink-300"
                                        }  text-white  rounded-md flex items-center justify-center opacity-90 `}>
                            <p className="m-auto text-base  text-gray-50 font-medium">{value}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-1"> 
                    <div className={`text-5xl font-semibold text-gray-700 ${KaiseiDecol.className}` }>{data.tagline}</div>
                    <div className="ml-[2vw] mr-[3vw] my-[3vw] text-[4vw] lg:ml-4 lg:mr-6 lg:text-2xl lg:my-5 lg:leading-[150%] text-[#00b2b5] font-light tracking-[-0.01rem]  opacity-80 leading-[160%] text-justify">
                        <p className="whitespace-pre-line"> &ensp;{data.content}</p>
                     </div>
                </div>
            </div>
            <div className="basis-[40%] bg-slate-100 p-6 rounded-r-xl shadow-md space-y-6">
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <Image
                  src={`${data.frontImg}`}
                  alt="紹介画像"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>

              
              <div className="flex justify-center w-full ">
                <div className='hidden md:block'>
                    <ClockArc minutes={data.waitTime} />
                </div>
                <div className='block md:hidden'>
                    <MiniClockArc minutes={data.waitTime} />
                </div>
              </div>
            </div>
            </div>
            }
        </div>
    </div>

  )
}

export default Card