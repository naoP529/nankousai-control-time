"use client"
import React from 'react'
import LineChart from '../components/LineChart'
import BackTo from '@/components/global/back_button'

const Chart = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
        
        <LineChart/>
        <BackTo name='グラフ一覧' link={"/chart"}></BackTo> 
    </div>
  )
}

export default Chart