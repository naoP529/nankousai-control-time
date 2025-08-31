import Header from '@/components/global/header'
import Link from 'next/link'
import React from 'react'
import PageInner from './PageInner'
import BackTo from '@/components/global/back_button'

const Page = () => {
  return (
    <div className="">
      <Header />
      <PageInner/>
      <BackTo name={'トップへ'} link={'/'} />
    </div>

  )
}

export default Page