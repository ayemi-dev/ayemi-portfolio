import { lazy, Suspense } from 'react';
import Hero from '../features/hero/Hero';
import { Servicios } from '../features/servicios/Servicios';
import { OfertasEntrada } from '../features/ofertas/OfertasEntrada';
import { Metodo } from '../features/metodo/Metodo';
import { AnticipoFabrica } from '../features/piezas/AnticipoFabrica';
import { Posicionamiento } from '../features/posicionamiento/Posicionamiento';
import { Origen } from '../features/origen/Origen';
import { Contacto } from '../features/contact/Contacto';

/**
 * Inicio · la landing
 * Manual de Identidad Ayemi · Edición 2.0
 *
 * NARRATIVA
 *   Portada .......... qué obtienes y las tres pruebas (§1.6)
 *   Servicios ........ las tres líneas de servicio (§1.9)
 *   Método ........... cómo se trabaja y los cuatro valores (§1.4)
 *   Fábrica .......... anticipo: cifras, tres piezas y la puerta al tablero
 *   Capacidad ........ el sistema orbital de tecnologías
 *   Posicionamiento .. frente a qué y a quién se sirve (§1.7, §1.8)
 *   Origen ........... los tres nombres (§1.1)
 *   Contacto ......... formulario y canales directos
 *
 * §1.10, regla 1 · Primero el resultado, después el método. La promesa abre y
 * el origen de la marca cierra: la historia interesa cuando ya se demostró que
 * el trabajo se sostiene.
 *
 * QUÉ CAMBIÓ
 * La Fábrica venía entera aquí: contador, selector de ocho líneas, tablero,
 * índice de todas las piezas y nota. Era el bloque más pesado de la página y
 * el único de los ocho que era portafolio, así que esto no se leía como una
 * landing. Ahora el tablero vive en `/portafolio` y aquí queda el anticipo.
 *
 * RENDIMIENTO
 * El orbital es lo único que sigue en diferido: es pesado y no se ve en el
 * primer pantallazo. El respaldo reserva alto para que la página no salte al
 * llegar (§3.13: el sistema no se mueve a saltos). El anticipo ya no hace
 * falta diferirlo, porque es una reja de tres tarjetas.
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

    <Servicios />
    <OfertasEntrada fondo="profundo" />
    <Metodo />
    <AnticipoFabrica />

    <Suspense fallback={<Reserva id="capacidad" alto="80vh" />}>
      <TechStack />
    </Suspense>

    <Posicionamiento />
    <Origen />
    <Contacto />
  </>
);
