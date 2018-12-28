import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ptsData from './data/pts_lookup.json'
import {
  Card,
  CardActions,
  CardActionArea,
  Typography,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Icon
} from '@material-ui/core'
import { get as gv, isArray } from 'lodash'

const FROM_ROMAN = {
  'i': 'i1',
  'ii': 'i2',
  'iii': 'i3',
  'iv': 'i4',
  'v': 'i5',
  'vi': 'i6',
  'vii': 'i7',
  'viii': 'i8',
  'ix': 'i9',
  'x': 'i10'
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedBook: '',
      selectedDiv: '',
      selectedNum: ''
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  renderSelection() {
    return <Card style={{ margin: '15px' }}>
      <h3>PTS Converter</h3>
      <p>Bitte die gesuchte PTS Stelle auswählen / Please select the PTS position you want to look up:</p>
      <FormControl>
        <InputLabel>Book</InputLabel>
        <Select
          value={this.state.selectedBook}
          style={{ minWidth: '80px' }}
          onChange={(e) => this.setState({
            selectedBook: e.target.value,
            selectedDiv: '',
            selectedNum: ''
          })}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          { Object
            .keys(ptsData)
            .sort()
            .map((k) => <MenuItem value={k} key={k}>{k}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Division</InputLabel>
        <Select
          value={this.state.selectedDiv}
          style={{ minWidth: '80px' }}
          onChange={(e) => this.setState({
            selectedDiv: e.target.value,
            selectedNum: ''
          })}
          disabled={!this.state.selectedBook}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { !isArray(ptsData[this.state.selectedBook]) && typeof ptsData[this.state.selectedBook] !== 'undefined'
            ? Object
              .keys(ptsData[this.state.selectedBook])
              .map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : null
          }
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Number</InputLabel>
        <Select
          name='selectedNum'
          style={{ minWidth: '80px' }}
          value={this.state.selectedNum}
          onChange={(e) => this.setState({ selectedNum: e.target.value })}
          disabled={!isArray(ptsData[this.state.selectedBook]) && !isArray(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { isArray(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))
            ? Object
              .entries(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))
              .filter(([k,v]) => v !== null)
              .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : isArray(ptsData[this.state.selectedBook])
              ? Object
                .entries(gv(ptsData, `${this.state.selectedBook}`, null))
                .filter(([k,v]) => v !== null)
                .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
              : null
          }
        </Select>
      </FormControl>
      <p style={{margin: '10px', fontSize: '15px'}}><i>Hinweis:</i> Wegen der guten Aufbereitung der Daten von SuttaCentral sollte es möglich sein, dass beim Öffnen der Links an den ersten Absatz der richtigen Stelle im Text gesprungen wird. Es kann sein, dass eine PTS Stelle in den nächsten Text überläuft. Die Markierung ist nur der Anfang der Stelle. Durch Nachschlagen der nächst höheren PTS Nummer kann herausgefunden werden, wo die vorherige Stelle endet. "Network Error" kann bedeuten, dass der Link nicht existiert (es gibt z.B. nicht immer Übersetzungen von Bodhi). Abkürzungen, die mit Großbuchstaben anfangen, können <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank'>hier</a> nachgeschlagen werden. Fehler etc. bitte an <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>

      <p style={{margin: '10px', fontSize: '15px'}}><i>Note:</i> Because of the data quality of SuttaCentral it should be possible to jump to the first paragraph of the correct position when opening a link. There may occur an "overflow" into the next text, since the marked paragraph only references where the PTS pos. begins. To find out the end position simply lookup the next higher number. "Network Error" most often means that the link is invalid. This happens i.e. because there are not always translations by Bodhi if linked to from here. Abbreviations starting with an uppercase letter can be looked up <a href='http://www.palitext.com/subpages/PTS_Abbreviations.pdf' target='_blank'>here</a>. Please send error reports etc. to <a href='mailto:ticao@posteo.de'>ticao@posteo.de</a></p>
    </Card>
  }

  renderResults() {
    const result = gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`, null) ||
      gv(ptsData, `${this.state.selectedBook}.${this.state.selectedNum}`, null)

    if (result === null) {
      return null
    }

    const [suttaId, ptsRef] = result

    const bookId = suttaId.match(/[^0-9]+/gi)

    return <Card style={{ margin: '15px' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { suttaId.toUpperCase() }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <a href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}`} target='_blank'>
          Pali
          <Icon>open_in_new</Icon>
        </a>
        { bookId && ['mn', 'sn', 'an', 'dn'].includes(bookId[0])
          ? <a
            href={`https://suttacentral.net/${suttaId}/en/sujato#${ptsRef}`}
            target='_blank'>
            English (Sujato)
            <Icon>open_in_new</Icon>
          </a>
          : null
        }
        { bookId && ['mn', 'sn', 'an'].includes(bookId[0])
          ? <a
            href={`https://suttacentral.net/${suttaId}/en/bodhi#${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`}
            target='_blank'>
            English (Bodhi)
            <Icon>open_in_new</Icon>
          </a>
          : null
        }
      </CardActions>
    </Card>
  }

  render() {
    return (
      <div className="App">
        { this.renderSelection() }
        { this.renderResults() }

        <Card style={{margin: '15px'}}>
        </Card>
      </div>
    );
  }
}

export default App;
