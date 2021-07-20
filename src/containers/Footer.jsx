import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <Typography color="textSecondary">
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
    )
  }
}
