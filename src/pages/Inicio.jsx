import { lazy, Suspense } from 'react';
import Hero from '../features/hero/Hero';
import { Servicios } from '../features/servicios/Servicios';
import { OfertasEntrada } from '../features/ofertas/OfertasEntrada';
import { Metodo } from '../features/metodo/Metodo';
import { Posicionamiento } from '../features/posicionamiento/Posicionamiento';
import { AnticipoLaboratorio } from '../features/laboratorio/AnticipoLaboratorio';
import { QuienesSomos } from '../features/quienes/QuienesSomos';
import { Contacto } from '../features/contact/Contacto';

/**
 * Inicio · la landing
 * Manual de Identidad Ayemi · Edición 2.2
 *
 * NARRATIVA, en el orden de la navegación (config/secciones.js)
 *   Portada .............. la idea y lo que recibes (§1.6)
 *   Qué construimos ...... las cuatro líneas (§1.9), la capacidad técnica y
 *                          las ofertas de entrada; Hardware enlaza a /pcb
 *   Cómo trabajamos ...... el método y frente a las alternativas (§1.7, §1.8)
 *   Laboratorio .......... anticipo: los productos y la puerta a /laboratorio
 *   Quiénes somos ........ empresa familiar, valores y Emi (§1.1, §1.4, §4)
 *   Contacto ............. formulario y canales directos
 *
 * §1.10, regla 1 · Primero el resultado, después el método. La promesa abre y
 * el contacto cierra.
 *
 * QUÉ SALIÓ EN LA EDICIÓN 2.2
 * La sección del origen del nombre (§1.1: el nombre no se explica en público)
 * y el anticipo del tablero de La Fábrica, que enseñaba plazas vacías. El
 * trabajo entregado vive en /casos y lo propio en /laboratorio.
 *
 * RENDIMIENTO
 * El orbital es lo único en diferido: es pesado y no se ve en el primer
 * pantallazo. El respaldo reserva alto para que la página no salte al llegar
 * (§3.13: el sistema no se mueve a saltos).
 */

const TechStack = lazy(() =>
  import('../features/stack/TechStack').then((m) => ({ default: m.TechStack }))
);

/** Reserva de espacio mientras llega el bloque diferido. */
const Reserva = ({ id, alto = '60vh' }) => (
  <div id={id} style={{ minHeight: alto }} aria-hidden="true" />
);

export const Inicio = () => (
  <>
    <div id="inicio">
      <Hero />
    </div>

    {/* ── Qué construimos ─────────────────────────────────────────────── */}
    <Servicios />
    <Suspense fallback={<Reserva id="capacidad" alto="80vh" />}>
      <TechStack />
    </Suspense>
    <OfertasEntrada fondo="profundo" />

    {/* ── Cómo trabajamos ─────────────────────────────────────────────── */}
    <Metodo />
    <Posicionamiento />

    <AnticipoLaboratorio />
    <QuienesSomos />
    <Contacto />
  </>
);
