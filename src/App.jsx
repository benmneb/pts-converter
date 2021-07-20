import React, { Component } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { theme } from './assets'
import { Footer, Header, Nav, Main } from './containers';
import './assets/styles.css'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedBook: '',
      selectedDiv: '',
      selectedNum: '',
      text: '',
      isError: false,
      errorMessage: null,
      multipleEditionResults: null,
      tabValue: 0
    }
  }

  handleChangeState = (changes) => {
    this.setState({ ...changes });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Nav 
          tabValue={this.state.tabValue} 
          handleChange={this.handleChangeState}
        />
        <Main 
          tabValue={this.state.tabValue} 
          multiEdRes={this.state.multipleEditionResults}
          book={this.state.selectedBook}
          division={this.state.selectedDiv}
          page={this.state.selectedNum}
          text={this.state.text}
          isError={this.state.isError}
          errorMessage={this.state.errorMessage}
          handleChangeSelect={this.handleChangeState}
          handleChangeSearch={this.handleChangeState}
          />
        <Footer />
      </MuiThemeProvider>
    );
  }
}
