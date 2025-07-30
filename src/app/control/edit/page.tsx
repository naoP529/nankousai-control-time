import React, { Suspense } from 'react'
import PageInner from './PageInner'

const page = () => {
  return (
    <Suspense>
      <PageInner></PageInner>
    </Suspense>
  )
}

export default page