import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import { TabContainer, Results, Search, Select, About } from '../components'

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
            <About />
          </TabContainer>
        )}
      </Card>
    )
  }
}
