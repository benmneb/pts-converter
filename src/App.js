import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ptsStructure from './data/pts_structure.json'
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
import { get as gv } from 'lodash'

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
      <p>Bitte die gesuchte PTS Stelle auswählen / Please select the pts position you want to look up:</p>
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
            .keys(ptsStructure)
            .sort((a, b) => b.startsWith('b') ? -1 : a < b)
            .map(k => <MenuItem value={k} key={k}>{k}</MenuItem>)}
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
          { typeof ptsStructure[this.state.selectedBook] !== 'undefined'
            ? Object
              .keys(ptsStructure[this.state.selectedBook])
              .filter(x => x !== '')
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
          disabled={!this.state.selectedBook || gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null) === null}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null) !== null
            ? Object
              .entries(gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}`, null))
              .filter(([k,v]) => v !== null)
              .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
            : Array.isArray(gv(ptsData, `${this.state.selectedBook}`, null))
              ? Object
                .entries(gv(ptsData, `${this.state.selectedBook}`, null))
                .filter(([k,v]) => v !== null)
                .map(([k,v]) => <MenuItem value={k} key={k}>{k}</MenuItem>)
              : null
          }
        </Select>
      </FormControl>
      <ul>
        <li>Wegen der guten Aufbereitung der Daten von SuttaCentral sollte es möglich sein, dass beim Öffnen der ersten beiden Links (Pali + Sujato) auch an die richtige Stelle im Text gesprungen wird. Dies sollte bei dem Bodhi Link ebenfalls häufig funktionieren.</li>
        <li>Es kann sein, dass eine PTS Stelle in den nächsten Text überläuft. Die Markierung ist nur der Anfang der Stelle. Durch Nachschlagen der nächst höheren PTS Nummer kann herausgefunden werden, wo die vorherige Stelle endet.</li>
        <li>"Network Error" kann bedeuten, dass der Link nicht existiert (es gibt z.B. nicht immer Übersetzungen von Bodhi)</li>
        <li>Fehler bitte melden</li>
        <li>uppercase: http://www.palitext.com/subpages/PTS_Abbreviations.pdf</li>
      </ul>
    </Card>
  }

  renderResults() {
    const result = gv(ptsData, `${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`, null)
    console.log(result, `${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`, ptsData)
    if (result === null) {
      return null
    }

    const sId = this.state.selectedBook + result.split(':')[0]
    const sPos = `pts-vp-pl${FROM_ROMAN[this.state.selectedDiv]}.${this.state.selectedNum}`
    const sPosBodhi = `${this.state.selectedBook}.${this.state.selectedDiv}.${this.state.selectedNum}`

    return <Card style={{ margin: '15px' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { sId.toUpperCase() }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <a href={`https://suttacentral.net/${sId}/pli/ms#${sPos}`} target='_blank'>
          Pali
          <Icon>open_in_new</Icon>
        </a>
        <a href={`https://suttacentral.net/${sId}/en/sujato#${sPos}`} target='_blank'>
          English (Sujato)
          <Icon>open_in_new</Icon>
        </a>
        <a href={`https://suttacentral.net/${sId}/en/bodhi#${sPosBodhi}`} target='_blank'>
          English (Bodhi)
          <Icon>open_in_new</Icon>
        </a>
      </CardActions>
    </Card>
  }

  render() {
    return (
      <div className="App">
        { this.renderSelection() }
        { this.renderResults() }
      </div>
    );
  }
}

export default App;
