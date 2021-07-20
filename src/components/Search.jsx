import React, { Component } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment'
import FilledInput from '@material-ui/core/FilledInput'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import { get, isArray } from 'lodash'

import ptsData from '../data/pts_lookup.json'
import { hasMoreThanOne, toSentenceCase } from '../utils'

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      isError: false,
      errorMessage: null
    }
  }
  
  handleSubmit = (e) => {
    const { handleChange, resetInputStates } = this.props;

    e.preventDefault();

    const input = this.state.text.trim().split(/\s+/);
    const book = toSentenceCase(input[0]);
    const division = input[1] && input[1].toLowerCase(); // this refers to page number for books that have no division
    const page = input[2]

    // if book has multiple editions
    if (Object.keys(ptsData).filter((eachBook) => eachBook.includes(`${book} `)).length > 0) {
      console.log('more than one edition')
      // get indexes of all book editions
      const indexes = hasMoreThanOne(Object.keys(ptsData).map(key => key.split(/\s+/)[0]), book);
      console.log('indexes', indexes)
      // return data from those indexes in ptsData and put in new object
      const indexesData = {...indexes.map(index => Object.values(ptsData)[index])};
      // get the required info from this new object instead of whole ptsData
      const bothResults = Object.keys(indexesData).map((ed) => 
        get(indexesData, `${ed}.${division}.${page}`, null) || 
          get(indexesData, `${ed}.${division}`, null))
          
      console.log('ptsData', ptsData)
      console.log('indexesData', indexesData)
      console.log('bothResults', bothResults)
      
      // account for books with and without divisions
      if (bothResults.every((elem) => elem === null)) {
        console.warn('results both null')

        // check if has no divisions
        if (Object.values(indexesData).every((child) => child.length > 20)) {
          console.warn('long indexData children lengths, probably no divisions')
          this.setState({
            isError: true,
            errorMessage: 'Please enter a valid page number',
          })
          return resetInputStates();
        }

        // must have divisions
        this.setState({
          isError: true,
          errorMessage: 'Please enter a valid book division',
        })
        return resetInputStates();
      }
      
      // filter out null results (when only one edition has the searched page)
      const results = bothResults.filter((result) => result !== null && result.length <= 2)
      console.log('results', results)
      
      // handle (what is probably a) page number error
      if (!results.length) {
        console.warn('results array empty, probably due to out of range page number')
        this.setState({
          isError: true,
          errorMessage: 'Please enter a valid page number',  
        })
        return resetInputStates();
      }

      this.setState({
        text: input.join(' '),
        isError: false,    
      })
      return handleChange({
        multipleEditionResults: results
      })
    }

    // has only one edition
    console.log('only one edition')

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      console.log('this book has no divisions')
      
      // page number reference is out of range (the const 'division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        console.warn('please enter a correct page number reference')
        this.setState({
          isError: true,
          errorMessage: 'Please enter a correct page number',  
        })
        return resetInputStates();
      }
      
      // else all is good!
      this.setState({
        text: input.join(' '),
        isError: false,    
      })
      return handleChange({
        selectedBook: book,
        selectedDiv: '',
        selectedNum: division,
        multipleEditionResults: null
      })
    }

    // book has divisions
    console.log('has divisions')

    // book reference is incorrect
    if (!ptsData[book]) {
      console.warn('please enter a correct book reference')
      this.setState({
        isError: true,
        errorMessage: 'Please enter a valid book reference',    
      })
      return resetInputStates();
    }
    
    // division reference is incorrect
    if (!ptsData[book][division]) {
      console.warn('please enter a correct division reference')
      this.setState({
        isError: true,
        errorMessage: 'Please enter a valid book division',    
      })
      return resetInputStates();
    }
    
    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      console.warn('please enter a correct page number reference');
      this.setState({
        isError: true,
        errorMessage: 'Please enter a valid page number',    
      })
      return resetInputStates();
    }
    
    // else all is good!
    this.setState({
      text: input.join(' '),
      isError: false,      
    })
    handleChange({
      selectedBook: book,
      selectedDiv: division,
      selectedNum: page,
      multipleEditionResults: null
    })
  }

  handleCloseIconClick = () => {
    const { resetInputStates } = this.props;

    this.setState({ 
      text: '',
      isError: false,
    })
    resetInputStates();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
        <FormControl 
          variant="filled"
          error={this.state.isError && this.state.text.length}
        >
          <InputLabel htmlFor="search">Search</InputLabel>
          <FilledInput
            id="search"
            placeholder="ie. D ii 14"
            value={this.state.text}
            onChange={(e) => this.setState({ 
              text: e.target.value, 
              isError: false 
            })}
            aria-describedby="search-text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton 
                  onClick={this.handleCloseIconClick} 
                  disabled={this.state.text === ''}
                >
                  <Icon>close</Icon>
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="search-text">
            {this.state.isError && this.state.text && this.state.errorMessage}
          </FormHelperText>
        </FormControl>
        <div className="submitBox">
          <Button type="submit" disabled={this.state.text === ''}>
            Convert
          </Button>
        </div>
      </form>
    )
  }
}