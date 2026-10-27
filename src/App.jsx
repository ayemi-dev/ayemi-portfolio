import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Inicio } from './pages/Inicio';
import { Portafolio } from './pages/Portafolio';
import { Pcb } from './pages/Pcb';
import { RedireccionPieza } from './pages/RedireccionPieza';
import { NoEncontrada } from './pages/NoEncontrada';
import { FichaPieza } from './features/piezas/FichaPieza';
import { useAncla } from './hooks/useAncla';
import { useVistaDePagina } from './medicion/useVistaDePagina';
import { RUTA_PCB, RUTA_PORTAFOLIO } from './config/secciones';

/**
 * Armazón de la aplicación
 * Manual de Identidad Ayemi · Edición 2.0
 *
 * RUTAS
 *   /                      la landing, con el anticipo del portafolio
 *   /portafolio            el tablero completo de La Fábrica
 *   /portafolio/:slug      ficha de una pieza
 *   /pcb                   servicio de diseño de PCBs, destino del anuncio
 *   /piezas/:slug          dirección antigua, redirige a /portafolio/:slug
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

  /* El enrutado en cliente no resuelve las anclas por sí solo. */
  useAncla();
  useVistaDePagina();

  return (
    <div className="min-h-screen bg-lienzo font-sans text-texto">
      <a href="#contenido" className="ay-salto">
        {t('controles.saltarContenido')}
      </a>

      <Navbar />

      {/* La cabecera es fija: se compensa su alto para no tapar el contenido. */}
      <main id="contenido" className="pt-16">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path={RUTA_PORTAFOLIO} element={<Portafolio />} />
          <Route path={`${RUTA_PORTAFOLIO}/:slug`} element={<FichaPieza />} />
          <Route path={RUTA_PCB} element={<Pcb />} />
          {/* Dirección antigua de las fichas. Ver pages/RedireccionPieza.jsx */}
          <Route path="/piezas/:slug" element={<RedireccionPieza />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
