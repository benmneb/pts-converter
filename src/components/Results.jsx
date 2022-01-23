import { get } from 'lodash';

import { useStore } from '../state';
import ptsData from '../data/pts_lookup.json';
import { ResultCard } from '../components';

export default function Results() {
  const book = useStore((state) => state.selectedBook);
  const division = useStore((state) => state.selectedDivision);
  const page = useStore((state) => state.selectedPage);
  const multipleEditionResults = useStore(
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
