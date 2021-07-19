import React, { useState } from 'react';

import {
  Card,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FilledInput,
  FormHelperText
} from '@material-ui/core'

import { get as gv, isArray } from 'lodash'

import './App.css';
import ptsData from './data/pts_lookup.json'
import ResultCard from './ResultCard';

function hasMoreThanOne(array, what) {
  let indexes = [];
  for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
          indexes.push(i)
      }
  }
  return indexes;
}

export default function App() {
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedDiv, setSelectedDiv] = useState('')
  const [selectedNum, setSelectedNum] = useState('')
  const [text, setText] = useState('')
  const [isError, setIsError] = useState(false)
  const [multipleEditionResults, setMultipleEditionResults] = useState(null)


  // handleChange = event => {
  //   this.setState({ [event.target.name]: event.target.value });
  // }

  function handleSubmit(e) {
    e.preventDefault();
    const input = text.trim().split(/\s+/);
    const book = input[0];
    const division = input[1]; // this refers to page number for books that have no division
    const page = input[2]

    // check if book has multiple editions and return all of them that apply
    if (Object.keys(ptsData).filter((eachBook) => eachBook.includes(`${book} (`)).length > 0) {
      console.log('more than one')
      // get indexes of all book editions
      const indexes = hasMoreThanOne(Object.keys(ptsData).map(key => key.split(/\s+/)[0]), book);
      console.log('indexes', indexes)
      // return data from those indexes in ptsData and put in new object
      const indexesData = {...indexes.map(index => Object.values(ptsData)[index])};
      // get the required info from this new object instead of whole ptsData
      const bothResults = Object.keys(indexesData).map((ed) => 
        gv(indexesData, `${ed}.${division}.${page}`, null) || 
          gv(indexesData, `${ed}.${division}`, null))
          
      console.log('ptsData', ptsData)
      console.log('indexesdata', indexesData)
      console.log('bothResults', bothResults)
      
      if (bothResults.every((elem) => elem === null)) {
        console.warn('results both null')
        return setIsError(true)
      }
          
      // filter out null results (when only one edition has that page)
      const results = bothResults.filter((result) => result !== null && result.length <= 2)
      console.log('results', results)

      return (
        setText(input.join(' ')),
        setIsError(false),
        setMultipleEditionResults(results)
      )
    }
      console.log('only one')

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      console.log('this book has no divisions')
      
      // number reference is out of range ('division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        setIsError(true)
        return console.warn('please enter a correct page number reference')
      }
      
      // else all is good!
      return (
        setSelectedBook(book),
        setSelectedDiv(''),
        setSelectedNum(division),
        setText(input.join(' ')),
        setIsError(false),
        setMultipleEditionResults(null)
      )
    }

    // book has divisions
    console.log('has divisions')
    // general error: there arent 3 whitespace seperated values in textfield
    // if (page === undefined) {
    //   setIsError(true)
    //   return console.log('please enter correctly')
    // }

    // book reference is incorrect
    if (!ptsData[book]) {
      setIsError(true);
      return console.warn('please enter a correct book reference')
    }
    
    // division reference is incorrect
    if (!ptsData[book][division]) {
      setIsError(true);
      return console.warn('please enter a correct division reference')
    }
    
    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      setIsError(true);
      return console.warn('please enter a correct page number reference')
    }
    
    // if all else is good
    return (
      setSelectedBook(book),
      setSelectedDiv(division),
      setSelectedNum(page),
      setText(input.join(' ')),
      setIsError(false),
      setMultipleEditionResults(null)
    )
  }

  function handleBookChange(e) {
    setSelectedBook(e.target.value)
    setSelectedDiv('')
    setSelectedNum('')
  }
  
  function handleDivChange(e) {
    setSelectedDiv(e.target.value)
    setSelectedNum('')
  }

  function handlePageChange(e) {
    setSelectedNum(e.target.value)
    setText('')
    setMultipleEditionResults(null)
  }

  function renderSelection() {
    return <Card style={{ margin: '15px' }}>
      <h3>PTS Converter</h3>
      <p>Bitte die gesuchte PTS Stelle auswählen / Please select the PTS position you want to look up:</p>
      <FormControl>
        <InputLabel>Book</InputLabel>
        <Select
          value={selectedBook}
          style={{ minWidth: '80px' }}
          onChange={(e) => handleBookChange(e)}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          { Object
            .keys(ptsData)
            .sort()
            .map((k) => <MenuItem value={k} key={k}>{k}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Division</InputLabel>
        <Select
          value={selectedDiv}
          style={{ minWidth: '80px' }}
          onChange={(e) => handleDivChange(e)}
          disabled={!selectedBook}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { !isArray(ptsData[selectedBook]) && typeof ptsData[selectedBook] !== 'undefined'
            ? Object
              .keys(ptsData[selectedBook])
              .map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : null
          }
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Page</InputLabel>
        <Select
          style={{ minWidth: '80px' }}
          value={selectedNum}
          onChange={(e) => handlePageChange(e)}
          disabled={!isArray(ptsData[selectedBook]) && !isArray(gv(ptsData, `${selectedBook}.${selectedDiv}`, null))}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { isArray(gv(ptsData, `${selectedBook}.${selectedDiv}`, null))
            ? Object
              .entries(gv(ptsData, `${selectedBook}.${selectedDiv}`, null))
              .filter(([k,v]) => v !== null)
              .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : isArray(ptsData[selectedBook])
              ? Object
                .entries(gv(ptsData, `${selectedBook}`, null))
                .filter(([k,v]) => v !== null)
                .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
              : null
          }
        </Select>
      </FormControl>

      <form onSubmit={handleSubmit}>
      <FormControl variant="filled" error={isError}>
          <InputLabel htmlFor="search">Search</InputLabel>
          <FilledInput
            id="search"
            placeholder="ie. D ii 14"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby="search-text"
          />

          <FormHelperText id="search-text">{isError && 'Error'}</FormHelperText>
        </FormControl>
      </form>
      
      <p style={{margin: '10px', fontSize: '15px'}}><i>Hinweis:</i> Wegen der guten Aufbereitung der Daten von SuttaCentral sollte es möglich sein, dass beim Öffnen der Links an den ersten Absatz der richtigen Stelle im Text gesprungen wird. Es kann sein, dass eine PTS Stelle in den nächsten Text überläuft. Die Markierung ist nur der Anfang der Stelle. Durch Nachschlagen der nächst höheren PTS Nummer kann herausgefunden werden, wo die vorherige Stelle endet. "Network Error" kann bedeuten, dass der Link nicht existiert (es gibt z.B. nicht immer Übersetzungen von Bodhi). Abkürzungen, die mit Großbuchstaben anfangen, können <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">hier</a> nachgeschlagen werden. Fehler etc. bitte an <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>

      <p style={{margin: '10px', fontSize: '15px'}}><i>Note:</i> Because of the data quality of SuttaCentral it should be possible to jump to the first paragraph of the correct position when opening a link. There may occur an "overflow" into the next text, since the marked paragraph only references where the PTS pos. begins. To find out the end position simply lookup the next higher number. "Network Error" most often means that the link is invalid. This happens i.e. because there are not always translations by Bodhi if linked to from here. Abbreviations starting with an uppercase letter can be looked up <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">here</a>. Please send error reports etc. to <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>
    </Card>
  }

  function renderResults() {
    const finalResult = multipleEditionResults ? multipleEditionResults : gv(ptsData, `${selectedBook}.${selectedDiv}.${selectedNum}`, null) ||
      gv(ptsData, `${selectedBook}.${selectedNum}`, null)

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

  return (
    <div className="App">
      { renderSelection() }
      { renderResults() }
    </div>
  );
}
