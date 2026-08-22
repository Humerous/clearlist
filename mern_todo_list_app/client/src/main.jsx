import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/manrope';

import App from './App';
import { store } from './app/store';
import './styles.css';

function handleMobileAuthNavigation(event) {
  const action = event.target.closest('.mobile-menu-action');

  if (!action) return;

  const label = action.querySelector('strong')?.textContent?.trim();

  if (label !== 'Log in' && label !== 'Create account') return;

  window.setTimeout(() => {
    const authCard = document.querySelector('.auth-card');

    if (!authCard) return;

    authCard.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    const fieldName = label === 'Create account' ? 'name' : 'email';

    window.setTimeout(() => {
      authCard.querySelector(`input[name="${fieldName}"]`)?.focus({
        preventScroll: true,
      });
    }, 450);
  }, 50);
}

document.addEventListener('click', handleMobileAuthNavigation);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
