import { render } from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

render(<App />, document.getElementById('root'));

serviceWorkerRegistration.register();
