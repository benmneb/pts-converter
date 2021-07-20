import React, { Component } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment'
import FilledInput from '@material-ui/core/FilledInput'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import { get as gv, isArray } from 'lodash'

import ptsData from '../data/pts_lookup.json'

function hasMoreThanOne(array, what) {
  let indexes = [];
  for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
          indexes.push(i)
      }
  }
  return indexes;
}

function toSentenceCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+([a-z])|^[a-z]/g, (s) => s.toUpperCase());
 }

export default class Search extends Component {  
  handleSubmit = e => {
    const { text, handleChange } = this.props;

    e.preventDefault();

    const input = text.trim().split(/\s+/);
    const book = toSentenceCase(input[0]);
    const division = input[1] && input[1].toLowerCase(); // this refers to page number for books that have no division
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
        return handleChange({ 
          isError: true,
          errorMessage: 'Something went wrong. Please try again'
        })
      }
          
      // filter out null results (when only one edition has that page)
      const results = bothResults.filter((result) => result !== null && result.length <= 2)
      console.log('results', results)

      return handleChange({
        text: input.join(' '),
        isError: false,
        multipleEditionResults: results
      })
    }
      console.log('only one')

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      console.log('this book has no divisions')
      
      // page number reference is out of range ('division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        handleChange({ 
          isError: true,
          errorMessage: 'Please enter a correct page number'
        })
        return console.warn('please enter a correct page number reference')
      }
      
      // else all is good!
      return handleChange({
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

    // book reference is incorrect
    if (!ptsData[book]) {
      handleChange({ 
        isError: true,
        errorMessage: 'Please enter a valid book reference'
      })
      return console.warn('please enter a correct book reference')
    }
    
    // division reference is incorrect
    if (!ptsData[book][division]) {
      handleChange({ 
        isError: true,
        errorMessage: 'Please enter a valid book division'
      })
      return console.warn('please enter a correct division reference')
    }
    
    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      handleChange({ 
        isError: true,
        errorMessage: 'Please enter a valid page number'
      })
      return console.warn('please enter a correct page number reference')
    }
    
    // if all else is good
    handleChange({
      selectedBook: book,
      selectedDiv: division,
      selectedNum: page,
      text: input.join(' '),
      isError: false,
      multipleEditionResults: null
    })
  }

  render() {
    const { text, isError, errorMessage, handleChange } = this.props;

    return (
      <form onSubmit={this.handleSubmit} className="form">
        <FormControl 
          variant="filled"
          error={isError && text.length}
        >
          <InputLabel htmlFor="search">Search</InputLabel>
          <FilledInput
            id="search"
            placeholder="ie. D ii 14"
            value={text}
            onChange={(e) => handleChange({ 
              text: e.target.value, 
              isError: false 
            })}
            aria-describedby="search-text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => handleChange({ 
                    text: '',
                    isError: false,
                    multipleEditionResults: null
                  })} 
                  disabled={text === ''}
                >
                  <Icon>close</Icon>
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="search-text">
            {isError && text && errorMessage}
          </FormHelperText>
        </FormControl>
        <Button type="submit" disabled={text === ''}>
          Convert
        </Button>
      </form>
    )
  }
}