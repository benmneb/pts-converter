const glob = require('glob')
const PO = require('pofile')
const cheerio = require('cheerio')
const _ = require('lodash')
const fs = require('fs')
const dataLookup = {
}

const toRoman = {
  'i': 'i',
  'i1': 'i',
  'i2': 'ii',
  'i3': 'iii',
  'i4': 'iv',
  'i5': 'v',
  'i6': 'vi',
  'i7': 'vii',
  'i8': 'viii',
  'i9': 'ix',
  'i10': 'x'
}

glob('../sc-data/po_text/pli-en/**/*.po', (err, files) => {
  if (err) console.log(err)
  files.map(file => PO.load(file, (err, po) => {
    if (err) console.log(err)

    po.items.map(item => {
      const ptsComment = item.extractedComments.filter(c => c.includes('pts-vp-pl'))

      if (ptsComment.length > 1) console.log('WHAT IS HAPPENINGT?')
      if (ptsComment.length > 0) {
        let pts = cheerio.load(ptsComment[0])('a.pts-vp-pli').attr('id')
        const ptsBook = item.msgctxt.match(/^[a-z]+/gi)[0]
        const chapter = item.msgctxt.split(':')[0]

        if (pts !== undefined) {
          pts = pts.replace('pts-vp-pl', '')
          const ptsDiv = pts.split('.')[0]
          const ptsNum = pts.split('.')[1]
          if(toRoman[ptsDiv] === undefined) console.log(ptsComment)
          _.set(dataLookup, `${ptsBook}.${toRoman[ptsDiv]}.${ptsNum}`, item.msgctxt.replace(ptsBook, ''))
        } else {
          // TODO
        }
      }
    })
  }))
})

setTimeout(() => {
  fs.writeFileSync('pts_lookup.json', JSON.stringify(dataLookup))
  const structure = { l1: Object.keys(dataLookup), l2: {}, l3: {} }
  structure.l1.map(x => structure.l2[x] = Object.keys(dataLookup[x]).length)
  Object.entries(structure.l2).map((k,v) => structure.l3[])
}, 15 * 1000)
