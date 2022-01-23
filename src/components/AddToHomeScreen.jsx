import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AddToHomeScreenRoundedIcon from '@material-ui/icons/AddToHomeScreenRounded';

import { useStore } from '../state';
import '../assets/styles.css';

export default function AddToHomeScreen() {
  const deferredInstallPrompt = useStore(
    (state) => state.deferredInstallPrompt
  );

  const setDeferredInstallPrompt = useStore(
    (state) => state.setDeferredInstallPrompt
  );

  // check if is installable on device
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setDeferredInstallPrompt(e);
  });

  // check if user has installed already
  window.addEventListener('appinstalled', () => {
    setDeferredInstallPrompt(null);
  });

  async function handleInstallClick() {
    deferredInstallPrompt.prompt();

    const choiceResult = await deferredInstallPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  }

  return (
    <Collapse
      in={Boolean(deferredInstallPrompt)}
      component="aside"
      className="addToHomeScreen"
    >
      <Alert
        variant="filled"
        severity="info"
        classes={{
          icon: 'addToHomeScreenIcon',
          message: 'addToHomeScreenMessage',
        }}
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
              setDeferredInstallPrompt(null);
            }}
          >
            <CloseRoundedIcon fontSize="inherit" />
          </IconButton>,
        ]}
      >
        <AlertTitle>Install this app to use it offline</AlertTitle>
      </Alert>
    </Collapse>
  );
}
