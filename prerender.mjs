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
 *   dist/index.html                      con el JSON-LD `FAQPage`
 *   dist/laboratorio/index.html, dist/pcb/index.html…
 *   dist/proyectos/index.html            la galería
 *   dist/casos/<slug>/index.html         caso de cliente o pieza
 *   dist/proyectos/<slug>/index.html     demo del Laboratorio
 *   dist/sitemap.xml
 *
 * Cada ficha publicada (contenido/proyectos/) lleva su título, su resumen,
 * su primera imagen como og:image y un JSON-LD `CreativeWork`.
 *
 * `/casos` no se genera: es una 301 a `/proyectos#casos` en Vercel y nginx, y
 * el sitemap no lista URL que redirigen. Un caso de cliente pedido por
 * `/proyectos/<slug>` recibe un HTML que lleva a `/casos/<slug>`: su carpeta
 * de medios vive en esa ruta, y sin `index.html` nginx respondería 403.
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

/** Bloque JSON-LD. `<` va escapado para que ningún texto cierre el `<script>`. */
const bloqueJsonLd = (datos) =>
  `    <script type="application/ld+json">\n${JSON.stringify(datos, null, 2).replace(/</g, '\\u003c')}\n    </script>\n`;

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

    const { default: i18n } = await servidor.ssrLoadModule('/src/i18n.js');
    const { default: App } = await servidor.ssrLoadModule('/src/App.jsx');
    const { buscarLinea, piezasSinCaso, rutaDePieza } = await servidor.ssrLoadModule(
      '/src/config/piezas.js'
    );
    const {
      RUTA_CASOS,
      RUTA_ENLACES,
      RUTA_LABORATORIO,
      RUTA_PCB,
      RUTA_PRIVACIDAD,
      RUTA_PROYECTOS,
    } = await servidor.ssrLoadModule('/src/config/secciones.js');
    const { SITIO, PERFILES, esPendiente } = await servidor.ssrLoadModule('/src/config/sitio.js');
    const { proyectosPublicados, urlMedio } = await servidor.ssrLoadModule(
      '/src/config/proyectos.js'
    );

    /* El HTML estático sale en español, el idioma por defecto de i18n. */
    const IDIOMA = 'es';
    const t = i18n.getFixedT(IDIOMA);

    /* URL de cada ficha: los casos de clientes viven en /casos/<slug> y las
       demos del Laboratorio en /proyectos/<slug> (design.md, «Rutas»). */
    const urlDeProyecto = (p) =>
      `${p.tipo === 'laboratorio' ? RUTA_PROYECTOS : RUTA_CASOS}/${p.slug}`;
    const archivoDe = (url) => path.join(...url.replace(/^\//, '').split('/'), 'index.html');

    /* JSON-LD de una ficha: solo lo que la ficha declara. */
    const creativeWork = (p) => {
      const textos = p.textos[IDIOMA];
      return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: textos.titulo,
        description: textos.resumen,
        url: `${SITIO.url}${urlDeProyecto(p)}`,
        image: p.imagenes.map((img) => `${SITIO.url}${urlMedio(p.slug, img.src)}`),
        inLanguage: IDIOMA,
        ...(p.fecha ? { datePublished: p.fecha } : {}),
        ...(p.stack?.length ? { keywords: p.stack.join(', ') } : {}),
        creator: { '@type': 'Organization', name: SITIO.nombre, url: SITIO.url },
      };
    };

    /* JSON-LD de la portada: las mismas preguntas que pinta PreguntasFrecuentes. */
    const preguntas = t('confianza.preguntas.lista', { returnObjects: true });
    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (Array.isArray(preguntas) ? preguntas : []).map(({ p, r }) => ({
        '@type': 'Question',
        name: p,
        acceptedAnswer: { '@type': 'Answer', text: r },
      })),
    };
    if (!faqPage.mainEntity.length) {
      throw new Error('/: confianza.preguntas.lista está vacía, no hay FAQPage que escribir');
    }

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
        jsonLd: faqPage,
      },
      {
        url: RUTA_LABORATORIO,
        archivo: path.join('laboratorio', 'index.html'),
        titulo: 'Laboratorio · Ayemi',
        descripcion:
          'Lo que Ayemi construye por iniciativa propia y publica abierto: Chispa, Enlace e Impulso por Ayemi, placas educativas con su diseño en GitHub, y WaBot, avisos por WhatsApp.',
      },
      {
        url: RUTA_PCB,
        archivo: path.join('pcb', 'index.html'),
        titulo: 'Diseño de PCBs · Ayemi',
        descripcion:
          'Diseñamos tu placa en KiCad y te entregamos Gerber, BOM y CPL listos para fabricar en JLCPCB. Mira el proceso paso a paso y lo que recibes en cada uno.',
        imagen: '/pcb/og-pcb.png',
      },
      {
        url: RUTA_ENLACES,
        archivo: path.join('enlaces', 'index.html'),
        titulo: 'Enlaces · Ayemi',
        descripcion:
          'Lo construimos. Es tuyo. WhatsApp, cotización de tu placa, diagnóstico de 30 min, el Laboratorio y el trabajo de Ayemi, en un solo lugar.',
      },
      {
        url: RUTA_PRIVACIDAD,
        archivo: path.join('privacidad', 'index.html'),
        titulo: 'Aviso de privacidad · Ayemi',
        descripcion:
          'Qué datos usa Ayemi, para qué, con quién los comparte y cómo ejercer tus derechos ARCO. Incluye cookies de GA4, Meta Pixel y Microsoft Clarity.',
      },
      {
        url: RUTA_PROYECTOS,
        archivo: path.join('proyectos', 'index.html'),
        titulo: `${t('nav.proyectos')} · Ayemi`,
        descripcion: t('proyectos.entradilla'),
      },
      /* Una ruta por ficha publicada, con su título, su resumen y su primera
         imagen. El esquema exige al menos una imagen en toda ficha publicada. */
      ...proyectosPublicados().map((p) => {
        const textos = p.textos[IDIOMA];
        const [primera] = p.imagenes;
        return {
          url: urlDeProyecto(p),
          archivo: archivoDe(urlDeProyecto(p)),
          titulo: `${textos.titulo} · Ayemi`,
          descripcion: textos.resumen,
          imagen: urlMedio(p.slug, primera.src),
          imagenAncho: primera.ancho,
          imagenAlto: primera.alto,
          imagenAlt: primera.alt[IDIOMA],
          jsonLd: creativeWork(p),
        };
      }),
      /* Las piezas con caso comparten ruta con él: ya salen arriba. */
      ...piezasSinCaso().map((pieza) => {
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
            `Trabajo entregado por Ayemi, línea ${linea?.id ?? ''}.`,
        };
      }),
    ];

    /* JSON-LD · `sameAs` con los perfiles publicados (GitHub y las redes con
       URL). Se reescribe el bloque como JSON para no dejar un marcador que
       rompa el JSON en desarrollo. Sin perfiles, no se añade la clave. */
    const sameAs = PERFILES.map((p) => p.url).filter((url) => !esPendiente(url));
    const conSameAs = (html) =>
      html.replace(
        /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
        (_, abre, json, cierra) => {
          const datos = JSON.parse(json);
          if (sameAs.length) datos.sameAs = sameAs;
          return `${abre}\n${JSON.stringify(datos, null, 2)}\n    ${cierra}`;
        }
      );

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
      let html = conSameAs(plantilla.replaceAll('__SITIO_URL__', SITIO.url)).replace(
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
        html = html.replace(
          /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
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
        html = html.replace(
          /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
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

      /* Las fichas declaran las medidas y el texto alternativo de su imagen:
         los de la plantilla describen otra (1200 × 630, el logotipo). */
      if (ruta.imagenAncho && ruta.imagenAlto) {
        html = html
          .replace(/(<meta\s+property="og:image:width"\s+content=")[^"]*(")/, `$1${ruta.imagenAncho}$2`)
          .replace(/(<meta\s+property="og:image:height"\s+content=")[^"]*(")/, `$1${ruta.imagenAlto}$2`);
      }
      if (ruta.imagenAlt) {
        const alt = escapar(ruta.imagenAlt);
        html = html
          .replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/, `$1${alt}$2`)
          .replace(/(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/, `$1${alt}$2`);
      }

      /* JSON-LD propio de la ruta (`FAQPage` en la portada, `CreativeWork` en
         cada ficha), después del de la organización. */
      if (ruta.jsonLd) {
        html = html.replace('</head>', `${bloqueJsonLd(ruta.jsonLd)}  </head>`);
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

    /* ── Casos de clientes pedidos por /proyectos/<slug> ──────────────────
       En la app, DemoOCaso los lleva a /casos/<slug>. En el servidor esa ruta
       es la carpeta de medios de la ficha: sin index.html, nginx responde 403
       y Vercel sirve la portada. Este HTML lleva a la página del caso
       conservando los parámetros (UTM) y el ancla; sin JavaScript, la
       redirección por meta refresh. No entra en el sitemap. */
    const redirigidas = [];
    for (const p of proyectosPublicados().filter((p) => p.tipo === 'caso-cliente')) {
      const origen = `${RUTA_PROYECTOS}/${p.slug}`;
      const destino = urlDeProyecto(p);
      /* Con barra final: es la carpeta con el index.html prerenderizado, así
         nginx no añade otro salto (301 a la barra) y `vite preview` sirve ese
         HTML en lugar de la portada. El canónico va sin barra, como el de la
         página del caso. */
      const destinoJs = JSON.stringify(`${destino}/`).replace(/</g, '\\u003c');
      const html =
        `<!doctype html>\n<html lang="${IDIOMA}">\n  <head>\n` +
        `    <meta charset="UTF-8" />\n` +
        `    <title>${escapar(p.textos[IDIOMA].titulo)} · Ayemi</title>\n` +
        `    <link rel="canonical" href="${escapar(`${SITIO.url}${destino}`)}" />\n` +
        `    <meta http-equiv="refresh" content="0; url=${escapar(`${destino}/`)}" />\n` +
        `    <script>location.replace(${destinoJs} + location.search + location.hash);</script>\n` +
        `  </head>\n  <body>\n` +
        `    <a href="${escapar(`${destino}/`)}">${escapar(p.textos[IDIOMA].titulo)}</a>\n` +
        `  </body>\n</html>\n`;
      const archivo = archivoDe(origen);
      await fs.mkdir(path.dirname(path.join(DIST, archivo)), { recursive: true });
      await fs.writeFile(path.join(DIST, archivo), html, 'utf8');
      redirigidas.push(origen);
      console.log(`  ${origen.padEnd(34)} → ${archivo.replace(/\\/g, '/').padEnd(40)} lleva a ${destino}`);
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
    console.log(`  JSON-LD sameAs: ${sameAs.join(', ') || '(sin perfiles)'}`);
    console.log(`  Redirecciones a /casos/<slug>: ${redirigidas.join(', ') || '(ninguna)'}`);
    console.log('Prerenderizado completo.');
  } finally {
    await servidor.close();
  }
}

main().catch((error) => {
  console.error('El prerenderizado falló:', error);
  process.exit(1);
});
