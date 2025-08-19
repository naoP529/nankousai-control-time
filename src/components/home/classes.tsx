'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import ExplanationClasses from './ExplanationClasses'
type ClassData ={
  id:number,
  className:string
}
const Classes: React.FC = () => {
  const [classNames, setClassNames] = useState<ClassData[]>([])

  const compare = (a: ClassData, b: ClassData) => a.className.localeCompare(b.className)

  const getClassNames = async () => {
    const { data, error } = await supabase
      .from('contents')
      .select('className,id')
    if (error || !data) {
      alert('データの取得に失敗しました')
      return
    }
    const tmp = data as ClassData[]
    const sorted = tmp.sort(compare)
    setClassNames(sorted)
  }

  useEffect(() => {
    getClassNames()
  }, [])

  return (
    
    <section id='class-list' className=" relative min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12">
      <ExplanationClasses></ExplanationClasses>
      <div className=" relative z-10 w-full max-w-4xl bg-gradient-to-br   from-[#05a8bd]/60   via-[#05bd92]/60   to-[#f3e50a]/60 backdrop-blur-md rounded-xl p-8 mt-3">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          クラス一覧
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classNames.map((value, idx) => (
            <Link
              key={idx}
              href={{
                pathname: '/control/edit',
                query: {name:value.className ,id:value.id },
              }}
              className=" text-center text-white text-xl underline decoration-white decoration-2 hover:opacity-60 transition  duration-300"
            >
              {value.className}へ
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Classes