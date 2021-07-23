import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { get, isArray } from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

import ptsData from '../data/pts_lookup.json';
import { ResponsiveMenuItem } from '../utils';
import { selectBook, selectDivision, selectPage } from '../state';

export default function Select() {
  const dispatch = useDispatch();

  const book = useSelector((state) => state.selectedBook);
  const division = useSelector((state) => state.selectedDivision);
  const page = useSelector((state) => state.selectedPage);

  const mobile = useMediaQuery((theme) => theme.breakpoints.only('xs'));

  return (
    <div className="selection">
      <FormControl>
        <InputLabel>Book</InputLabel>
        <MuiSelect
          native={mobile}
          name="selectedBook"
          value={book}
          onChange={(e) => dispatch(selectBook(e.target.value))}
        >
          <ResponsiveMenuItem value="" aria-label="none">
            {!mobile ? <em>None</em> : null}
          </ResponsiveMenuItem>
          {Object.keys(ptsData)
            .sort()
            .map((k) => (
              <ResponsiveMenuItem value={k} key={k}>
                {k}
              </ResponsiveMenuItem>
            ))}
        </MuiSelect>
      </FormControl>
      <FormControl>
        <InputLabel>Division</InputLabel>
        <MuiSelect
          native={mobile}
          name="selectedDiv"
          value={division}
          onChange={(e) => dispatch(selectDivision(e.target.value))}
          disabled={!book || isArray(ptsData[book])}
        >
          <ResponsiveMenuItem value="" aria-label="none">
            {!mobile ? <em>None</em> : null}
          </ResponsiveMenuItem>
          {!isArray(ptsData[book]) && typeof ptsData[book] !== 'undefined'
            ? Object.keys(ptsData[book]).map((k) => (
                <ResponsiveMenuItem value={k} key={k}>
                  {k}
                </ResponsiveMenuItem>
              ))
            : null}
        </MuiSelect>
      </FormControl>
      <FormControl>
        <InputLabel>Page</InputLabel>
        <MuiSelect
          native={mobile}
          name="selectedNum"
          value={page}
          onChange={(e) => dispatch(selectPage(e.target.value))}
          disabled={
            !isArray(ptsData[book]) &&
            !isArray(get(ptsData, `${book}.${division}`, null))
          }
        >
          <ResponsiveMenuItem value="" aria-label="none">
            {!mobile ? <em>None</em> : null}
          </ResponsiveMenuItem>
          {isArray(get(ptsData, `${book}.${division}`, null))
            ? Object.entries(get(ptsData, `${book}.${division}`, null))
                .filter(([k, v]) => v !== null)
                .map(([k, v]) => (
                  <ResponsiveMenuItem value={k} key={k}>
                    {k}
                  </ResponsiveMenuItem>
                ))
            : isArray(ptsData[book])
            ? Object.entries(get(ptsData, `${book}`, null))
                .filter(([k, v]) => v !== null)
                .map(([k, v]) => (
                  <ResponsiveMenuItem value={k} key={k}>
                    {k}
                  </ResponsiveMenuItem>
                ))
            : null}
        </MuiSelect>
      </FormControl>
    </div>
  );
}
