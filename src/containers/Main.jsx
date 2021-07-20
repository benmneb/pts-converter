import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import { TabContainer, Results, Search, Select } from '../components'
import ptsData from '../data/pts_lookup.json'

export default class Main extends Component {
  render() {
    const { 
      tabValue, 
      multiEdRes, 
      book, 
      division, 
      page, 
      handleChangeSelect,
      handleChangeSearch,
      handleReset  
    } = this.props;

    const totalBooks = Object.keys(ptsData).length;

    return (
      <Card className="tabsWrapper" component="main">
        {tabValue === 0 && (
          <TabContainer>
            <Typography paragraph component="h2">
              Please type or copy & paste the PTS reference you want to convert.
            </Typography>
            <Search 
              handleChange={handleChangeSearch}
              resetInputStates={handleReset}
            />
            <Results 
              multiEdRes={multiEdRes} 
              book={book} 
              division={division} 
              page={page} 
            />
          </TabContainer>
        )}
        {tabValue === 1 && (
          <TabContainer>
            <Typography paragraph component="h2">
              Please select the PTS reference you want to convert.
            </Typography>
            <Select 
              book={book} 
              division={division} 
              page={page}
              handleChange={handleChangeSelect}
            />
            <Results 
              multiEdRes={multiEdRes} 
              book={book} 
              division={division} 
              page={page}
            />
          </TabContainer>
        )}
        {tabValue === 2 && (
          <TabContainer>
            <Typography component="article">
            <p>
              The search tab is a case-insensitive PTS lookup that references {totalBooks} different books.
              It is perfect for copy and pasting or quickly typing Pali Text Society references and reading the sutta online.
            </p>
            <p>
              If multiple results appear, it's because the book you searched for has multiple editions. 
              When available, the first edition's reference is always displayed first.
            </p>
            <p>
              The select tab allows for manual entering of book reference, division and page number.
            </p>
            <p>
              For comments and corrections, please {' '}
              <a href="https://github.com/benmneb/pts-converter" className="link" target="_blank" rel="noopener noreferrer">
              file an issue or make a pull request on GitHub
              </a>.
            </p>
            <hr />
            <p>
              This project started out as a utility function to automatically convert the PTS references in my project {' '}  
              <a href="https://github.com/benmneb/meditation-subjects" className="link" target="_blank" rel="noopener noreferrer">
              The 40 Buddhist Meditation Subjects
              </a> which is a digitised version of the practical instructions from the Visuddhimagga.
            </p>
            <p>
              This PTS reference converter was built on top of the great open source work done by {' '}
              <a href="https://gitlab.com/olastor/pts-converter/" className="link" target="_blank" rel="noopener noreferrer">
                olaster
              </a>, 
              which was built on top of the priceless open source work going on at {' '} 
              <a href="https://suttacentral.net" className="link" target="_blank" rel="noopener noreferrer">
                Sutta Central
              </a>.
            </p>
            <hr />
            <p>
              This work is dedicated to the public domain via {' '}
              <a
                className="link" 
                rel="license noopener noreferrer"
                href="http://creativecommons.org/publicdomain/zero/1.0/"
                target="_blank"
              >
                CC0
              </a>.
              You are free to copy or modify it as you see fit.
              Attribution is appreciated but not legally required.
            </p>
            <a 
              rel="license noopener noreferrer"
              href="http://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
            >
              <img src="https://licensebuttons.net/p/zero/1.0/88x31.png" alt="CC0"/>
            </a>
            </Typography>
          </TabContainer>
        )}
      </Card>
    )
  }
}
