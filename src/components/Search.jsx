import InputAdornment from '@material-ui/core/InputAdornment';
import FilledInput from '@material-ui/core/FilledInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { useDispatch, useSelector } from 'react-redux';

import { get, isArray } from 'lodash';

import ptsData from '../data/pts_lookup.json';
import {
  setError,
  resetInputValues,
  clearInput,
  setMultipleEditionSearchResults,
  setSearchResults,
  handleInputChange,
} from '../state';
import { hasMoreThanOne, toSentenceCase } from '../utils';
import '../assets/styles.css';

export default function Search() {
  const dispatch = useDispatch();

  const inputText = useSelector((state) => state.inputText);
  const isError = useSelector((state) => state.isError);
  const errorMessage = useSelector((state) => state.errorMessage);

  function handleSubmit(e) {
    e.preventDefault();

    const input = inputText.trim().replace(/[.+]/g, ' ').split(/\s+/);
    const book = toSentenceCase(input[0]);
    const division = input[1] && input[1].toLowerCase(); // this refers to page number for books that have no division
    const page = input[2];

    // if book has multiple editions
    if (
      Object.keys(ptsData).filter((eachBook) => eachBook.includes(`${book} `))
        .length > 0
    ) {
      // get indexes of all book editions
      const indexes = hasMoreThanOne(
        Object.keys(ptsData).map((key) => key.split(/\s+/)[0]),
        book
      );
      // return data from those indexes in ptsData and put in new object
      const indexesData = {
        ...indexes.map((index) => Object.values(ptsData)[index]),
      };
      // get the required info from this new object instead of whole ptsData
      const bothResults = Object.keys(indexesData).map(
        (ed) =>
          get(indexesData, `${ed}.${division}.${page}`, null) ||
          get(indexesData, `${ed}.${division}`, null)
      );

      // account for books with and without divisions
      if (bothResults.every((elem) => elem === null)) {
        console.warn('results both null');

        // check if has no divisions
        if (Object.values(indexesData).every((child) => child.length > 20)) {
          console.warn(
            'long indexData children lengths, probably no divisions'
          );

          dispatch(setError('Please enter a valid page number'));
          return dispatch(resetInputValues());
        }

        // must have divisions
        dispatch(setError('Please enter a valid book division'));
        return dispatch(resetInputValues());
      }

      // filter out null results (when only one edition has the searched page)
      const results = bothResults.filter(
        (result) => result !== null && result.length <= 2
      );

      // handle (what is probably a) page number error
      if (!results.length) {
        console.warn(
          'results array empty, probably due to out of range page number'
        );

        dispatch(setError('Please enter a valid page number'));
        return dispatch(resetInputValues());
      }

      // else all is good!
      return dispatch(
        setMultipleEditionSearchResults(results, input.join(' '))
      );
    }

    // has only one edition

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      // page number reference is out of range (the const 'division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        console.warn('please enter a correct page number reference');

        dispatch(setError('Please enter a valid page number'));
        return dispatch(resetInputValues());
      }

      // else all is good!
      return dispatch(setSearchResults(book, '', division, input.join(' ')));
    }

    // book has divisions

    // book reference is incorrect
    if (!ptsData[book]) {
      console.warn('please enter a correct book reference');

      dispatch(setError('Please enter a valid book reference'));
      return dispatch(resetInputValues());
    }

    // division reference is incorrect
    if (!ptsData[book][division]) {
      console.warn('please enter a correct division reference');

      dispatch(setError('Please enter a valid book division'));
      return dispatch(resetInputValues());
    }

    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      console.warn('please enter a correct page number reference');

      dispatch(setError('Please enter a valid page number'));
      return dispatch(resetInputValues());
    }

    // else all is good!
    return dispatch(setSearchResults(book, division, page, input.join(' ')));
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <FormControl
        size="medium"
        variant="filled"
        error={isError && Boolean(inputText.length)}
      >
        <InputLabel htmlFor="search" classes={{ shrink: 'inputShrink' }}>
          Search
        </InputLabel>
        <FilledInput
          id="search"
          placeholder="ie. D ii 14"
          value={inputText}
          onChange={(e) => dispatch(handleInputChange(e.target.value))}
          aria-describedby="search-text"
          inputProps={{
            autoComplete: 'off',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            spellCheck: 'false',
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => dispatch(clearInput())}
                disabled={inputText === ''}
              >
                <Icon>close</Icon>
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="search-text">
          {isError && inputText ? errorMessage : ' '}
        </FormHelperText>
      </FormControl>
      <div className="submitBox">
        <Button type="submit" disabled={inputText === ''}>
          Convert
        </Button>
      </div>
    </form>
  );
}
