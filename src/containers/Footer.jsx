import React from 'react';

import Typography from '@material-ui/core/Typography';

export default function Footer() {
  return (
    <footer>
      <Typography color="textSecondary">
        <a
          className="footerLink"
          rel="license noopener noreferrer"
          href="http://creativecommons.org/publicdomain/zero/1.0/"
          target="_blank"
        >
          CC0
        </a>{' '}
        <a
          className="footerLink"
          href="https://github.com/benmneb"
          target="_blank"
          rel="noopener noreferrer"
        >
          benmneb
        </a>
      </Typography>
    </footer>
  );
}
