import React, { Component } from 'react'

import {
  Card,
  CardActions,
  Icon,
  Button,
  CardHeader,
} from '@material-ui/core'

import '../assets/styles.css'

export default class ResultCard extends Component {
  render() {
    const [suttaId, ptsRef] = this.props.data;

    console.log('this.props.data', this.props.data)
    console.log('suttaId', suttaId)
    console.log('ptsRef', ptsRef)
  
    const bookId = suttaId.match(/[^0-9]+/gi);

    return (
    <Card variant="outlined" elevation={0} className="resultCard">
      <CardHeader title={ suttaId.toUpperCase() } subheader="Select a language to read this sutta:">
      </CardHeader>
        <CardActions className="resultCardActions">
          <Button variant="outlined" href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}`} target='_blank' rel="noopener noreferrer">
              Pali 
            <Icon fontSize="small">open_in_new</Icon>
          </Button>
          { bookId && ['mn', 'sn', 'an', 'dn', 'dhp', 'iti'].includes(bookId[0])
            ? <Button variant="outlined"
              href={`https://suttacentral.net/${suttaId}/en/sujato#${ptsRef}`}
              target='_blank' rel="noopener noreferrer">
                English (Sujato) 
              <Icon fontSize="small">open_in_new</Icon>
            </Button>
            : null
          }
          { bookId && ['mn', 'sn', 'an'].includes(bookId[0])
            ? <Button variant="outlined"
              href={`https://suttacentral.net/${suttaId}/en/bodhi`}
              target='_blank' rel="noopener noreferrer">
                English (Bodhi)
              <Icon fontSize="small">open_in_new</Icon>
            </Button>
            : null
          }
        </CardActions>
      </Card>
    )
  }
}
