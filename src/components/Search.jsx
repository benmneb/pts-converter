import InputAdornment from '@material-ui/core/InputAdornment';
import FilledInput from '@material-ui/core/FilledInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import { get, isArray } from 'lodash';

import { useStore } from '../state';

import ptsData from '../data/pts_lookup.json';
import { hasMoreThanOne, toSentenceCase } from '../utils';
import '../assets/styles.css';

export default function Search() {
  const inputText = useStore((state) => state.inputText);
  const isError = useStore((state) => state.isError);
  const errorMessage = useStore((state) => state.errorMessage);

  const setError = useStore((state) => state.setError);
  const resetInputValues = useStore((state) => state.resetInputValues);
  const clearInput = useStore((state) => state.clearInput);
  const setMultipleEditionSearchResults = useStore(
    (state) => state.setMultipleEditionSearchResults
  );
  const setSearchResults = useStore((state) => state.setSearchResults);
  const handleInputChange = useStore((state) => state.handleInputChange);

  function handleSubmit(e) {
    e.preventDefault();

    const input = inputText.trim().replace(/[.+]/g, ' ').split(/\s+/);
    const book = toSentenceCase(input[0]);
    const division = input[1] && input[1].toLowerCase(); // this refers to page number for books that have no division
    const page = input[2];

    // if book has multiple editions
    if (
      Object.keys(ptsData).some((eachBook) => eachBook.includes(`${book} `))
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

      // if bothResults array is full of nulls
      if (bothResults.every((elem) => elem === null)) {
        // check if has no divisions. '20' is just a number, if lots of children then it probably has no divisions, because the children are the page results
        if (Object.values(indexesData).every((child) => child.length > 20)) {
          setError('Please enter a valid page number');
          return resetInputValues();
        }

        // must have divisions
        setError('Please enter a valid book division');
        return resetInputValues();
      }

      // filter out null results (so when only one edition has the searched page)
      const results = bothResults.filter(
        (result) => result !== null && result.length <= 2
      );

      // handle (what is probably a) page number error
      if (!results.length) {
        setError('Please enter a valid page number');
        return resetInputValues();
      }

      // else all is good!
      return setMultipleEditionSearchResults(results, input.join(' '));
    }

    // has only one edition

    // check if book has no divisions
    if (isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined') {
      // page number reference is out of range (the const 'division' refers to page number for books that have no division)
      if (!ptsData[book][division]) {
        setError('Please enter a valid page number');
        return resetInputValues();
      }

      // else all is good!
      return setSearchResults(book, '', division, input.join(' '));
    }

    // book has divisions

    // book reference is incorrect
    if (!ptsData[book]) {
      setError('Please enter a valid book reference');
      return resetInputValues();
    }

    // division reference is incorrect
    if (!ptsData[book][division]) {
      setError('Please enter a valid book division');
      return resetInputValues();
    }

    // number reference is incorrect
    if (!ptsData[book][division][page]) {
      setError('Please enter a valid page number');
      return resetInputValues();
    }

    // else all is good!
    return setSearchResults(book, division, page, input.join(' '));
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <FormControl
        size="medium"
        variant="filled"
        error={isError && Boolean(inputText.length)}
        className="searchFormControl"
      >
        <InputLabel htmlFor="search" classes={{ shrink: 'inputShrink' }}>
          Search
        </InputLabel>
        <FilledInput
          id="search"
          placeholder="ie. D ii 14"
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
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
                aria-label="clear search input"
                onClick={() => clearInput()}
                disabled={inputText === ''}
              >
                <CloseRoundedIcon fontSize="small" />
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
