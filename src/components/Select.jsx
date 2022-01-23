import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { get, isArray } from 'lodash';

import { useStore } from '../state';
import ptsData from '../data/pts_lookup.json';
import { ResponsiveMenuItem } from '.';

export default function Select() {
  const book = useStore((state) => state.selectedBook);
  const division = useStore((state) => state.selectedDivision);
  const page = useStore((state) => state.selectedPage);

  const selectBook = useStore((state) => state.selectBook);
  const selectDivision = useStore((state) => state.selectDivision);
  const selectPage = useStore((state) => state.selectPage);

  const mobile = useMediaQuery((theme) => theme.breakpoints.only('xs'));

  return (
    <div className="selection">
      <FormControl>
        <InputLabel>Book</InputLabel>
        <MuiSelect
          native={mobile}
          name="selectedBook"
          value={book}
          onChange={(e) => selectBook(e.target.value)}
        >
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
        <InputLabel>
          {(isArray(ptsData[book]) && 'N/A') || 'Division'}
        </InputLabel>
        <MuiSelect
          native={mobile}
          name="selectedDiv"
          value={division}
          onChange={(e) => selectDivision(e.target.value)}
          disabled={!book || isArray(ptsData[book])}
        >
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
          onChange={(e) => selectPage(e.target.value)}
          disabled={
            !isArray(ptsData[book]) &&
            !isArray(get(ptsData, `${book}.${division}`, null))
          }
        >
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
