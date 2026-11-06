import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Inicio } from './pages/Inicio';
import { Portafolio } from './pages/Portafolio';
import { Pcb } from './pages/Pcb';
import { RedireccionPieza } from './pages/RedireccionPieza';
import { RedireccionPlaca } from './pages/RedireccionPlaca';
import { NoEncontrada } from './pages/NoEncontrada';
import { Privacidad } from './pages/Privacidad';
import { Enlaces } from './pages/Enlaces';
import { Casos } from './pages/Casos';
import { CasoOFicha } from './pages/CasoOFicha';
import { AvisoCookies } from './components/AvisoCookies';
import { useAncla } from './hooks/useAncla';
import { useVistaDePagina } from './medicion/useVistaDePagina';
import {
  RUTA_CASOS,
  RUTA_ENLACES,
  RUTA_PCB,
  RUTA_PORTAFOLIO,
  RUTA_PRIVACIDAD,
} from './config/secciones';
import { RUTA_CORTA_PLACA } from './config/placas';

/**
 * Armazón de la aplicación
 * Manual de Identidad Ayemi · Edición 2.0
 *
 * RUTAS
 *   /                      la landing, con el anticipo del portafolio
 *   /portafolio            el tablero completo de La Fábrica
 *   /portafolio/:slug      dirección vieja, redirige a /casos/:slug
 *   /pcb                   servicio de diseño de PCBs, destino del anuncio
 *   /privacidad            aviso de privacidad (LFPDPPP)
 *   /enlaces               bio de las redes, sin cabecera ni pie
 *   /casos                 trabajo entregado: casos de estudio y fichas
 *   /casos/:slug           caso de estudio, o ficha de una pieza sin caso
 *   /p/:corto              dirección corta del QR de una placa, redirige a /pcb#<slug>
 *   /piezas/:slug          dirección antigua, redirige a /casos/:slug
 *   cualquier otra         no encontrada
 *
 * DOS CARAS, UN DESPLIEGUE
 * La landing presenta Ayemi; el portafolio es un apartado con profundidad. Van
 * en el mismo proyecto porque comparten todo lo caro: tokens, Emi, el logotipo,
 * la iconografía, los componentes y el i18n en dos idiomas. Separarlos en dos
 * repositorios habría duplicado ese sistema, y dos copias se separan siempre.
 *
 * Las fichas tienen URL propia a propósito: cada trabajo es compartible y
 * indexable por separado, que es lo que se le pide a un portafolio.
 *
 * §5.1 · El lienzo y el texto salen de los roles, no de colores literales.
 * §5.5 · Enlace de salto al contenido para navegación por teclado.
 */
function App() {
  const { t } = useTranslation();
  /* /enlaces es la bio de las redes: solo logotipo y botones. */
  const conMarco = useLocation().pathname.replace(/\/$/, '') !== RUTA_ENLACES;

  /* El enrutado en cliente no resuelve las anclas por sí solo. */
  useAncla();
  useVistaDePagina();

  return (
    <div className="min-h-screen bg-lienzo font-sans text-texto">
      <a href="#contenido" className="ay-salto">
        {t('controles.saltarContenido')}
      </a>

      {conMarco && <Navbar />}

      {/* La cabecera es fija: se compensa su alto para no tapar el contenido. */}
      <main id="contenido" className={conMarco ? 'pt-16' : undefined}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path={RUTA_PORTAFOLIO} element={<Portafolio />} />
          {/* Fichas viejas: redirigen a /casos/<slug>. Ver RedireccionPieza. */}
          <Route path={`${RUTA_PORTAFOLIO}/:slug`} element={<RedireccionPieza />} />
          <Route path={RUTA_PCB} element={<Pcb />} />
          <Route path={RUTA_PRIVACIDAD} element={<Privacidad />} />
          <Route path={RUTA_ENLACES} element={<Enlaces />} />
          <Route path={RUTA_CASOS} element={<Casos />} />
          <Route path={`${RUTA_CASOS}/:slug`} element={<CasoOFicha />} />
          {/* Dirección antigua de las fichas. Ver pages/RedireccionPieza.jsx */}
          <Route path="/piezas/:slug" element={<RedireccionPieza />} />
          {/* QR de las placas. Ver pages/RedireccionPlaca.jsx */}
          <Route path={`${RUTA_CORTA_PLACA}/:corto`} element={<RedireccionPlaca />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      {conMarco && <Footer />}
      <AvisoCookies />
    </div>
  );
}

export default App;
