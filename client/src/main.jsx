import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/manrope';

import App from './App';
import ClearlistLogo from './components/ClearlistLogo';
import { store } from './app/store';
import './styles.css';
import './scroll-top.css';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      className="scroll-top-button"
      type="button"
      aria-label="Scroll to top of Clearlist"
      onClick={scrollToTop}
    >
      <ClearlistLogo />
      <span>Clearlist</span>
      <span className="scroll-top-arrow" aria-hidden="true">↑</span>
    </button>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ScrollToTopButton />
    </Provider>
  </React.StrictMode>
);
