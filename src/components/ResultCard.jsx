import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';

import { useStore } from '../state';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../assets/styles.css';

export default function ResultCard(props) {
  const { data } = props;

  const toggleSnackbar = useStore((state) => state.toggleSnackbar);

  const [suttaId, ptsRef] = data;

  const bookId = suttaId.match(/[^0-9]+/gi)[0];
  const translator = ['vb'].includes(bookId)
    ? 'thittila'
    : ['tha-ap', 'thi-ap'].includes(bookId)
    ? 'walters'
    : ['dt', 'ya'].includes(bookId)
    ? 'unarada'
    : 'sujato';
  const referral = window.location.origin.split('://')[1];

  const englishTranslations = [
    'mn',
    'sn',
    'an',
    'dn',
    'dhp',
    'iti',
    'snp',
    'vb',
    'thag',
    'thig',
    'ud',
    'thi-ap',
    'tha-ap',
    'dt',
    'ya',
  ];

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
                  onCopy={() => toggleSnackbar()}
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
          {bookId && englishTranslations.includes(bookId) && (
            <Button
              variant="outlined"
              href={`https://suttacentral.net/${suttaId}/en/${translator}#${ptsRef}?ref=${referral}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              English
              <OpenInNewRoundedIcon className="buttonIcon" fontSize="inherit" />
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
}
