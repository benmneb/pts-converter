import { get } from 'lodash';

import { useSelector } from 'react-redux';

import ptsData from '../data/pts_lookup.json';
import { ResultCard } from '../components';

export default function Results() {
  const book = useSelector((state) => state.selectedBook);
  const division = useSelector((state) => state.selectedDivision);
  const page = useSelector((state) => state.selectedPage);
  const multipleEditionResults = useSelector(
    (state) => state.multipleEditionResults
  );

  const finalResult = multipleEditionResults
    ? multipleEditionResults
    : get(ptsData, `${book}.${division}.${page}`, null) ||
      get(ptsData, `${book}.${page}`, null);

  if (finalResult === null) {
    return null;
  }

  return finalResult.flat().length > 2 ? (
    <div className="multiResultCardContainer">
      {finalResult.map((res) => (
        <ResultCard key={res} data={res} />
      ))}
    </div>
  ) : (
    <ResultCard data={finalResult.flat()} />
  );
}
