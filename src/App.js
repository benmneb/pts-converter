import React, { Component } from 'react';

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

// const FROM_ROMAN = {
//   'i': 'i1',
//   'ii': 'i2',
//   'iii': 'i3',
//   'iv': 'i4',
//   'v': 'i5',
//   'vi': 'i6',
//   'vii': 'i7',
//   'viii': 'i8',
//   'ix': 'i9',
//   'x': 'i10'
// }

function hasMoreThanOne(array, what) {
  let indexes = [];
  for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
          indexes.push(i)
      }
  }
  return indexes;
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedBook: '',
      selectedDiv: '',
      selectedNum: '',
      text: '',
      isError: false,
      multipleEditionResults: null
    }
  }

  // handleChange = event => {
  //   this.setState({ [event.target.name]: event.target.value });
  // }

  handleSubmit = e => {
    e.preventDefault();
    const input = this.state.text.trim().split(/\s+/);
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
        return this.setState({ isError: true })
      }
          
      // filter out null results (when only one edition has that page)
      const results = bothResults.filter((result) => result !== null && result.length <= 2)
      console.log('results', results)

      return this.setState({
        text: input.join(' '),
        isError: false,
        multipleEditionResults: results
      })
    }
      console.log('only one')

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      console.log('this book has no divisions')
      
      // number reference is out of range ('division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        this.setState({isError: true})
        return console.warn('please enter a correct page number reference')
      }
      
      // else all is good!
      return this.setState({
        selectedBook: book,
        selectedDiv: '',
        selectedNum: division,
        text: input.join(' '),
        isError: false,
        multipleEditionResults: null
      })
    }

    // book has divisions
    console.log('has divisions')
    // general error: there arent 3 whitespace seperated values in textfield
    // if (page === undefined) {
    //   this.setState({isError: true})
    //   return console.log('please enter correctly')
    // }

    // book reference is incorrect
    if (!ptsData[book]) {
      this.setState({isError: true})
      return console.warn('please enter a correct book reference')
    }
    
    // division reference is incorrect
    if (!ptsData[book][division]) {
      this.setState({isError: true})
      return console.warn('please enter a correct division reference')
    }
    
    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      this.setState({isError: true})
      return console.warn('please enter a correct page number reference')
    }
    
    // if all else is good
    this.setState({
      selectedBook: book,
      selectedDiv: division,
      selectedNum: page,
      text: input.join(' '),
      isError: false,
      multipleEditionResults: null
    })
  }

  renderSelection() {
    return <Card style={{ margin: '15px' }}>
      <h3>PTS Converter</h3>
      <p>Bitte die gesuchte PTS Stelle auswählen / Please select the PTS position you want to look up:</p>
      <FormControl>
        <InputLabel>Book</InputLabel>
        <Select
          value={this.state.selectedBook}
          style={{ minWidth: '80px' }}
          onChange={(e) => this.setState({
            selectedBook: e.target.value,
            selectedDiv: '',
            selectedNum: ''
          })}
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
          value={this.state.selectedDiv}
          style={{ minWidth: '80px' }}
          onChange={(e) => this.setState({
            selectedDiv: e.target.value,
            selectedNum: ''
          })}
          disabled={!this.state.selectedBook}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { !isArray(ptsData[this.state.selectedBook]) && typeof ptsData[this.state.selectedBook] !== 'undefined'
            ? Object
              .keys(ptsData[this.state.selectedBook])
              .map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : null
          }
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Page</InputLabel>
        <Select
          name='selectedNum'
          style={{ minWidth: '80px' }}
          value={this.state.selectedNum}
          onChange={(e) => this.setState({ selectedNum: e.target.value, text: '', multipleEditionResults: null })}
          disabled={!isArray(ptsData[this.state.selectedBook]) && !isArray(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { isArray(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))
            ? Object
              .entries(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))
              .filter(([k,v]) => v !== null)
              .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : isArray(ptsData[this.state.selectedBook])
              ? Object
                .entries(gv(ptsData, `${this.state.selectedBook}`, null))
                .filter(([k,v]) => v !== null)
                .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
              : null
          }
        </Select>
      </FormControl>

      <form onSubmit={this.handleSubmit}>
      <FormControl variant="filled" error={this.state.isError}>
          <InputLabel htmlFor="search">Search</InputLabel>
          <FilledInput
            id="search"
            placeholder="ie. D ii 14"
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
            aria-describedby="search-text"
          />

          <FormHelperText id="search-text">{this.state.isError && 'Error'}</FormHelperText>
        </FormControl>
      </form>
      
      <p style={{margin: '10px', fontSize: '15px'}}><i>Hinweis:</i> Wegen der guten Aufbereitung der Daten von SuttaCentral sollte es möglich sein, dass beim Öffnen der Links an den ersten Absatz der richtigen Stelle im Text gesprungen wird. Es kann sein, dass eine PTS Stelle in den nächsten Text überläuft. Die Markierung ist nur der Anfang der Stelle. Durch Nachschlagen der nächst höheren PTS Nummer kann herausgefunden werden, wo die vorherige Stelle endet. "Network Error" kann bedeuten, dass der Link nicht existiert (es gibt z.B. nicht immer Übersetzungen von Bodhi). Abkürzungen, die mit Großbuchstaben anfangen, können <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">hier</a> nachgeschlagen werden. Fehler etc. bitte an <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>

      <p style={{margin: '10px', fontSize: '15px'}}><i>Note:</i> Because of the data quality of SuttaCentral it should be possible to jump to the first paragraph of the correct position when opening a link. There may occur an "overflow" into the next text, since the marked paragraph only references where the PTS pos. begins. To find out the end position simply lookup the next higher number. "Network Error" most often means that the link is invalid. This happens i.e. because there are not always translations by Bodhi if linked to from here. Abbreviations starting with an uppercase letter can be looked up <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">here</a>. Please send error reports etc. to <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>
    </Card>
  }

  renderResults() {
    const finalResult = this.state.multipleEditionResults ? this.state.multipleEditionResults : gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`, null) ||
      gv(ptsData, `${this.state.selectedBook}.${this.state.selectedNum}`, null)

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

  render() {
    return (
      <div className="App">
        { this.renderSelection() }
        { this.renderResults() }

        <Card style={{margin: '15px'}}>
        </Card>
      </div>
    );
  }
}

export default App;
