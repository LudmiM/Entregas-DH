import React from 'react'
import { GenresInDb } from './GenresInDb'
import { ContentRowMovies } from './ContentRowMovies'

export const Contentrowtop = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">App Dashboard</h1>
      </div>
      <ContentRowMovies/>
      <GenresInDb/>
    </div>

  )
}