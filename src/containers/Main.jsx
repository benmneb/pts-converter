import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import { TabContainer, Results, Search, Select } from '../components'

export default class Main extends Component {
  render() {
    console.log('MAIN')
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
            <Typography variant="h4" component="h2" gutterBottom>
              Search
            </Typography>
            <Typography paragraph>
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
            <Typography variant="h4" component="h2" gutterBottom>
              Select
            </Typography>
            <Typography paragraph>
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
            <Typography><i>Hinweis:</i> Wegen der guten Aufbereitung der Daten von SuttaCentral sollte es möglich sein, dass beim Öffnen der Links an den ersten Absatz der richtigen Stelle im Text gesprungen wird. Es kann sein, dass eine PTS Stelle in den nächsten Text überläuft. Die Markierung ist nur der Anfang der Stelle. Durch Nachschlagen der nächst höheren PTS Nummer kann herausgefunden werden, wo die vorherige Stelle endet. "Network Error" kann bedeuten, dass der Link nicht existiert (es gibt z.B. nicht immer Übersetzungen von Bodhi). Abkürzungen, die mit Großbuchstaben anfangen, können <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">hier</a> nachgeschlagen werden. Fehler etc. bitte an <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></Typography>
            <Typography><i>Note:</i> Because of the data quality of SuttaCentral it should be possible to jump to the first paragraph of the correct position when opening a link. There may occur an "overflow" into the next text, since the marked paragraph only references where the PTS pos. begins. To find out the end position simply lookup the next higher number. "Network Error" most often means that the link is invalid. This happens i.e. because there are not always translations by Bodhi if linked to from here. Abbreviations starting with an uppercase letter can be looked up <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank' rel="noopener noreferrer">here</a>. Please send error reports etc. to <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></Typography>
          </TabContainer>
        )}
      </Card>
    )
  }
}
