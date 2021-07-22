import React from 'react';

import Typography from '@material-ui/core/Typography';

import ptsData from '../data/pts_lookup.json';

export default function About() {
  const totalBooks = Object.keys(ptsData).length;

  return (
    <Typography component="article">
      <section>
        <p>
          The search tab is a case-insensitive PTS lookup that references{' '}
          {totalBooks} different books. It is perfect for copy and pasting or
          quickly typing Pali Text Society references and reading the sutta
          online.
        </p>
        <p>
          The search input accepts two or three whitespace/period seperated
          values in the format of PTS references (book, division?, page), eg.{' '}
          <code>M i 5</code>, <code>Dhp 34</code>, <code>Bv i. 16</code>,{' '}
          <code>it.80</code>, <code>S.I.42</code>.
        </p>
        <p>
          You don't need to specify a book edition number, by default the search
          will return all available editions.
        </p>
        <p>
          If multiple results appear, it's because the reference you searched
          for applied to multiple book editions. The earliest edition's
          reference is always displayed first.
        </p>
        <p>
          The select tab allows for manual entering of book reference, division
          and page number.
        </p>
        <p>
          For comments and corrections, please{' '}
          <a
            href="https://github.com/benmneb/pts-converter"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            file an issue or make a pull request on GitHub
          </a>
          .
        </p>
      </section>
      <hr />
      <section>
        <p>
          This project started out as an internal utility function to
          automatically convert the PTS references in my project{' '}
          <a
            href="https://github.com/benmneb/meditation-subjects"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            The 40 Buddhist Meditation Subjects
          </a>{' '}
          which is a prettified version of the practical instructions from the
          Visuddhimagga.
        </p>
        <p>
          This PTS reference converter was built on top of the great open source
          work done by{' '}
          <a
            href="https://gitlab.com/olastor/pts-converter/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            olaster
          </a>
          , which was built on top of the priceless open source work going on at{' '}
          <a
            href="https://suttacentral.net"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sutta Central
          </a>
          .
        </p>
      </section>
      <hr />
      <section>
        <p>
          This work is dedicated to the public domain via{' '}
          <a
            className="link"
            rel="license noopener noreferrer"
            href="http://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
          >
            Creative Commons Zero (CC0)
          </a>
          . You are free to copy or modify it as you see fit. Attribution is
          appreciated but not legally required.
        </p>
        <a
          rel="license noopener noreferrer"
          href="http://creativecommons.org/publicdomain/zero/1.0/"
          target="_blank"
        >
          <img
            src="https://licensebuttons.net/p/zero/1.0/88x31.png"
            alt="CC0"
          />
        </a>
      </section>
    </Typography>
  );
}
