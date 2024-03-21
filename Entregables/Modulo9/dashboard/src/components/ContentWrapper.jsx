import React from 'react'
import { Topbar } from './Topbar'
import { Footer } from './Footer'
import { Contentrowtop } from './Contentrowtop'
export const Contentwrapper = () => {
  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content">
        <Topbar/>
        <Contentrowtop/>
        <Footer/>
      </div>
    </div>
  )
}