const glob = require('glob')
const PO = require('pofile')
const cheerio = require('cheerio')
const _ = require('lodash')
const fs = require('fs')
const dataLookup = {}
const dataStructure = {}

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

        if (pts === undefined) {
          return // TODO: what here?
          // console.log(item.msgctxt)
          // pts = ptsComment[0].match(/(?<=pts-vp-pl)i\d+\.\d+/gi)[0]
        }

        const ptsBook = item.msgctxt.match(/^[a-z-]+/gi)[0].replace('pli-tv-', '')
        let pts2 = pts.replace('pts-vp-pl', '')
        const ptsDiv = pts2.split('.')[0]
        const ptsNum = pts2.split('.')[1]
        if(toRoman[ptsDiv] === undefined) console.log(ptsComment)

        const newEntry = [item.msgctxt.split(':')[0], pts]
        _.set(dataLookup, `${ptsBook}.${toRoman[ptsDiv]}.${ptsNum}`, newEntry)
      }
    })
  }))
})

const addToData = ($,t,suttaId) => {
  let book = suttaId.match(/[a-z]+/gi)[0] // TODO: nomralize correct an => A
  const cls = $(t).attr('class')
  if (cls && cls !== 'pts') book += ` (${cls.replace('pts', '')})`
  let number = parseInt($(t).attr('id').replace(cls, ''))

  _.set(dataLookup, `${book}.${number}`, [suttaId, $(t).attr('id')])
}

glob('../sc-data/html_text/pli/**/*.html', (err, files) => {
  files.map(file => {
    let fileBase = file.split('/')
    fileBase = fileBase[fileBase.length-1]

    const $ = cheerio.load(fs.readFileSync(file))
    const suttaId = $('section.sutta').attr('id')

    if (!suttaId) console.log('No ID HERE', file)

    $('article').find('.pts').map((_,t) => addToData($,t, suttaId))
    $('article').find('.pts1ed').map((_,t) => addToData($,t, suttaId))
    $('article').find('.pts2ed').map((_,t) => addToData($,t, suttaId))
  })
})

setTimeout(() => {
  fs.writeFileSync('src/data/pts_lookup.json', JSON.stringify(dataLookup))
  Object.keys(dataLookup).map(b => Object.keys(dataLookup[b]).map(c => _.set(dataStructure, `${b}.${c}`, dataLookup[b][c].length)))
  fs.writeFileSync('src/data/pts_structure.json', JSON.stringify(dataStructure))
}, 15 * 1000)
