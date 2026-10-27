import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './i18n';
import App from './App.jsx';
import { iniciarMedicion } from './medicion/medicion';

// Solo en el navegador. Los scripts de terceros se cargan cuando la página ya
// cargó y el navegador está ocioso (ver medicion.js).
iniciarMedicion();

/**
 * Punto de entrada en el navegador.
 *
 * El build prerenderiza el HTML de cada ruta (ver `prerender.mjs`), así que aquí
 * hay que distinguir dos situaciones:
 *
 *   Con HTML previo ... se hidrata. El contenido ya está pintado y React solo
 *                       le engancha los escuchadores, así que no hay parpadeo.
 *   Sin HTML previo ... se monta desde cero. Es el caso de `npm run dev`.
 */

const raiz = document.getElementById('root');

const arbol = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (raiz.hasChildNodes()) {
  hydrateRoot(raiz, arbol);
} else {
  createRoot(raiz).render(arbol);
}
