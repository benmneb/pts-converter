import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';

import { useDispatch } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { toggleSnackbar } from '../state';
import '../assets/styles.css';

export default function ResultCard(props) {
  const { data } = props;

  const dispatch = useDispatch();

  const [suttaId, ptsRef] = data;

  const bookId = suttaId.match(/[^0-9]+/gi)[0];
  const translator = ['vb'].includes(bookId) ? 'thittila' : 'sujato';
  const referral = window.location.origin.split('://')[1];

  return (
    <>
      <Card elevation={0} className="resultCard">
        <CardHeader
          className="resultCardHeader"
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
                  onCopy={() => dispatch(toggleSnackbar())}
                >
                  <FileCopyOutlinedIcon color="disabled" fontSize="small" />
                </CopyToClipboard>
              </Tooltip>
            </div>
          }
          subheader="Read this sutta:"
        />
        <CardActions className="resultCardActions">
          <Button
            variant="outlined"
            href={`https://suttacentral.net/${suttaId}/pli/ms#${ptsRef}?ref=${referral}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pali
            <OpenInNewRoundedIcon className="buttonIcon" fontSize="inherit" />
          </Button>
          {bookId &&
            ['mn', 'sn', 'an', 'dn', 'dhp', 'iti', 'snp', 'vb'].includes(
              bookId
            ) && (
              <Button
                variant="outlined"
                href={`https://suttacentral.net/${suttaId}/en/${translator}#${ptsRef}?ref=${referral}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                English
                <OpenInNewRoundedIcon
                  className="buttonIcon"
                  fontSize="inherit"
                />
              </Button>
            )}
        </CardActions>
      </Card>
    </>
  );
}
