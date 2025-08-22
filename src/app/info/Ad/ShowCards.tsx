import React, { Suspense, useEffect, useState } from 'react'
import Card from './Card'
import { BiChevronsLeft, BiChevronsRight } from 'react-icons/bi'

type Event = {
  className: string
  title: string
  place: string
  time: string[]
  comment: string
  backImg: string
  frontImg: string
  types: string[]
  waitTime: number
  tagline: string
  content: string
}

type Props = {
  eventRef: ReturnType<typeof React.useRef<Event[]>>
}

const ShowCards = ({ eventRef }: Props) => {
  const [tarIndex, setTarIndex] = useState(0)

  const events = eventRef.current ?? []
  const len = events.length

  const backIndex = () => {
    setTarIndex((prev) => (prev === 0 ? len - 1 : prev - 1))
  }

  const forwardIndex = () => {
    setTarIndex((prev) => (prev === len - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const timer = setTimeout(forwardIndex, 9800)
    return () => clearTimeout(timer)
  }, [tarIndex, len])

  const currentCard = events[tarIndex];

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        {currentCard && <Card key={tarIndex} data={currentCard} life={10} />}
      </Suspense>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={backIndex}
          className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition"
          aria-label="Back"
        >
          <BiChevronsLeft className="text-6xl text-blue-500" />
        </button>
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={forwardIndex}
          className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition"
          aria-label="Forward"
        >
          <BiChevronsRight className="text-6xl text-blue-500" />
        </button>
      </div>
    {currentCard?.backImg && 
    <>
    <div className={`fixed w-screen h-screen  bg-cover bg-center ` }  style={{ backgroundImage: `url(${currentCard.backImg || "1725741490270.jpg"})` }}
>
    </div>
    <div className='fixed w-screen h-screen bg-black/40'></div>
    </>
    }
    </div>
  )
}

export default ShowCards