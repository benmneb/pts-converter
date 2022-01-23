import MuiSnackbar from '@material-ui/core/Snackbar';

import { useStore } from '../state';
import '../assets/styles.css';

export default function Snackbar() {
  const showSnackbar = useStore((state) => state.showSnackbar);

  const toggleSnackbar = useStore((state) => state.toggleSnackbar);

  function handleClose(event, reason) {
    if (reason !== 'clickaway') {
      toggleSnackbar();
    }
  }

  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={showSnackbar}
      autoHideDuration={3000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">Sutta reference copied to clipboard</span>}
    />
  );
}
