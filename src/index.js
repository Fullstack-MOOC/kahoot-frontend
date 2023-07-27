import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import { Provider } from 'react-redux';
import App from './components/app';
import { kahootStore } from './stores/kahootStore';

const root = createRoot(document.getElementById('main'));

root.render(
  <Provider store={kahootStore}>
    <App />
  </Provider>,
  document.getElementById('main'),
);
