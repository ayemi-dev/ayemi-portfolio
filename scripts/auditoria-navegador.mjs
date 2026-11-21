// Auditoría tipográfica del sitio de Ayemi con navegador real (R0.2).
//
//   npm run build && npm run preview          (en otra terminal)
//   npm run auditar [-- <base> [<salida.json>]]
//
// <base> vale http://localhost:4173 (vite preview) si no se indica. El informe
// JSON solo se escribe si se pasa <salida.json>. Sale con código 1 si hay
// algún fallo o si no hay servidor en <base>.
//
// Usa el Chrome instalado (playwright-core, canal `chrome`): no descarga
// navegadores.
//
// Por cada ruta × (escritorio, móvil) × (es, en):
//   - recorre todo elemento con texto visible propio (nodo de texto no vacío);
//   - lee font-family, font-style y font-weight computados;
//   - pide a Chrome (CDP, CSS.getPlatformFontsForNode) qué fuente pintó de
//     verdad cada elemento, para cazar glifos que caen a una fuente de respaldo;
//   - marca cursiva o negrita sintética: estilo o peso pedidos sin una cara
//     cargada en document.fonts que los cubra.
//
// Solo se admiten las tres familias del manual con sus pilas (§3.6).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , base = 'http://localhost:4173', salida] = process.argv;

// Una página por ficha publicada de contenido/proyectos/: los casos de
// clientes viven en /casos/<slug> y las demos del Laboratorio en
// /proyectos/<slug> (design.md, «Rutas»).
const PROYECTOS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'contenido', 'proyectos');
const FICHAS = fs
  .readdirSync(PROYECTOS)
  .map((carpeta) => path.join(PROYECTOS, carpeta, 'proyecto.json'))
  .filter((ruta) => fs.existsSync(ruta))
  .map((ruta) => JSON.parse(fs.readFileSync(ruta, 'utf8').replace(/^\uFEFF/, '')))
  .filter((ficha) => ficha.estado === 'publicado')
  .map((ficha) => (ficha.tipo === 'laboratorio' ? `/proyectos/${ficha.slug}` : `/casos/${ficha.slug}`));

const RUTAS = [
  ...new Set([
    '/',
    '/laboratorio',
    '/proyectos',
    ...FICHAS,
    '/casos',
    '/casos/ita-2026',
    '/casos/calculadora-series',
    '/casos/invitacion-boda',
    '/pcb',
    '/enlaces',
    '/privacidad',
    '/ruta-que-no-existe',
  ]),
];

try {
  await fetch(base);
} catch {
  console.error(`No hay servidor en ${base}. Corre «npm run build» y «npm run preview» antes de auditar.`);
  process.exit(1);
}

const PILAS = {
  'Plus Jakarta Sans':
    '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  'Instrument Serif': '"Instrument Serif", ui-serif, Georgia, Cambria, "Times New Roman", serif',
  'JetBrains Mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
const norm = (f) => f.replace(/'/g, '"').replace(/\s*,\s*/g, ', ').trim();

const VISTAS = [
  ['escritorio', { width: 1440, height: 900 }, false],
  ['movil', { width: 390, height: 844 }, true],
];

async function irA(p, ruta, lang) {
  await p.goto(base + (lang === 'en' ? '/' : ruta), { waitUntil: 'networkidle' });
  if (lang === 'en') {
    await p.getByRole('button', { name: /^EN$|idioma|language/i }).first().click();
    await p.waitForTimeout(200);
    if (ruta !== '/') {
      await p.evaluate((r) => {
        window.history.pushState({}, '', r);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, ruta);
      await p.waitForLoadState('networkidle');
    }
  }
  // Recorre la página para que carguen los bloques diferidos y las imágenes.
  await p.evaluate(async () => {
    const paso = Math.floor(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(500);
  await p.evaluate(() => document.fonts.ready);
}

async function auditar(p, cdp) {
  const datos = await p.evaluate(() => {
    const caras = [...document.fonts].filter((f) => f.status === 'loaded');
    const cubre = (familia, estilo, peso) =>
      caras.some((c) => {
        if (c.family.replace(/"/g, '') !== familia) return false;
        const est = c.style === 'normal' ? 'normal' : 'italic';
        if (est !== (estilo === 'normal' ? 'normal' : 'italic')) return false;
        const [a, b = a] = String(c.weight).split(' ').map(Number);
        return peso >= a && peso <= b;
      });
    const out = [];
    let i = 0;
    for (const el of document.querySelectorAll('body *')) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
      const propio = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('')
        .trim();
      if (!propio) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (el.closest('.sr-only')) continue; // solo lector de pantalla
      let op = el;
      let oculto = false;
      while (op) {
        if (getComputedStyle(op).opacity === '0') { oculto = true; break; }
        op = op.parentElement;
      }
      if (oculto) continue;
      const familia = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      const peso = Number(cs.fontWeight);
      el.setAttribute('data-aud', String(i));
      out.push({
        i: i++,
        tag: el.tagName.toLowerCase(),
        texto: propio.slice(0, 60),
        pila: cs.fontFamily,
        familia,
        estilo: cs.fontStyle,
        peso,
        sintesis: cs.fontSynthesis,
        caraReal: cubre(familia, cs.fontStyle, peso),
        lineas: Math.round(r.height / (parseFloat(cs.lineHeight) || r.height)),
      });
    }
    return out;
  });

  // Fuente que Chrome usó de verdad, por elemento.
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-aud]' });
  const pintadas = new Map();
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send('DOM.getAttributes', { nodeId });
    const idx = Number(attributes[attributes.indexOf('data-aud') + 1]);
    try {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      pintadas.set(idx, fonts);
    } catch {
      pintadas.set(idx, []);
    }
  }
  await p.evaluate(() => document.querySelectorAll('[data-aud]').forEach((e) => e.removeAttribute('data-aud')));

  return datos.map((d) => ({ ...d, pintada: pintadas.get(d.i) ?? [] }));
}

const navegador = await chromium.launch({ channel: 'chrome' });
const informe = [];

for (const [vista, viewport, movil] of VISTAS) {
  for (const lang of ['es', 'en']) {
    const ctx = await navegador.newContext({ viewport, isMobile: movil, deviceScaleFactor: movil ? 2 : 1 });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    for (const ruta of RUTAS) {
      await irA(p, ruta, lang);
      const elementos = await auditar(p, cdp);
      const familias = {};
      const pintadas = {};
      const fallos = [];
      for (const e of elementos) {
        familias[e.familia] = (familias[e.familia] ?? 0) + 1;
        for (const f of e.pintada) pintadas[f.postScriptName || f.familyName] = (pintadas[f.postScriptName || f.familyName] ?? 0) + f.glyphCount;
        const pilaOk = PILAS[e.familia] && norm(e.pila) === norm(PILAS[e.familia]);
        if (!pilaOk) fallos.push({ tipo: 'familia o pila fuera del manual', ...e });
        if (e.estilo !== 'normal' && !e.caraReal) fallos.push({ tipo: 'cursiva sintética', ...e });
        else if (!e.caraReal) fallos.push({ tipo: 'peso sin cara cargada (negrita sintética)', ...e });
        if (e.familia === 'Instrument Serif' && e.lineas > 3)
          fallos.push({ tipo: `Instrument Serif en ${e.lineas} líneas (máx. 3, §3.6)`, ...e });
        const ajenas = e.pintada.filter((f) => !Object.keys(PILAS).some((fam) => f.familyName.startsWith(fam)));
        if (ajenas.length) fallos.push({ tipo: 'glifos pintados con otra fuente', ajenas, ...e });
      }
      const fila = { ruta, vista, lang, elementos: elementos.length, familias, pintadas, fallos };
      informe.push(fila);
      console.log(
        `${ruta.padEnd(28)} ${vista.padEnd(10)} ${lang}  ${String(elementos.length).padStart(4)} el.  ` +
          `${JSON.stringify(familias)}  fallos: ${fallos.length}`
      );
      for (const f of fallos.slice(0, 6)) {
        console.log(`    ! ${f.tipo}: <${f.tag}> «${f.texto}» ${f.familia} ${f.estilo} ${f.peso} ${f.ajenas ? JSON.stringify(f.ajenas.map((a) => a.familyName + ':' + a.glyphCount)) : ''}`);
      }
    }
    await ctx.close();
  }
}

await navegador.close();

const total = informe.reduce((suma, fila) => suma + fila.fallos.length, 0);
if (salida) {
  fs.writeFileSync(salida, JSON.stringify(informe, null, 2));
  console.log(`\nInforme: ${salida}`);
}
console.log(`\n${informe.length} páginas auditadas (${RUTAS.length} rutas × 2 vistas × 2 idiomas). Fallos: ${total}.`);
process.exit(total ? 1 : 0);
