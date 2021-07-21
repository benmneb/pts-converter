import React from 'react'

import { get } from 'lodash'

import ptsData from '../data/pts_lookup.json'
import { ResultCard } from '../components'

export default function Results(props) {
  const { multiEdRes, book, division, page } = props;

  const finalResult = 
    multiEdRes ? multiEdRes : get(ptsData, `${book}.${division}.${page}`, null) ||
    get(ptsData, `${book}.${page}`, null)

  console.log('final result', finalResult)

  if (finalResult === null) {
    return null
  }

  return finalResult.flat().length > 2 
    ? finalResult.map((res) => (
        <ResultCard key={res} data={res} />
      ))
    : <ResultCard data={finalResult.flat()} />
}
