import { render } from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { Provider } from 'react-redux';
import { store } from './state';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
