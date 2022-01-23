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

  if (finalResult.reduce((prev, curr) => prev[0] === curr[0])) {
    return (
      <article className="resultCardContainer">
        <ResultCard data={finalResult.flat()} />
      </article>
    );
  }

  if (finalResult.flat().length > 2) {
    return (
      <article className="multiResultCardContainer">
        {finalResult.map((res, i) => (
          <ResultCard key={res} data={res} edition={i + 1} />
        ))}
      </article>
    );
  }

  return (
    <article className="resultCardContainer">
      <ResultCard data={finalResult.flat()} />
    </article>
  );
}
