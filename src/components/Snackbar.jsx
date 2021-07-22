import MuiSnackbar from '@material-ui/core/Snackbar';

import '../assets/styles.css';

export default function Snackbar(props) {
  const { open, close } = props;

  function handleClose(event, reason) {
    if (reason !== 'clickaway') {
      close();
    }
  }

  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">Sutta reference copied to clipboard</span>}
    />
  );
}
