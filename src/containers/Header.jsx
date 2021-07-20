import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'

export default class Header extends Component {
  render() {
    return (
      <header>
        <Typography variant="h4" component="h1">
          Convert PTS Reference to Sutta Number
        </Typography>
      </header>
    )
  }
}
