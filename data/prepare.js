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

const ptsAbbrevs = {
  ds: 'Dhs',
  kv: 'Kv',
  pp: 'Pp',
  vb: 'Vib',
  bv: 'Bv ',
  cnd: 'Nidd II',
  cp: 'Cp',
  dhp: 'Dhp',
  iti: 'It',
  ja: 'Ja',
  mil: 'Mil',
  mnd: 'Nidd I',
  ne: 'Nett',
  ps: 'Patis',
  pv: 'Pv',
  snp: 'Sn',
  thag: 'Th',
  thig: 'Thi',
  ud: 'Ud',
  vv: 'Vv',
  an: 'A',
  dn: 'D',
  mn: 'M',
  sn: 'S'
}

const addToData = ($,t,suttaId) => {
  let book = suttaId.match(/[a-z]+/gi)[0] // TODO: nomralize correct an => A
  book = typeof ptsAbbrevs[book] !== 'undefined'
    ? ptsAbbrevs[book]
    : book
  const cls = $(t).attr('class')
  if (cls && cls !== 'pts' && cls !== 'pts-vp-pli') book += ` (${cls.replace('pts', '')})`

  let number = $(t).attr('id').replace(cls, '')

  /* if (book.toLowerCase().startsWith('dhp')) {
    if (_.get(dataLookup, `${book}`, null) === null) {
      _.set(dataLookup, `${book}`, {})
    }
    console.log('HERE', number)
    _.set(dataLookup, `${book}.${number}`, [suttaId, $(t).attr('id')])
    return
  } */

  if (number.includes('.')) {
    const div = toRoman['i' + number.split('.')[0]]
    const num = parseInt(number.split('.')[1])

    if (isNaN(num)) console.log('NAN', $(t).attr('id'))

    _.set(dataLookup, `${book}.${div}.${num}`, [suttaId, $(t).attr('id')])
  } else {
    number = parseInt(number)

    if (isNaN(number)) console.log('NAN', $(t).attr('id'))

    _.set(dataLookup, `${book}.${number}`, [suttaId, $(t).attr('id')])
  }
}

glob('../sc-data/po_text/pli-en/**/*.po', (err, files) => {
  if (err) console.log(err)
  files.map(file => PO.load(file, (err, po) => {
    if (err) console.log(err)

    po.items.map(item => {
      const ptsComment = item.extractedComments
        .filter(c => c.includes('pts-vp-pli') || c.includes('pts1ed') || c.includes('pts2ed'))
        .map(x => {
          const $ = cheerio.load(x)
          let pts = $('a.pts-vp-pli')

          if (pts.length === 0) {
            pts = $('a.pts1ed')
          }

          if (pts.length === 0) {
            pts = $('a.pts2ed')
          }

          const suttaId = item.msgctxt.split(':')[0]

          if (pts.attr('id') === undefined) {
            return // TODO: what here?
            // console.log(item.msgctxt)
            // pts = ptsComment[0].match(/(?<=pts-vp-pl)i\d+\.\d+/gi)[0]
          }

          addToData($, pts, suttaId)
        })
    })
  }))
})

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

  setTimeout(() => {
    fs.writeFileSync('src/data/pts_lookup.json', JSON.stringify(dataLookup))
    Object
      .keys(dataLookup)
      .sort()
      .map(b => {
        if (dataLookup[b] instanceof Array) {
          dataStructure[b] = { '': dataLookup[b].length }
        } else {
          Object
            .keys(dataLookup[b])
            .map(c => _.set(dataStructure, `${b}.${c}`, dataLookup[b][c].length))
        }
      })
    fs.writeFileSync('src/data/pts_structure.json', JSON.stringify(dataStructure))
  }, 15 * 1000)
})
