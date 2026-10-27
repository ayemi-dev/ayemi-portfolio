/**
 * Prerenderizado
 *
 * Una aplicación de React sirve un `<div id="root">` vacío: sin JavaScript no
 * hay nada que leer, y eso incluye a los buscadores y a las vistas previas de
 * los enlaces. Para un portafolio, que existe justamente para encontrarse, eso
 * no sirve.
 *
 * Este paso corre después de `vite build` y escribe el HTML de cada ruta:
 *
 *   dist/index.html
 *   dist/portafolio/index.html
 *   dist/portafolio/<slug>/index.html
 *   dist/sitemap.xml
 *
 * Tanto la reescritura de Vercel como la de nginx sirven un archivo estático si
 * existe antes de caer en index.html, así que estas páginas se entregan tal
 * cual y el navegador solo tiene que hidratarlas.
 *
 * Se usa `prerenderToNodeStream` de react-dom/static, no `renderToString`:
 * espera a que se resuelvan los límites de Suspense, así que las secciones que
 * se cargan en diferido (La Fábrica y el orbital) también acaban en el HTML.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const RAIZ = process.cwd();
const DIST = path.join(RAIZ, 'dist');

/* ── Globales mínimos del navegador ─────────────────────────────────────────
   Los componentes solo tocan el DOM dentro de efectos, que no corren al
   prerenderizar. Estos apaños cubren lo que se lee durante el primer render. */
const almacen = new Map();

globalThis.window = globalThis;
globalThis.document = {
  documentElement: {
    setAttribute() {},
    getAttribute: () => null,
    classList: { add() {}, remove() {} },
    style: {},
  },
  body: { style: {} },
  getElementById: () => null,
  querySelector: () => null,
  addEventListener() {},
  removeEventListener() {},
};
globalThis.localStorage = {
  getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
  setItem: (k, v) => almacen.set(k, v),
  removeItem: (k) => almacen.delete(k),
};
globalThis.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/** Vuelca el flujo del prerenderizado a una cadena. */
async function aTexto(flujo) {
  const trozos = [];
  for await (const trozo of flujo) trozos.push(Buffer.from(trozo));
  return Buffer.concat(trozos).toString('utf8');
}

/** Escapa lo que va dentro de un atributo HTML. */
const escapar = (texto) =>
  String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

async function main() {
  const plantilla = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

  const servidor = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });

  try {
    const React = (await import('react')).default;
    const { prerenderToNodeStream } = await import('react-dom/static');
    /* react-router v7 consolidó los exports: StaticRouter vive en el paquete
       `react-router`, no en `react-router-dom/server` como en v6. */
    const { StaticRouter } = await import('react-router');

    await servidor.ssrLoadModule('/src/i18n.js');
    const { default: App } = await servidor.ssrLoadModule('/src/App.jsx');
    const { PIEZAS, buscarLinea, rutaDePieza } = await servidor.ssrLoadModule(
      '/src/config/piezas.js'
    );
    const { RUTA_PCB, RUTA_PORTAFOLIO } = await servidor.ssrLoadModule(
      '/src/config/secciones.js'
    );
    const { SITIO } = await servidor.ssrLoadModule('/src/config/sitio.js');

    /* Rutas a generar, cada una con su título y descripción propios: una ficha
       compartida en un chat debe decir de qué pieza habla.
       `imagen` es opcional: solo las rutas que necesitan una vista previa
       propia en redes la declaran (ver servicio-pcb, Req. 1.3). Las demás
       conservan la og:image de la plantilla (index.html), sin tocarla. */
    const rutas = [
      {
        url: '/',
        archivo: 'index.html',
        titulo: null, // se conserva el de la plantilla
        descripcion: null,
      },
      {
        url: RUTA_PORTAFOLIO,
        archivo: path.join('portafolio', 'index.html'),
        titulo: 'Portafolio · Ayemi',
        descripcion:
          'El tablero de La Fábrica: ocho líneas de producción, del microcontrolador a la nube, con las piezas entregadas y las plazas libres a la vista.',
      },
      {
        url: RUTA_PCB,
        archivo: path.join('pcb', 'index.html'),
        titulo: 'Diseño de PCBs · Ayemi',
        descripcion:
          'Diseñamos tu placa en KiCad y te entregamos Gerber, BOM y CPL listos para fabricar en JLCPCB. Mira el proceso paso a paso y lo que recibes en cada uno.',
        imagen: '/pcb/og-pcb.png',
      },
      ...PIEZAS.map((pieza) => {
        const linea = buscarLinea(pieza.linea);
        return {
          url: rutaDePieza(pieza.slug),
          /* `rutaDePieza` devuelve `/portafolio/<slug>`: se le quita la barra
             inicial para que no rompa el join de rutas del sistema. */
          archivo: path.join(
            ...rutaDePieza(pieza.slug).replace(/^\//, '').split('/'),
            'index.html'
          ),
          titulo: `${pieza.titulo} · Ayemi`,
          descripcion:
            pieza.resuelve ??
            `Pieza de la línea ${linea?.id ?? ''} de La Fábrica de Ayemi.`,
        };
      }),
    ];

    for (const ruta of rutas) {
      const { prelude } = await prerenderToNodeStream(
        React.createElement(
          StaticRouter,
          { location: ruta.url },
          React.createElement(App)
        )
      );

      const cuerpo = await aTexto(prelude);

      /* Un solo dominio: todo lo absoluto de la plantilla sale de SITIO.url. */
      let html = plantilla.replaceAll('__SITIO_URL__', SITIO.url).replace(
        '<div id="root"></div>',
        `<div id="root">${cuerpo}</div>`
      );

      if (ruta.titulo) {
        html = html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${escapar(ruta.titulo)}</title>`
        );
        html = html.replace(
          /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
          `$1${escapar(ruta.titulo)}$2`
        );
      }

      if (ruta.descripcion) {
        html = html.replace(
          /(<meta\s+name="description"\s+content=")[^"]*(")/,
          `$1${escapar(ruta.descripcion)}$2`
        );
        html = html.replace(
          /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
          `$1${escapar(ruta.descripcion)}$2`
        );
      }

      /* og:image propia, en URL absoluta: Facebook y demás redes no resuelven
         rutas relativas al componer la vista previa. Las rutas que no
         declaran `imagen` usan la de la plantilla, ya absoluta. */
      if (ruta.imagen) {
        const imagen = escapar(`${SITIO.url}${ruta.imagen}`);
        html = html
          .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${imagen}$2`)
          .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${imagen}$2`);
      }

      /* Enlace canónico: evita que la misma pieza se indexe por varias URL. */
      const canonico = `${SITIO.url}${ruta.url === '/' ? '/' : ruta.url}`;
      html = html.replace(
        '</head>',
        `  <link rel="canonical" href="${escapar(canonico)}" />\n  <meta property="og:url" content="${escapar(canonico)}" />\n  </head>`
      );

      /* Guardia: ninguna ruta sale con otro dominio ni con una imagen relativa.
         Si pasa, el build falla aquí y no en la vista previa de Facebook. */
      const absolutas = [
        ...html.matchAll(/(?:og:image|twitter:image|og:url)"\s+content="([^"]+)"/g),
        ...html.matchAll(/rel="canonical"\s+href="([^"]+)"/g),
      ].map((m) => m[1]);
      const fuera = absolutas.filter((u) => !u.startsWith(`${SITIO.url}/`));
      if (html.includes('__SITIO_URL__') || fuera.length) {
        throw new Error(
          `${ruta.url}: URL fuera de ${SITIO.url} → ${fuera.join(', ') || '__SITIO_URL__ sin sustituir'}`
        );
      }

      const destino = path.join(DIST, ruta.archivo);
      await fs.mkdir(path.dirname(destino), { recursive: true });
      await fs.writeFile(destino, html, 'utf8');

      console.log(
        `  ${ruta.url.padEnd(34)} → ${ruta.archivo.replace(/\\/g, '/').padEnd(40)} ${cuerpo.length} car.`
      );
    }

    /* ── sitemap.xml ─────────────────────────────────────────────────────── */
    const hoy = new Date().toISOString().slice(0, 10);
    const entradas = rutas
      .map(
        (ruta) =>
          `  <url>\n    <loc>${SITIO.url}${ruta.url}</loc>\n` +
          `    <lastmod>${hoy}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>${ruta.url === '/' ? '1.0' : '0.7'}</priority>\n  </url>`
      )
      .join('\n');

    await fs.writeFile(
      path.join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entradas}\n</urlset>\n`,
      'utf8'
    );

    /* ── robots.txt ─────────────────────────────────────────────────────── */
    /* Se escribe aquí, no en public/, para que apunte siempre al mismo dominio
       que el sitemap y los canónicos. */
    await fs.writeFile(
      path.join(DIST, 'robots.txt'),
      '# Ayemi · Fábrica de software e innovación\n# Ingeniería que fluye\n\n' +
        `User-agent: *\nAllow: /\n\nSitemap: ${SITIO.url}/sitemap.xml\n`,
      'utf8'
    );

    console.log(`\n  sitemap.xml con ${rutas.length} URL · robots.txt → ${SITIO.url}`);
    console.log('Prerenderizado completo.');
  } finally {
    await servidor.close();
  }
}

main().catch((error) => {
  console.error('El prerenderizado falló:', error);
  process.exit(1);
});
