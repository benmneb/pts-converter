import React, { Component } from 'react'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader'

import '../assets/styles.css'

export default class ResultCard extends Component {
  render() {
    const [suttaId, ptsRef] = this.props.data;

    console.log('this.props.data', this.props.data)
    console.log('suttaId', suttaId)
    console.log('ptsRef', ptsRef)
  
    const bookId = suttaId.match(/[^0-9]+/gi)[0];
    const translator = ['snp'].includes(bookId) ? 'mills' : 'sujato';
    const referral = window.location.origin.split('https://')[1]
    
    return (
    <Card variant="outlined" elevation={0} className="resultCard">
      <CardHeader title={ suttaId.toUpperCase() } subheader="Select a language to read this sutta:">
      </CardHeader>
        <CardActions className="resultCardActions">
          <Button 
            variant="outlined"
            href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}?ref=${referral}`}
            target='_blank' 
            rel="noopener noreferrer"
          >
            Pali
            <Icon fontSize="small" className="buttonIcon">open_in_new</Icon>
          </Button>
          { bookId && ['mn', 'sn', 'an', 'dn', 'dhp', 'iti', 'snp'].includes(bookId)
            ? <Button variant="outlined"
                href={`https://suttacentral.net/${suttaId}/en/${translator}#${ptsRef}?ref=${referral}`}
                target='_blank' 
                rel="noopener noreferrer"
              >
                English
              <Icon fontSize="small" className="buttonIcon">open_in_new</Icon>
            </Button>
            : null
          }
        </CardActions>
      </Card>
    )
  }
}
