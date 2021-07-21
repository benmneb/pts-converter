import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import MuiSelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

import { get, isArray } from 'lodash'

import ptsData from '../data/pts_lookup.json'

export default function Select(props) {
  const {book, division, page, handleChange} = props;

  return (
    <div className="selection">
      <FormControl>
        <InputLabel>Book</InputLabel>
        <MuiSelect
          name="selectedBook"
          value={book}
          onChange={(e) => handleChange({
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
        </MuiSelect>
      </FormControl>
      <FormControl>
        <InputLabel>Division</InputLabel>
        <MuiSelect
          name="selectedDiv"
          value={division}
          onChange={(e) => handleChange({
            selectedDiv: e.target.value,
            selectedNum: ''
          })}
          disabled={!book}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { !isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined'
            ? Object
              .keys(ptsData[book])
              .map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : null
          }
        </MuiSelect>
      </FormControl>
      <FormControl>
        <InputLabel>Page</InputLabel>
        <MuiSelect
          name='selectedNum'
          value={page}
          onChange={(e) => handleChange({ 
            selectedNum: e.target.value, 
            text: '', 
            multipleEditionResults: null 
          })}
          disabled={
            !isArray(ptsData[book]) && !isArray(get(ptsData, `${book}.${division}`, null))
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { isArray(get(ptsData, `${book}.${division}`, null))
            ? Object
              .entries(get(ptsData, `${book}.${division}`, null))
              .filter(([k,v]) => v !== null)
              .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : isArray(ptsData[book])
              ? Object
                .entries(get(ptsData, `${book}`, null))
                .filter(([k,v]) => v !== null)
                .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
              : null
          }
        </MuiSelect>
      </FormControl>
    </div>
  )
}
