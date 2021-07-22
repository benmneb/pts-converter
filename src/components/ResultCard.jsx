import React, { Component, Fragment } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Snackbar } from '.';
import '../assets/styles.css';

export default class ResultCard extends Component {
  state = {
    showSnackbar: false,
  };

  render() {
    const [suttaId, ptsRef] = this.props.data;

    const bookId = suttaId.match(/[^0-9]+/gi)[0];
    const translator = ['snp'].includes(bookId) ? 'mills' : 'sujato';
    const referral = window.location.origin.split('://')[1];

    return (
      <Fragment>
        <Card elevation={0} className="resultCard">
          <CardHeader
            title={
              <div className="resultCardHeaderTitle">
                {suttaId.toUpperCase()}
                <Tooltip
                  title="Copy sutta reference"
                  placement="right"
                  className="cursorCopy"
                >
                  <CopyToClipboard
                    text={suttaId.toUpperCase()}
                    onCopy={() => this.setState({ showSnackbar: true })}
                  >
                    <Icon color="disabled">content_copy</Icon>
                  </CopyToClipboard>
                </Tooltip>
              </div>
            }
            subheader="Select a language to read this sutta:"
          />
          <CardActions className="resultCardActions">
            <Button
              variant="outlined"
              href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}?ref=${referral}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pali
              <Icon fontSize="small" className="buttonIcon">
                open_in_new
              </Icon>
            </Button>
            {bookId &&
            ['mn', 'sn', 'an', 'dn', 'dhp', 'iti', 'snp'].includes(bookId) ? (
              <Button
                variant="outlined"
                href={`https://suttacentral.net/${suttaId}/en/${translator}#${ptsRef}?ref=${referral}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                English
                <Icon fontSize="small" className="buttonIcon">
                  open_in_new
                </Icon>
              </Button>
            ) : null}
          </CardActions>
        </Card>
        <Snackbar
          open={this.state.showSnackbar}
          close={() => this.setState({ showSnackbar: false })}
        />
      </Fragment>
    );
  }
}
