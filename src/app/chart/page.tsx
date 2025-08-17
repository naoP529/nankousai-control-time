"use client"
import React from 'react'
import LineChart from './components/LineChart'

const Chart = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-[min(15vw,80px)] h-screen bg-white md:pt-[13vw]  lg:pt-[min(15vw,80px)]">
        
        <LineChart/>
    </div>
  )
}

export default Chart