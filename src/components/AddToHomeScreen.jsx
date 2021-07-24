import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AddToHomeScreenRoundedIcon from '@material-ui/icons/AddToHomeScreenRounded';

import { useSelector, useDispatch } from 'react-redux';

import { setDeferredInstallPrompt } from '../state';
import '../assets/styles.css';

export default function AddToHomeScreen() {
  const dispatch = useDispatch();

  const deferredInstallPrompt = useSelector(
    (state) => state.deferredInstallPrompt
  );

  // check if is installable on device
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('before install prompt', e);
    dispatch(setDeferredInstallPrompt(e));
  });

  // check if user is installing
  window.addEventListener('appinstalled', (e) => {
    console.log('app installed', e);
    dispatch(setDeferredInstallPrompt(null));
  });

  async function handleInstallClick() {
    deferredInstallPrompt.prompt();

    const choiceResult = await deferredInstallPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA prompt');
      dispatch(setDeferredInstallPrompt(null));
    } else {
      console.log('User dismissed the PWA prompt');
    }
  }

  return (
    <Collapse
      in={deferredInstallPrompt}
      component="aside"
      className="addToHomeScreen"
    >
      <Alert
        variant="filled"
        severity="info"
        classes={{ icon: 'addToHomeScreenIcon' }}
        icon={<AddToHomeScreenRoundedIcon />}
        action={[
          <IconButton
            key="1"
            aria-label="add to home screen"
            color="inherit"
            onClick={handleInstallClick}
          >
            <CheckRoundedIcon fontSize="inherit" />
          </IconButton>,
          <IconButton
            key="2"
            aria-label="don't add to home screen"
            color="inherit"
            onClick={() => {
              dispatch(setDeferredInstallPrompt(null));
            }}
          >
            <CloseRoundedIcon fontSize="inherit" />
          </IconButton>,
        ]}
      >
        <AlertTitle>Use offline</AlertTitle>
        Add this tool to your homescreen to use offline
      </Alert>
    </Collapse>
  );
}
