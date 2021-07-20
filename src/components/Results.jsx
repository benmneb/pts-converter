import React, { Component } from 'react'

import { get as gv } from 'lodash'

import ptsData from '../data/pts_lookup.json'
import { ResultCard } from '../components'

export default class Results extends Component {
  render() {
    const { multiEdRes, book, division, page } = this.props;

    const finalResult = 
      multiEdRes ? multiEdRes : gv(ptsData, `${book}.${division}.${page}`, null) ||
      gv(ptsData, `${book}.${page}`, null)

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
}
