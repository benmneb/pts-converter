import React, { Component } from 'react'

import {
  Card,
  CardActions,
  CardActionArea,
  Typography,
  CardContent,
  Icon,
} from '@material-ui/core'

export default class ResultCard extends Component {
  render() {
    const [suttaId, ptsRef] = this.props.data;

    console.log('this.props.data', this.props.data)
    console.log('suttaId', suttaId)
    console.log('ptsRef', ptsRef)
  
    const bookId = suttaId.match(/[^0-9]+/gi);

    return (
    <Card style={{ margin: '15px' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { suttaId.toUpperCase() }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <a href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}`} target='_blank' rel="noopener noreferrer">
          Pali
          <Icon>open_in_new</Icon>
        </a>
        { bookId && ['mn', 'sn', 'an', 'dn', 'dhp', 'iti'].includes(bookId[0])
          ? <a
            href={`https://suttacentral.net/${suttaId}/en/sujato#${ptsRef}`}
            target='_blank' rel="noopener noreferrer">
            English (Sujato)
            <Icon>open_in_new</Icon>
          </a>
          : null
        }
        { bookId && ['mn', 'sn', 'an'].includes(bookId[0])
          ? <a
            href={`https://suttacentral.net/${suttaId}/en/bodhi`}
            target='_blank' rel="noopener noreferrer">
            English (Bodhi)
            <Icon>open_in_new</Icon>
          </a>
          : null
        }
      </CardActions>
    </Card>
    )
  }
}
