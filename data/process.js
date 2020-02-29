const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');
const cheerio = require('cheerio');
const naturalSort = require('natural-sort');

const DATA_DIR = './sc-data';
const MARKER_CLASSES = ['sc', 'pts', 'ms'];

const NUM_ROMAN = {
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

const ABBREVS_SC = {
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
  an: 'AN',
  dn: 'DN',
  mn: 'MN',
  sn: 'SN'
};

// build mapping for PTS marks containing ranges
// of different types of marks. I.e.
let RESULT = {};

const extractBookName = (filename) => {
  const basename = path.basename(filename);

}

glob(`${DATA_DIR}/html_text/pli/**/*.html`, (err, files) => {
  if (err) {
    throw err;
    process.exit(1);
  }

  let currentPTSId = null;
  files
    .sort(naturalSort())
    .map(filename => {
      const $ = cheerio.load(fs.readFileSync(filename));

      const suttaId = $('section.sutta').attr('id')

      if (!suttaId) return console.log('No ID HERE', file)

      $('body')
        .find('.sutta > article > p')
        .each((i, e) => {
          let nonPTSMarker = [];
          let ptsMarker = null;

          $(e)
            .find('a')
            .filter((i, e) => MARKER_CLASSES.indexOf($(e).attr('class')) >= 0)
            .each((i, e2) => {
              const e2Class = $(e2).attr('class');

              if (e2Class === 'pts') {
                ptsMarker = e2;
              } else {
                nonPTSMarker.push(e2);
              }
            });

          if (ptsMarker) {
            const nextPTSId = $(ptsMarker).attr('id');

            RESULT[nextPTSId] = {};

            // first set the starting position of all abbrevs ("ms", "sc", etc.) for this pts position
            // to the last one of the previous caught pts position (if possible). I.e:
            //
            //
            // ms1 ----> ms2 ---> ms3 ----------> ms4
            // pts1 -------------------> pts2
            //
            // => pts2 is within scope of ms3. So first ms3 is marked as the first reference
            //    containing pts2. Because their positions are not euqal, set exactStart to false.
            if (currentPTSId) {
              _.entries(RESULT[currentPTSId]).map(([abbrev, data]) => {
                if (!data.last) {
                  return;
                }

                RESULT[nextPTSId][abbrev] = {
                  first: [suttaId, data.last],
                  last: [suttaId, data.last],
                  exactStart: false
                };
              });
            }

            // then initialize all abbrevs for this pts position
            // with the concomitanting ones. This will overwrite
            // existing data from previous lines with the correct
            // marks which start exactly at the same position as the
            // current pts mark does. I.e:
            //
            // ms1 ----> ms2 ---> ms3 ----------> ms4
            // pts1 ----------------------------> pts2
            //
            // => set first ms paragraph of pts2 to ms4 and exactStart to true
            nonPTSMarker.map((e3) => {
              const eId = $(e3).attr('id');
              const eClass = $(e3).attr('class');

              if (!RESULT[nextPTSId][eClass]) {
                RESULT[nextPTSId][eClass] = { suttaId };
              }

              RESULT[nextPTSId][eClass].first = [suttaId, eId];
              RESULT[nextPTSId][eClass].last = [suttaId, eId];
              RESULT[nextPTSId][eClass].exactStart = true;
            });

            currentPTSId = nextPTSId;
          } else if (currentPTSId) {
            // update last marks
            nonPTSMarker.map((e) => {
              const eId = $(e).attr('id');
              const eClass = $(e).attr('class');

              if (!RESULT[currentPTSId][eClass]) {
                // initialize new reference if not existing
                RESULT[currentPTSId][eClass] = {
                  first: [suttaId, eId],
                  last: [suttaId, eId],
                  exactStart: false
                };
              } else {
                RESULT[currentPTSId][eClass].last = [suttaId, eId];
              }
            });
          }
        });
    });

    // Create Mapping from text reference to pts id
    Object.keys(RESULT)
      .map(ptsId => {
        if (!RESULT[ptsId].sc) {
          return;
        }

        let book = suttaId.match(/[a-z]+/gi)[0]
      })

    fs.writeFileSync('out.json', JSON.stringify(RESULT));
});
