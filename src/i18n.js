import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Diccionarios de la interfaz
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §1.10 y §1.11
 *
 * TONO DE VOZ (§1.10). Cuatro reglas, iguales en una propuesta, en un mensaje
 * de error y en una publicación:
 *   1. Primero el resultado, después el método.
 *   2. Cifras concretas antes que adjetivos.
 *   3. Nunca se culpa al usuario.
 *   4. Se admite lo que no se sabe.
 *
 * REGISTRO (§1.10). En interfaz de producto el registro es directo y breve, en
 * segunda persona del singular. NORMA: se trata de tú al usuario. Nunca
 * «usted» en interfaz, nunca «vos» ni regionalismos que estrechen la audiencia.
 *
 * §1.1 · Ayemi no es una marca personal, es una casa. La voz es primera del
 * plural o segunda del singular, nunca primera del singular.
 *
 * LÉXICO RETIRADO (§1.11): «solución», «innovador», «disruptivo», «cliente
 * potencial», «levantar requerimientos», «recurso» por personas, «sinergia»,
 * «ecosistema», «holístico». Tampoco se adjetiva la propia capacidad.
 *
 * NORMA (§1.11). El lema «Ingeniería que fluye» no se traduce: es un elemento
 * verbal fijo y vive en `marca/Logotipo.jsx`.
 */

const es = {
  controles: {
    inicio: 'Ayemi · ir al inicio',
    navegacion: 'Secciones',
    preferencias: 'Preferencias del sitio',
    saltarContenido: 'Saltar al contenido',
    tema: 'Cambiar tema',
    temaClaro: 'Cambiar a tema claro',
    temaOscuro: 'Cambiar a tema oscuro',
    idioma: 'Cambiar idioma',
    abrirMenu: 'Abrir el menú de secciones',
    anterior: 'Categoría anterior',
    siguiente: 'Categoría siguiente',
    cerrar: 'Cerrar',
  },

  nav: {
    servicios: 'Servicios',
    pcb: 'PCB',
    metodo: 'Método',
    fabrica: 'La Fábrica',
    capacidad: 'Capacidad',
    posicionamiento: 'Posicionamiento',
    origen: 'Origen',
    contacto: 'Contacto',
  },

  // ── Portada · §1.6 y §1.8 ───────────────────────────────────────────────
  hero: {
    etiqueta: 'FÁBRICA DE SOFTWARE',
    tituloAntes: 'Dejas de depender de ',
    tituloAcento: 'hojas de cálculo',
    tituloDespues: ' y empiezas a operar con sistemas.',
    descripcion:
      'Construimos el software interno que tu empresa necesita y te lo entregamos documentado, probado y en tus manos. Sin cajas negras y sin ataduras.',
    botonPrimario: 'Cotiza tu sistema',
    botonSecundario: 'Ver cómo trabajamos',

    /* Voz de Emi · §7. Segunda persona, dos frases, sin emojis. El contrato
       propone «Hola. ¿Empezamos por tu primer proceso?» como ejemplo de
       bienvenida; aquí se adapta a un portafolio, donde lo que se recorre es
       el sitio y no un producto. */
    emiSaludo:
      'Hola, soy Emi. Te acompaño por aquí: abajo está lo que recibes, y más adelante cómo trabajamos y qué hemos entregado.',
    emiPie: 'te guío sección por sección',

    panelEtiqueta: 'QUÉ RECIBES',
    pruebas: {
      llavesTitulo: 'Entrega con llaves',
      llavesTexto:
        'El repositorio, la infraestructura y la documentación quedan a tu nombre desde el primer día.',
      rangoTitulo: 'Estimaciones con rango',
      rangoTexto:
        'Un mínimo, un máximo y los supuestos que sostienen ambos. Nunca una cifra suelta.',
      traspasoTitulo: 'Traspaso incluido',
      traspasoTexto:
        'Cada proyecto cierra con una sesión de entrega técnica y un documento de operación.',
    },
    datoEstado: 'entrega',
    datoValor: 'documentada · probada · operable',
  },

  // ── Líneas de servicio · §1.9 ───────────────────────────────────────────
  servicios: {
    etiqueta: 'LÍNEAS DE SERVICIO',
    titulo: 'Cuatro formas de dejar de ',
    acento: 'operar a mano',
    tituloDespues: '.',
    entradilla:
      'Todo se firma Ayemi. Las líneas describen el tipo de trabajo, no son marcas distintas.',
    guiaEmi:
      'Si no sabes en cuál encaja lo tuyo, empieza por la que más se parezca. Lo afinamos al hablar.',

    lineas: {
      plataformas: {
        nombre: 'Plataformas',
        descripcion:
          'El sistema que tu operación necesita y que ningún producto de estantería cubre. Se diseña sobre cómo trabajan hoy, no sobre cómo debería ser.',
        entregables: [
          'Repositorio a tu nombre',
          'Documentación de operación',
          'Pruebas automatizadas',
          'Sesión de entrega técnica',
        ],
      },
      automatizacion: {
        nombre: 'Automatización',
        descripcion:
          'Lo repetible deja de ocupar personas. Los procesos que hoy viven en copiar y pegar pasan a ejecutarse solos y a avisar cuando algo se sale.',
        entregables: [
          'Tareas programadas',
          'Alertas cuando algo falla',
          'Registro de cada ejecución',
          'Vuelta atrás documentada',
        ],
      },
      integraciones: {
        nombre: 'Integraciones',
        descripcion:
          'Los sistemas que ya usas dejan de estar sueltos. Facturación, inventario, banco y hoja de cálculo hablando entre sí sin que nadie teclee dos veces.',
        entregables: [
          'APIs documentadas',
          'Sincronización programada',
          'Control de errores y reintentos',
          'Trazabilidad de cada dato',
        ],
      },
      hardware: {
        nombre: 'Hardware',
        descripcion:
          'La placa que tu sensor, tu máquina o tu prototipo necesita, diseñada en KiCad y lista para fabricar en JLCPCB.',
        entregables: [
          'Esquemático y PCB en KiCad',
          'Gerber, BOM y CPL',
          'Modelo 3D en STEP',
          'Pedido de fabricación',
        ],
        enlace: 'Ver diseño de PCBs',
      },
    },

    nota: 'Las cuatro líneas comparten método, equipo y firma. Si tu proyecto cruza más de una, no se cotiza por separado: se resuelve como un solo sistema.',
  },

  // ── Diseño de PCBs · servicio-pcb ───────────────────────────────────────
  pcb: {
    whatsapp:
      'Hola, quiero cotizar el diseño de una PCB. Esto es lo que necesito que haga la placa:',

    portada: {
      etiqueta: 'DISEÑO DE PCBS',
      titulo: 'De la idea a la placa ',
      acento: 'fabricada',
      tituloDespues: '.',
      entradilla:
        'Diseñamos tu circuito en KiCad y te entregamos todo lo que la fábrica pide: Gerber, BOM y posiciones de montaje. Tú decides si hacemos el pedido o lo haces con tu cuenta.',
      primario: 'Cotiza tu placa',
      secundario: 'Ver el proceso',
    },

    entregables: {
      etiqueta: 'LO QUE RECIBES',
      titulo: 'Archivos ',
      acento: 'tuyos',
      tituloDespues: ', listos para fabricar.',
      entradilla:
        'Abren en KiCad, sin licencias de por medio. Si mañana quieres cambiar algo, no dependes de nosotros.',
      lista: [
        'Esquemático en PDF y en KiCad',
        'PCB editable en KiCad',
        'Gerber y archivos de taladro',
        'BOM con cantidades y encapsulados',
        'CPL con la posición de cada componente',
        'Modelo 3D en STEP para tu gabinete',
        'Reporte de ERC y DRC',
      ],
    },

    proceso: {
      etiqueta: 'EL PROCESO',
      titulo: 'Seis pasos, y cada uno deja algo en ',
      acento: 'tus manos',
      tituloDespues: '.',
      entradilla:
        'Cada paso termina con un archivo que puedes revisar. Si algo no cuadra, se corrige ahí, no cuando la placa ya llegó de la fábrica.',
      guiaEmi:
        'Al cerrar cada paso te mandamos lo que se hizo. Así nada te toma por sorpresa.',
      pasos: {
        requisitos: {
          titulo: 'Requisitos',
          texto:
            'Partimos de lo que la placa debe hacer, no de un esquemático. Si algo no cuadra, lo decimos antes de dibujar una sola línea.',
          rotulo: 'LO QUE TE PREGUNTAMOS',
          puntos: [
            'Qué mide, controla o comunica',
            'Cómo se alimenta',
            'Dónde va a vivir: gabinete, temperatura, ruido',
            'Conectores y tamaño máximo',
            'Cuántas piezas y con qué presupuesto',
          ],
        },
        esquematico: {
          titulo: 'Esquemático',
          texto:
            'El circuito se ordena por hojas: alimentación, microcontrolador, comunicaciones y sensores. Cada componente se elige con existencias reales en el proveedor.',
          rotulo: 'AL CERRAR EL PASO RECIBES',
          puntos: [
            'Esquemático en PDF para revisar',
            'Lista preliminar de componentes, con existencias',
            'Las dudas abiertas, por escrito',
          ],
        },
        ruteo: {
          titulo: 'Ruteo',
          texto:
            'Se colocan los componentes y se trazan las pistas, con los planos de tierra y las reglas de la fábrica cargadas desde el primer momento.',
          rotulo: 'AL CERRAR EL PASO RECIBES',
          puntos: [
            'Vista 3D de la placa para validar medidas',
            'Posición de conectores y orificios de montaje',
            'Modelo STEP para probarlo en tu gabinete',
          ],
        },
        verificacion: {
          titulo: 'Verificación',
          texto:
            'Antes de fabricar, KiCad revisa el circuito (ERC) y la placa (DRC) contra las reglas de la fábrica. No se envía nada con errores.',
          rotulo: 'AL CERRAR EL PASO RECIBES',
          puntos: [
            'Reporte de ERC sin errores',
            'Reporte de DRC contra las reglas de la fábrica',
            'Lo que se revisó a mano, en una lista',
          ],
        },
        archivos: {
          titulo: 'Archivos de fabricación',
          texto:
            'Lo que la fábrica necesita para producir y ensamblar: un Gerber por capa, los taladros, la lista de materiales y la posición de cada pieza.',
          rotulo: 'AL CERRAR EL PASO RECIBES',
          puntos: [
            'Gerber por capa y archivos de taladro',
            'BOM con cantidades y encapsulados',
            'CPL con la posición de cada componente',
            'Proyecto de KiCad completo y editable',
          ],
        },
        fabricacion: {
          titulo: 'Fabricación',
          texto:
            'Subimos los archivos a JLCPCB, revisamos la vista previa de cada capa y confirmamos el ensamble. Si prefieres pedirla tú, te acompañamos en el pedido.',
          rotulo: 'AL CERRAR EL PASO RECIBES',
          puntos: [
            'Vista previa de cada capa antes de pagar',
            'Cotización de fabricación y ensamble',
            'Seguimiento del pedido hasta la entrega',
          ],
        },
      },
    },

    placas: {
      etiqueta: 'PLACAS PROPIAS',
      titulo: 'Tres placas, tres ',
      acento: 'microcontroladores',
      tituloDespues: '.',
      entradilla:
        'Una placa por familia de microcontrolador. Cada ficha dice en qué punto está, y mientras no haya diseño publicado no mostramos cifras.',
      preparado: 'Espacio preparado. Todavía no hay diseño publicado.',
      vistas: {
        control: 'Vista de la placa',
        perspectiva: 'Perspectiva',
        superior: 'Superior',
        inferior: 'Inferior',
      },
      ficha: {
        medidas: 'Medidas',
        capas: 'Capas',
        componentes: 'Piezas',
        vias: 'Vías',
      },
      alt: 'Render 3D de {{nombre}}, vista {{vista}}.',
      estados: {
        rotulo: 'ESTADO',
        disenoVerificado: 'Diseño verificado · listo para fabricar',
        fabricadoProbado: 'Fabricado y probado',
        alcanzado: '(alcanzado)',
        pendiente: '(pendiente)',
      },
      lista: {
        atmega328p: {
          nombre: 'Placa ATmega328P',
          descripcion:
            'Microcontrolador de 8 bits: para lecturas y control sencillos, con bajo consumo.',
        },
        esp32: {
          nombre: 'Placa ESP32',
          descripcion:
            'WiFi y Bluetooth integrados: para equipos que mandan sus datos a un sistema en la nube.',
        },
        stm32: {
          nombre: 'Placa STM32',
          descripcion:
            'Microcontrolador de 32 bits: para control en tiempo real y buses industriales.',
        },
      },
    },

    preguntas: {
      etiqueta: 'PREGUNTAS FRECUENTES',
      titulo: 'Antes de ',
      acento: 'cotizar',
      tituloDespues: '.',
      lista: [
        {
          p: '¿Necesito llegar con el esquemático?',
          r: 'No. Basta con que nos digas qué debe hacer la placa, dónde va a vivir y cómo se alimenta. El esquemático lo hacemos nosotros.',
        },
        {
          p: '¿Quién fabrica la placa?',
          r: 'Trabajamos con JLCPCB. Podemos hacer el pedido por ti o entregarte los archivos listos para que lo hagas con tu cuenta.',
        },
        {
          p: '¿Los archivos son míos?',
          r: 'Sí. Recibes el proyecto completo de KiCad, editable y sin licencias, además de los archivos de fabricación.',
        },
        {
          p: '¿Cuánto tarda?',
          r: 'Depende de la complejidad de la placa. Te damos una fecha concreta al cotizar; la fabricación en JLCPCB suma su propio plazo de producción y envío.',
        },
      ],
    },

    cierre: {
      etiqueta: 'COTIZA TU PLACA',
      titulo: 'Cuéntanos qué debe ',
      acento: 'hacer',
      tituloDespues: ' tu placa.',
      guiaEmi: 'Para empezar basta una foto de tu prototipo o un dibujo a mano.',
      whatsapp: 'Escríbenos por WhatsApp',
      correo: 'O por correo:',
    },
  },

  // ── Método · §1.4 y §1.6 ────────────────────────────────────────────────
  metodo: {
    etiqueta: 'MÉTODO',
    titulo: 'El orden es anterior al ',
    acento: 'talento',
    tituloDespues: '.',
    entradilla:
      'Hay una manera de hacer las cosas y está escrita. Eso es lo que permite que otra persona retome el trabajo sin hacer arqueología.',
    guiaEmi:
      'Cuatro pasos y cuatro valores. Fíjate en la columna de la derecha: ahí dice cómo se comprueba cada uno.',

    pasos: {
      entender: {
        titulo: 'Entender cómo trabajan hoy',
        texto:
          'Antes de proponer nada se mira la operación real: quién toca qué, dónde se rompe y qué archivo no puede faltar.',
        entrega: 'Mapa del proceso actual',
      },
      disenar: {
        titulo: 'Diseñar el sistema',
        texto:
          'Se acuerda el alcance con un mínimo, un máximo y los supuestos que sostienen ambos. Lo que queda fuera también se escribe.',
        entrega: 'Alcance con rango y supuestos',
      },
      construir: {
        titulo: 'Construir con método',
        texto:
          'Código versionado, con pruebas y despliegues cortos. Ves avances funcionando, no capturas de pantalla.',
        entrega: 'Entregas parciales desplegadas',
      },
      entregar: {
        titulo: 'Entregar con llaves',
        texto:
          'El repositorio, la infraestructura y la documentación quedan a tu nombre. Se cierra con una sesión técnica, no con un correo.',
        entrega: 'Traspaso y documento de operación',
      },
    },

    valoresTitulo: 'Cuatro valores, cuatro comprobaciones',
    valoresEntradilla:
      'Un valor que no se puede verificar no es un valor: es un adorno. Estos son los cuatro y cómo se comprueba cada uno.',
    comoSeComprueba: 'CÓMO SE COMPRUEBA',

    valores: {
      metodo: {
        nombre: 'Método',
        significa:
          'El orden es anterior al talento. Hay una manera de hacer las cosas y está escrita.',
        comprueba:
          'Código versionado, documentado y con pruebas. Cualquiera puede retomarlo.',
      },
      transparencia: {
        nombre: 'Transparencia',
        significa:
          'Se dicen los tiempos, los costos y los riesgos reales, también cuando incomodan.',
        comprueba:
          'Estimaciones con rango y supuestos explícitos. Los cambios de alcance se escriben.',
      },
      flujo: {
        nombre: 'Flujo',
        significa:
          'El valor está en que las cosas avancen sin fricción, no en que se vean complejas.',
        comprueba:
          'Automatización de lo repetible. Despliegues cortos y frecuentes.',
      },
      permanencia: {
        nombre: 'Permanencia',
        significa:
          'Se construye para que siga funcionando cuando ya no estemos mirándolo.',
        comprueba:
          'Sin dependencias exóticas. Documentación de entrega. Traspaso posible.',
      },
    },
  },

  // ── La Fábrica de Innovación · §1.3 ─────────────────────────────────────
  fabrica: {
    etiqueta: 'LA FÁBRICA',
    titulo: 'Ocho líneas, de la placa a la ',
    acento: 'nube',
    tituloDespues: '.',
    entradilla:
      'Una fábrica tiene procesos, tiene medidas y entrega piezas que encajan. Estas son las líneas de producción y lo que ha salido de cada una.',
    guiaEmi:
      'Elige una línea y verás sus cinco plazas. Los nodos encendidos se pueden abrir; los apagados están libres.',

    contador: {
      entregadas: 'PIEZAS ENTREGADAS',
      enCurso: 'EN LÍNEA',
      libres: 'PLAZAS LIBRES',
      lineas: 'LÍNEAS ABIERTAS',
    },

    naturalezas: {
      hardware: 'HARDWARE',
      software: 'SOFTWARE',
    },

    llenado: '{{ocupadas}} de {{total}} plazas ocupadas',
    plazaLibre: 'Plaza libre',
    /* Rótulo de marca ajena en el tablero. «para» es deliberado: marca que el
       trabajo se hizo para alguien, no que la pieza sea de Ayemi. */
    paraCliente: 'para {{cliente}}',
    indice: 'TODAS LAS PIEZAS',

    /* Anticipo de la portada. La landing no lleva el tablero entero: lleva las
       cifras, tres piezas y la puerta. */
    anticipoCierre:
      'El tablero completo tiene ocho líneas de producción, del microcontrolador a la nube, con las plazas libres a la vista.',
    anticipoBoton: 'Ver el portafolio completo',

    /* Voz de Emi: segunda persona, dos frases, sin emojis, nunca culpa. */
    lineaVaciaTitulo: 'Esta línea está abierta y todavía sin piezas.',
    lineaVaciaEmi:
      'Aquí no hay nada publicado todavía. Si tienes un proyecto de esta línea, puede ser el primero.',
    lineaVaciaBoton: 'Proponer un proyecto',

    estados: {
      entregada: 'Entregada',
      'en-curso': 'En línea',
      libre: 'Plaza libre',
    },

    lineas: {
      pcb: {
        nombre: 'Esquemáticos y PCB',
        descripcion:
          'Del esquema al archivo de fabricación. Placas ruteadas para que se puedan producir, medir y reparar, no solo para que funcionen en el prototipo.',
      },
      circuitos: {
        nombre: 'Circuitos eléctricos',
        descripcion:
          'Diagramas de potencia y control, tableros y protecciones. Lo que hace que una máquina arranque sin que nadie tenga que adivinar el cableado.',
      },
      firmware: {
        nombre: 'Firmware',
        descripcion:
          'Programas para microcontroladores: lectura de sensores, buses industriales y control en tiempo real. Con el código versionado, no en el portátil de alguien.',
      },
      cad: {
        nombre: '3D y CAD',
        descripcion:
          'Dibujo asistido, piezas mecánicas y carcasas listas para imprimir o mecanizar. Con medidas, tolerancias y plano.',
      },
      interfaces: {
        nombre: 'Interfaces',
        descripcion:
          'Aplicaciones y componentes con los que se opera un sistema todos los días. Pensados para quien los usa ocho horas, no para la captura de pantalla.',
      },
      landings: {
        nombre: 'Landings',
        descripcion:
          'Sitios de presentación que cargan rápido, se encuentran y explican una oferta sin hacer perder el tiempo a nadie.',
      },
      paneles: {
        nombre: 'Paneles de control',
        descripcion:
          'Donde se ve el estado real de la operación: inventario, sensores, avance, alertas. Un dato por pantalla, no un tablero de adornos.',
      },
      tiendas: {
        nombre: 'Tiendas',
        descripcion:
          'Comercio en línea conectado al inventario y a la facturación que ya existen, para que vender no obligue a capturar dos veces.',
      },
    },

    enlaces: {
      demo: 'Ver en vivo',
      repositorio: 'Repositorio',
      caso: 'Caso de estudio',
      esquematico: 'Esquemático',
      render: 'Render',
      gerbers: 'Fabricación',
      ficha: 'Ficha técnica',
      video: 'Vídeo',
    },

    ficha: {
      volver: 'Volver a La Fábrica',
      medidas: 'MEDIDAS',
      pila: 'PILA TÉCNICA',
      arquitectura: 'CÓMO ESTÁ HECHA',
      servicio: 'SERVICIO',
      incluye: 'Qué incluye',
      linea: 'Línea',
      anio: 'Año',
      estado: 'Estado',
      sector: 'Sector',
      cliente: 'Cliente',
      aporte: 'Aporte de Ayemi',
      anterior: 'Anterior',
      siguiente: 'Siguiente',
      masDeLaLinea: 'Más piezas de esta línea',
      sinEnlacesTitulo: 'Todavía no hay enlaces públicos',
      sinEnlacesTexto:
        'Esta pieza es de un cliente y aún no hay autorización para publicar el repositorio ni una demostración. Si te interesa el detalle técnico, pídelo y lo revisamos.',

      /* Marcas ajenas. Dice tres cosas y ninguna sobra: que la marca es
         independiente, qué hizo Ayemi, y que nombrarla no implica respaldo.
         Sin esto, una ficha de trabajo para terceros se lee como producto
         propio. */
      atribucionTitulo: '{{cliente}} es una marca independiente',
      atribucionTexto:
        '{{cliente}} no forma parte de Ayemi ni Ayemi de {{cliente}}. Esta pieza es trabajo que Ayemi hizo para ellos como proveedor de desarrollo; el producto, la marca y los datos son suyos. Aparece aquí como referencia de trabajo, no como respaldo, alianza ni recomendación por su parte. Las marcas y nombres comerciales pertenecen a sus titulares.',

      cierre:
        '¿Tienes algo parecido en tu operación? Cuéntanos cómo trabajan hoy y qué se rompe.',
      cierreBoton: 'Hablemos de tu caso',
    },

    /* §1.10, regla 4 · Las plazas vacías se explican, no se disimulan.
       La segunda frase describe lo que el sitio hace de verdad: antes prometía
       omitir todo nombre de cliente, y eso dejó de ser cierto. */
    nota: 'Las plazas libres son eso: huecos en la línea. Preferimos mostrarlas antes que rellenar el tablero con trabajos que no existen. Cuando una pieza se hizo para otra marca, esa marca se nombra y se deja claro que es independiente de Ayemi; lo que no se publica sin permiso son los datos, el código y las cifras del cliente.',
  },

  noEncontrada: {
    titulo: 'Esta página no está.',
    texto:
      'La dirección no corresponde a nada publicado. Puede que el enlace haya cambiado o que la pieza todavía no esté en el tablero.',
    /* Voz de Emi. Nunca culpa al usuario (§10, regla 3). */
    emi: 'No es nada que hayas hecho mal. Te dejo por dónde seguir.',
    inicio: 'Ir al inicio',
    fabrica: 'Ver La Fábrica',
    lineas: 'LÍNEAS DE PRODUCCIÓN',
  },

  // ── Emi · §7 y steering ayemi-emi ───────────────────────────────────────
  emi: {
    etiqueta: 'LA TERCERA SÍLABA',
    titulo: 'Emi',
    quienEs:
      'Emi toma su nombre de Emilio, el tercero de los tres. Es la parte de la marca que habla contigo cuando necesitas ayuda: acompaña, avisa, celebra y explica. Nunca vende y nunca firma.',
    nucleo:
      'Su antena remata en El Núcleo, el mismo círculo cian que corona la «i» del logotipo. Ese detalle es lo que la hace pertenecer al sistema y no ser un dibujo suelto.',

    lasExpresiones: 'LAS OCHO EXPRESIONES',
    lasPoses: 'LAS CUATRO POSES',
    cuando: 'CUÁNDO SE USA',
    diria: 'QUÉ DIRÍA',
    retratoAlt: 'Emi con expresión {{expresion}}',

    expresiones: {
      feliz: {
        nombre: 'Feliz',
        cuando: 'Por defecto. Bienvenida, éxito general, alta de usuario.',
        dice: 'Hola. ¿Empezamos por tu primer proceso?',
      },
      atento: {
        nombre: 'Atento',
        cuando: 'Escuchando. Formularios, chat, preguntas.',
        dice: 'Te leo. Cuéntame qué necesitas.',
      },
      procesando: {
        nombre: 'Procesando',
        cuando: 'Carga, despliegue en curso, cálculo.',
        dice: 'Preparando tu panel.',
      },
      celebrando: {
        nombre: 'Celebrando',
        cuando: 'Despliegue correcto, hito, pago confirmado.',
        dice: 'Listo. Tu proceso quedó guardado.',
      },
      alerta: {
        nombre: 'Alerta',
        cuando: 'Advertencia recuperable. Cuota, confirmación requerida.',
        dice: 'Te quedan dos envíos este mes. Puedes ampliar cuando quieras.',
      },
      error: {
        nombre: 'Error',
        cuando: 'Fallo bloqueante. Conexión perdida, build roto.',
        dice: 'Algo falló de nuestro lado. Ya lo estamos revisando.',
      },
      vacio: {
        nombre: 'Vacío',
        cuando: 'Sin resultados, bandeja limpia, página no encontrada.',
        dice: 'Aquí no hay nada todavía.',
      },
      reposo: {
        nombre: 'Reposo',
        cuando: 'Inactividad, sesión en pausa.',
        dice: 'Sigo aquí cuando quieras retomar.',
      },
    },

    poses: {
      flotando: 'Flotando',
      saludando: 'Saludando',
      senalando: 'Señalando',
      celebrando: 'Celebrando',
    },

    dondeSi: 'Dónde sí',
    dondeNo: 'Dónde no',
    donde: {
      si: [
        'Estados vacíos, carga, éxito y error',
        'Chat y centro de ayuda',
        'Onboarding y tutoriales',
        'Documentación de producto',
        'Redes y comunidad',
        'Páginas de estado y de error',
      ],
      no: [
        'Contratos y anexos legales',
        'Facturas y cotizaciones',
        'Propuestas técnicas y económicas',
        'Papelería corporativa',
        'Firma de correo',
        'Comunicación de incidente grave',
      ],
    },

    nota: 'En este sitio Emi hace las dos cosas que le corresponden: te da la bienvenida y te conduce por cada sección, y sostiene los estados en los que algo falta, algo carga o algo sale bien. Lo que nunca hace es firmar: la firma es el logotipo, no ella.',
  },

  // ── Capacidad técnica ───────────────────────────────────────────────────
  stack: {
    etiqueta: 'CAPACIDAD TÉCNICA',
    tituloAntes: 'Tecnologías que ',
    tituloAcento: 'dominamos',
    subtitulo:
      'Desde el firmware y los protocolos industriales hasta el despliegue en la nube. Cada pieza está elegida porque después hay que sostenerla.',
    guiaEmi:
      'Cambia de categoría con las flechas. Si pasas el puntero sobre el sistema, se detiene para que puedas leerlo.',
    contador: '{{count}} tecnologías',
    contadorPosicion: '{{actual}} de {{total}}',
    pista: 'Toca un nodo para ver el detalle',
    categorias: {
      frontend: 'Interfaz',
      backend: 'Servicios y APIs',
      datos: 'Bases de datos',
      nube: 'Nube y despliegue',
      embebido: 'Embebido e IoT',
      electronica: 'Electrónica',
      cad: 'Diseño 3D y CAD',
    },
  },

  // ── Posicionamiento · §1.7 y §1.8 ───────────────────────────────────────
  posicionamiento: {
    etiqueta: 'POSICIONAMIENTO',
    titulo: 'Frente a las ',
    acento: 'alternativas',
    tituloDespues: '.',

    guiaEmi:
      'Aquí está la comparación sin adornos. Si te reconoces en alguno de los tres perfiles de abajo, encajas.',

    declaracion:
      'Para la pyme que ya no cabe en sus hojas de cálculo, Ayemi es la fábrica de software que entrega sistemas propios, documentados y operables, porque construye con método de ingeniería y explica cada decisión en el idioma del negocio.',

    frenteTitulo: 'Por qué Ayemi y no otra opción',
    frente: {
      freelance: {
        quien: 'Frente al freelance',
        ventaja:
          'Ayemi tiene método y continuidad. El proyecto no depende de la agenda ni de la memoria de una sola persona.',
      },
      agencia: {
        quien: 'Frente a la agencia grande',
        ventaja:
          'Trato directo y sin sobreprecio de estructura. Hablas con quien construye, no con quien reenvía.',
      },
      estanteria: {
        quien: 'Frente al software de estantería',
        ventaja:
          'Ayemi se ajusta al proceso real, no al revés. No pagas módulos que no usas ni cambias tu operación para caber en un producto.',
      },
    },

    publicoTitulo: 'A quién le sirve esto',
    publicoEntradilla:
      'Ninguno de estos perfiles es programador. El cómo puede ser técnico; el qué y el para qué se dicen en horas ahorradas y errores evitados.',
    queLeDuele: 'QUÉ LE DUELE',
    queEspera: 'QUÉ ESPERA',

    publico: {
      primario: {
        quien: 'Pyme de 10 a 200 personas',
        duele:
          'Todo depende de una persona y de un archivo que nadie más entiende.',
        espera: 'Que alguien convierta eso en un sistema y se lo explique.',
      },
      secundario: {
        quien: 'Dirección de operaciones o finanzas',
        duele:
          'Necesita una herramienta puntual que el área de sistemas no prioriza.',
        espera:
          'Un proveedor ágil que no la obligue a pelear presupuesto interno.',
      },
      terciario: {
        quien: 'Otro estudio o agencia',
        duele: 'Compromisos vendidos sin equipo para ejecutarlos.',
        espera: 'Un socio discreto que cumpla y no compita por el cliente.',
      },
    },
  },

  // ── Origen del nombre · §1.1 y §1.2 ─────────────────────────────────────
  origen: {
    etiqueta: 'ORIGEN DEL NOMBRE',
    titulo: 'Tres nombres, una sola ',
    acento: 'corriente',

    manifiesto:
      'Ayemi no dice «Agustín hace software». Dice «aquí converge algo que continúa».',

    parrafoCasa:
      'El nombre es la contracción de tres: Agustín, Yazmín y Emilio. No es un acrónimo decorativo, es la estructura del nombre, y explica por qué la marca habla de confluencia, de corriente y de flujo. Tres orígenes que desembocan en uno.',
    parrafoFabrica:
      'Eso tiene una consecuencia práctica: Ayemi no es una marca personal, es una casa. Puede crecer, incorporar gente y sobrevivir a cualquiera de sus tres nombres. La palabra fábrica es deliberada: una fábrica tiene procesos, tiene medidas, entrega piezas que encajan y repite resultados.',

    propositoEtiqueta: 'PROPÓSITO',
    proposito:
      'Convertir el trabajo repetitivo de una empresa en sistemas que se sostienen solos, para que la gente vuelva a ocuparse de lo que sí requiere criterio.',
    propositoNota:
      'El propósito no menciona tecnología a propósito. La tecnología cambia; el problema que resuelve Ayemi no.',

    normaEtiqueta: 'NORMA DE ESCRITURA',
    norma:
      'Se escribe Ayemi: una sola palabra, A mayúscula inicial y el resto en minúsculas.',
    pronunciacion: '/a·ˈye·mi/ · acentuado en la segunda sílaba',
  },

  // ── Contacto · §5.3, §5.4 y §1.10 ───────────────────────────────────────
  contacto: {
    etiqueta: 'CONTACTO',
    titulo: 'Cuéntanos qué parte de tu operación ',
    acento: 'duele',
    tituloDespues: '.',
    entradilla:
      'No hace falta que traigas el sistema ya diseñado. Con que describas cómo trabajan hoy y qué se rompe, hay material para empezar.',
    guiaEmi:
      'Te leo. Con dos líneas sobre el proceso que te está costando tiempo es suficiente.',

    campos: {
      nombre: 'Nombre',
      correo: 'Correo',
      empresa: 'Empresa',
      empresaAyuda: 'Opcional. Ayuda a entender el tamaño de la operación.',
      mensaje: 'Qué necesitas',
      mensajeAyuda:
        'Qué proceso te está costando tiempo hoy y quién lo opera.',
    },

    /* §1.10, regla 3 · Cada mensaje dice qué falta, nunca quién se equivocó. */
    errores: {
      nombreFalta: 'Falta tu nombre para saber cómo dirigirnos a ti.',
      correoFalta: 'Falta el correo. Es la vía por la que llega la respuesta.',
      correoSinArroba: 'Ese correo no lleva arroba. Revisa que esté completo.',
      correoSinDominio:
        'Falta el dominio después de la arroba, por ejemplo .com o .mx.',
      mensajeFalta:
        'Falta el mensaje. Con dos líneas sobre el proceso es suficiente.',
      mensajeCorto:
        'Con {{faltan}} caracteres más hay contexto suficiente para responder algo útil.',
    },

    enviar: 'Enviar mensaje',
    enviando: 'Enviando',

    /* Voz de Emi: máximo dos frases, sin emojis. */
    enviandoTitulo: 'Enviando tu mensaje',
    enviandoEmi: 'Un momento, lo estoy mandando.',

    exitoTitulo: 'Mensaje recibido',
    exitoTexto:
      'Respondemos en un día hábil. Si es urgente, el correo directo está al lado.',

    /* §1.10, regla 4 · Se dice que no hay servicio de envío conectado. */
    borradorTitulo: 'Se abrió un borrador en tu correo',
    borradorTexto:
      'Este sitio todavía no tiene un servicio de envío conectado, así que no damos por enviado algo que no salió: el mensaje se preparó en tu cliente de correo con los datos ya escritos. Solo falta que lo mandes.',
    borradorAsunto: 'Proyecto · {{nombre}}',

    falloTitulo: 'El envío no salió',
    falloTexto:
      'El servicio de envío no respondió y no queremos dar por bueno algo que no llegó.',
    falloAccion: 'Abrir un borrador de correo',

    revisaTitulo: 'Faltan algunos datos',
    revisaTexto:
      'Los campos marcados indican qué falta. Nada de lo que escribiste se perdió.',

    directoTitulo: 'Vía directa',
    directoTexto: 'Si prefieres saltarte el formulario.',
    canales: {
      correo: 'Correo',
      mensaje: 'Mensaje directo',
    },
    sinCanales:
      'Los canales directos todavía no están publicados. El formulario funciona.',
    nuevaPestana: '(abre en una pestaña nueva)',
  },

  pie: {
    navegacion: 'Secciones',
    contacto: 'Contacto',
    derechos: 'Todos los derechos reservados',
    nuevaPestana: '(abre en una pestaña nueva)',
    sinCanales: 'Pendiente de publicar',
    sistema: 'Sistema de identidad · edición 2.0',
    privacidad: 'Aviso de privacidad',
  },

  privacidad: {
    etiqueta: 'PRIVACIDAD',
    soloEspanol: 'Este aviso se publica en español, el idioma que exige la ley mexicana de protección de datos.',
  },

  ofertas: {
    etiqueta: 'PARA EMPEZAR',
    titulo: 'Dos formas de ',
    acento: 'probarnos',
    tituloDespues: ' antes de un proyecto.',
    desde: 'Desde {{precio}}',
    gratis: 'Sin costo',
    revisionPcb: {
      titulo: 'Revisión de tu PCB',
      texto: 'Nos mandas tu proyecto de KiCad antes de fabricar y te devolvemos un reporte con cada hallazgo: reglas de JLCPCB, huellas contra la hoja de datos, desacoplo y ruteo. El precio queda cerrado antes de empezar.',
      boton: 'Pide tu revisión',
      mensaje: 'Hola, quiero una revisión de mi PCB antes de fabricarla. Mi proyecto es:',
    },
    diagnostico: {
      titulo: 'Diagnóstico de 30 min',
      texto: 'Una videollamada para que nos cuentes qué se rompe hoy en tu operación. Te decimos qué haríamos primero y cuánto costaría, sin compromiso.',
      botonAgenda: 'Agenda 30 min',
      botonWhatsapp: 'Pide tu diagnóstico',
      mensaje: 'Hola, quiero agendar el diagnóstico de 30 min. Lo que se rompe hoy es:',
    },
  },

  caso: {
    etiqueta: 'CASO · {{cliente}}',
    problema: 'El problema',
    hicimos: 'Qué hicimos',
    resultado: 'Resultado',
    capturas: 'Capturas',
    testimonio: 'Testimonio',
    ficha: 'Ver la ficha técnica',
    mensajeWhatsapp: 'Hola, vi el caso de {{cliente}} y tengo algo parecido en mi operación.',
  },

  enlaces: {
    propuesta: 'Software interno y placas electrónicas, documentados y en tus manos.',
    mensajeWhatsapp: 'Hola, los vi en redes y quiero platicar de un proyecto.',
    botones: {
      whatsapp: 'Escríbenos por WhatsApp',
      pcb: 'Cotiza tu PCB',
      agenda: 'Agenda un diagnóstico de 30 min',
      youtube: 'Míranos en YouTube',
      caso: 'Caso: sitio de ITA',
      sitio: 'Conoce Ayemi',
    },
  },

  cookies: {
    region: 'Aviso de cookies',
    texto: 'Usamos cookies de Google Analytics, Meta y Microsoft Clarity para medir qué funciona en el sitio. Tus datos y cómo desactivarlas, en el',
    enlace: 'aviso de privacidad',
    aceptar: 'Entendido',
  },
};

const en = {
  controles: {
    inicio: 'Ayemi · back to top',
    navegacion: 'Sections',
    preferencias: 'Site preferences',
    saltarContenido: 'Skip to content',
    tema: 'Change theme',
    temaClaro: 'Switch to light theme',
    temaOscuro: 'Switch to dark theme',
    idioma: 'Change language',
    abrirMenu: 'Open the section menu',
    anterior: 'Previous category',
    siguiente: 'Next category',
    cerrar: 'Close',
  },

  nav: {
    servicios: 'Services',
    pcb: 'PCB',
    metodo: 'Method',
    fabrica: 'The Factory',
    capacidad: 'Capability',
    posicionamiento: 'Positioning',
    origen: 'Origin',
    contacto: 'Contact',
  },

  hero: {
    etiqueta: 'SOFTWARE FACTORY',
    tituloAntes: 'Stop depending on ',
    tituloAcento: 'spreadsheets',
    tituloDespues: ' and start running on systems.',
    descripcion:
      'We build the internal software your company needs and hand it over documented, tested and in your hands. No black boxes, no lock-in.',
    botonPrimario: 'Get your system quoted',
    botonSecundario: 'See how we work',

    emiSaludo:
      'Hi, I am Emi. I will walk you through: below is what you get, and further down how we work and what we have delivered.',
    emiPie: 'I guide you section by section',

    panelEtiqueta: 'WHAT YOU GET',
    pruebas: {
      llavesTitulo: 'Handed over with the keys',
      llavesTexto:
        'The repository, the infrastructure and the documentation are in your name from day one.',
      rangoTitulo: 'Estimates with a range',
      rangoTexto:
        'A minimum, a maximum and the assumptions behind both. Never a single loose figure.',
      traspasoTitulo: 'Handover included',
      traspasoTexto:
        'Every project closes with a technical handover session and an operations document.',
    },
    datoEstado: 'handover',
    datoValor: 'documented · tested · operable',
  },

  servicios: {
    etiqueta: 'SERVICE LINES',
    titulo: 'Four ways to stop ',
    acento: 'working by hand',
    tituloDespues: '.',
    entradilla:
      'Everything is signed Ayemi. The lines describe the kind of work; they are not separate brands.',
    guiaEmi:
      'If you are not sure which one fits, start with the closest. We refine it when we talk.',

    lineas: {
      plataformas: {
        nombre: 'Platforms',
        descripcion:
          'The system your operation needs and no off-the-shelf product covers. Designed around how your team works today, not around how it should work.',
        entregables: [
          'Repository in your name',
          'Operations documentation',
          'Automated tests',
          'Technical handover session',
        ],
      },
      automatizacion: {
        nombre: 'Automation',
        descripcion:
          'Repetitive work stops taking up people. Processes that live in copy and paste today start running on their own and speak up when something drifts.',
        entregables: [
          'Scheduled jobs',
          'Alerts when something fails',
          'A log of every run',
          'Documented rollback',
        ],
      },
      integraciones: {
        nombre: 'Integrations',
        descripcion:
          'The systems you already use stop standing alone. Invoicing, inventory, bank and spreadsheet talking to each other without anyone typing twice.',
        entregables: [
          'Documented APIs',
          'Scheduled synchronisation',
          'Error handling and retries',
          'Traceability for every record',
        ],
      },
      hardware: {
        nombre: 'Hardware',
        descripcion:
          'The board your sensor, machine or prototype needs, designed in KiCad and ready to manufacture at JLCPCB.',
        entregables: [
          'Schematic and PCB in KiCad',
          'Gerber, BOM and CPL',
          '3D model in STEP',
          'Manufacturing order',
        ],
        enlace: 'See PCB design',
      },
    },

    nota: 'The four lines share method, team and signature. If your project crosses more than one, it is not quoted separately: it is solved as a single system.',
  },

  // ── PCB design · servicio-pcb ────────────────────────────────────────────
  pcb: {
    whatsapp:
      'Hi, I would like a quote for a PCB design. This is what the board needs to do:',

    portada: {
      etiqueta: 'PCB DESIGN',
      titulo: 'From idea to ',
      acento: 'manufactured',
      tituloDespues: ' board.',
      entradilla:
        'We design your circuit in KiCad and hand you everything the factory asks for: Gerber, BOM and pick-and-place. You decide whether we place the order or you do it with your own account.',
      primario: 'Get a quote',
      secundario: 'See the process',
    },

    entregables: {
      etiqueta: 'WHAT YOU GET',
      titulo: 'Files that are ',
      acento: 'yours',
      tituloDespues: ', ready to manufacture.',
      entradilla:
        'They open in KiCad, no licenses involved. If you want to change something tomorrow, you do not depend on us.',
      lista: [
        'Schematic in PDF and KiCad',
        'Editable PCB in KiCad',
        'Gerber and drill files',
        'BOM with quantities and footprints',
        'CPL with the position of every part',
        '3D model in STEP for your enclosure',
        'ERC and DRC report',
      ],
    },

    proceso: {
      etiqueta: 'THE PROCESS',
      titulo: 'Six steps, and each one leaves something in ',
      acento: 'your hands',
      tituloDespues: '.',
      entradilla:
        'Every step ends with a file you can review. If something does not add up, it is fixed right there, not after the board is back from the factory.',
      guiaEmi:
        'When each step closes, we send you what was done. That way nothing catches you off guard.',
      pasos: {
        requisitos: {
          titulo: 'Requirements',
          texto:
            'We start from what the board must do, not from a schematic. If something does not add up, we say so before drawing a single line.',
          rotulo: 'WHAT WE ASK YOU',
          puntos: [
            'What it measures, controls or talks to',
            'How it is powered',
            'Where it will live: enclosure, temperature, noise',
            'Connectors and maximum size',
            'How many units and on what budget',
          ],
        },
        esquematico: {
          titulo: 'Schematic',
          texto:
            'The circuit is split into sheets: power, microcontroller, communications and sensors. Every part is chosen with real stock at the supplier.',
          rotulo: 'WHEN THE STEP CLOSES YOU GET',
          puntos: [
            'Schematic in PDF to review',
            'Preliminary parts list, with stock',
            'Open questions, in writing',
          ],
        },
        ruteo: {
          titulo: 'Layout',
          texto:
            'Parts are placed and traces are routed, with ground planes and the factory rules loaded from the very start.',
          rotulo: 'WHEN THE STEP CLOSES YOU GET',
          puntos: [
            '3D view of the board to check dimensions',
            'Position of connectors and mounting holes',
            'STEP model to try in your enclosure',
          ],
        },
        verificacion: {
          titulo: 'Verification',
          texto:
            'Before manufacturing, KiCad checks the circuit (ERC) and the board (DRC) against the factory rules. Nothing ships with errors.',
          rotulo: 'WHEN THE STEP CLOSES YOU GET',
          puntos: [
            'ERC report with zero errors',
            'DRC report against the factory rules',
            'What was checked by hand, as a list',
          ],
        },
        archivos: {
          titulo: 'Manufacturing files',
          texto:
            'What the factory needs to build and assemble: one Gerber per layer, drill files, the bill of materials and the position of every part.',
          rotulo: 'WHEN THE STEP CLOSES YOU GET',
          puntos: [
            'One Gerber per layer and drill files',
            'BOM with quantities and footprints',
            'CPL with the position of every part',
            'Complete, editable KiCad project',
          ],
        },
        fabricacion: {
          titulo: 'Manufacturing',
          texto:
            'We upload the files to JLCPCB, review the preview of every layer and confirm the assembly. If you prefer to order it yourself, we walk you through it.',
          rotulo: 'WHEN THE STEP CLOSES YOU GET',
          puntos: [
            'Preview of every layer before paying',
            'Manufacturing and assembly quote',
            'Order tracking until delivery',
          ],
        },
      },
    },

    placas: {
      etiqueta: 'OUR OWN BOARDS',
      titulo: 'Three boards, three ',
      acento: 'microcontrollers',
      tituloDespues: '.',
      entradilla:
        'One board per microcontroller family. Each card says where it stands, and until a design is published we show no figures.',
      preparado: 'Slot ready. No design published yet.',
      vistas: {
        control: 'Board view',
        perspectiva: 'Perspective',
        superior: 'Top',
        inferior: 'Bottom',
      },
      ficha: {
        medidas: 'Size',
        capas: 'Layers',
        componentes: 'Parts',
        vias: 'Vias',
      },
      alt: '3D render of {{nombre}}, {{vista}} view.',
      estados: {
        rotulo: 'STATUS',
        disenoVerificado: 'Design verified · ready to manufacture',
        fabricadoProbado: 'Manufactured and tested',
        alcanzado: '(reached)',
        pendiente: '(pending)',
      },
      lista: {
        atmega328p: {
          nombre: 'ATmega328P board',
          descripcion:
            '8-bit microcontroller: for simple readings and control, with low power draw.',
        },
        esp32: {
          nombre: 'ESP32 board',
          descripcion:
            'Built-in WiFi and Bluetooth: for devices that send their data to a cloud system.',
        },
        stm32: {
          nombre: 'STM32 board',
          descripcion:
            '32-bit microcontroller: for real-time control and industrial buses.',
        },
      },
    },

    preguntas: {
      etiqueta: 'FAQ',
      titulo: 'Before you ',
      acento: 'ask for a quote',
      tituloDespues: '.',
      lista: [
        {
          p: 'Do I need to bring a schematic?',
          r: 'No. Tell us what the board must do, where it will live and how it is powered. We draw the schematic.',
        },
        {
          p: 'Who manufactures the board?',
          r: 'We work with JLCPCB. We can place the order for you or hand you the files ready to order with your own account.',
        },
        {
          p: 'Are the files mine?',
          r: 'Yes. You get the full KiCad project, editable and license-free, plus the manufacturing files.',
        },
        {
          p: 'How long does it take?',
          r: 'It depends on how complex the board is. We give you a concrete date with the quote; JLCPCB adds its own production and shipping time.',
        },
      ],
    },

    cierre: {
      etiqueta: 'GET A QUOTE',
      titulo: 'Tell us what your board must ',
      acento: 'do',
      tituloDespues: '.',
      guiaEmi: 'A photo of your prototype or a hand sketch is enough to start.',
      whatsapp: 'Message us on WhatsApp',
      correo: 'Or by email:',
    },
  },

  metodo: {
    etiqueta: 'METHOD',
    titulo: 'Order comes before ',
    acento: 'talent',
    tituloDespues: '.',
    entradilla:
      'There is a way of doing things and it is written down. That is what lets someone else pick the work up without doing archaeology.',
    guiaEmi:
      'Four steps and four values. Look at the right-hand column: that is where it says how each one is checked.',

    pasos: {
      entender: {
        titulo: 'Understand how you work today',
        texto:
          'Before proposing anything we look at the real operation: who touches what, where it breaks and which file cannot go missing.',
        entrega: 'Map of the current process',
      },
      disenar: {
        titulo: 'Design the system',
        texto:
          'Scope is agreed with a minimum, a maximum and the assumptions behind both. What is left out is written down too.',
        entrega: 'Scope with range and assumptions',
      },
      construir: {
        titulo: 'Build with method',
        texto:
          'Versioned code, with tests and short deployments. You see working progress, not screenshots.',
        entrega: 'Partial releases, deployed',
      },
      entregar: {
        titulo: 'Hand over with the keys',
        texto:
          'The repository, the infrastructure and the documentation end up in your name. It closes with a technical session, not an email.',
        entrega: 'Handover and operations document',
      },
    },

    valoresTitulo: 'Four values, four checks',
    valoresEntradilla:
      'A value you cannot verify is not a value: it is decoration. Here are the four and how each one is checked.',
    comoSeComprueba: 'HOW IT IS CHECKED',

    valores: {
      metodo: {
        nombre: 'Method',
        significa:
          'Order comes before talent. There is a way of doing things and it is written down.',
        comprueba:
          'Versioned, documented code with tests. Anyone can pick it up.',
      },
      transparencia: {
        nombre: 'Transparency',
        significa:
          'Real timelines, costs and risks are stated, including when they are uncomfortable.',
        comprueba:
          'Estimates with a range and explicit assumptions. Scope changes are written down.',
      },
      flujo: {
        nombre: 'Flow',
        significa:
          'The value is in things moving without friction, not in looking complex.',
        comprueba:
          'Automation of the repeatable. Short, frequent deployments.',
      },
      permanencia: {
        nombre: 'Permanence',
        significa:
          'Built to keep working when nobody is watching it any more.',
        comprueba:
          'No exotic dependencies. Handover documentation. Transfer is possible.',
      },
    },
  },

  fabrica: {
    etiqueta: 'THE FACTORY',
    titulo: 'Eight lines, from the board to the ',
    acento: 'cloud',
    tituloDespues: '.',
    entradilla:
      'A factory has processes, has measurements and delivers parts that fit. These are the production lines and what has come off each one.',
    guiaEmi:
      'Pick a line and you will see its five slots. Lit nodes open; unlit ones are free.',

    contador: {
      entregadas: 'PARTS DELIVERED',
      enCurso: 'ON THE LINE',
      libres: 'OPEN SLOTS',
      lineas: 'LINES RUNNING',
    },

    naturalezas: {
      hardware: 'HARDWARE',
      software: 'SOFTWARE',
    },

    llenado: '{{ocupadas}} of {{total}} slots filled',
    plazaLibre: 'Open slot',
    /* Third-party brand label on the board. */
    paraCliente: 'for {{cliente}}',
    indice: 'ALL PARTS',

    anticipoCierre:
      'The full board has eight production lines, from the microcontroller to the cloud, with the open slots in plain sight.',
    anticipoBoton: 'See the full portfolio',

    lineaVaciaTitulo: 'This line is running and has no parts yet.',
    lineaVaciaEmi:
      'Nothing is published here yet. If you have a project on this line, it could be the first.',
    lineaVaciaBoton: 'Propose a project',

    estados: {
      entregada: 'Delivered',
      'en-curso': 'On the line',
      libre: 'Open slot',
    },

    lineas: {
      pcb: {
        nombre: 'Schematics & PCB',
        descripcion:
          'From the schematic to the fabrication files. Boards routed so they can be produced, measured and repaired, not just so the prototype works.',
      },
      circuitos: {
        nombre: 'Electrical circuits',
        descripcion:
          'Power and control diagrams, panels and protections. What makes a machine start without anyone having to guess the wiring.',
      },
      firmware: {
        nombre: 'Firmware',
        descripcion:
          'Microcontroller programs: sensor reading, industrial buses and real-time control. With the code versioned, not sitting on somebody’s laptop.',
      },
      cad: {
        nombre: '3D & CAD',
        descripcion:
          'Computer-aided design, mechanical parts and enclosures ready to print or machine. With measurements, tolerances and a drawing.',
      },
      interfaces: {
        nombre: 'Interfaces',
        descripcion:
          'Applications and components people use to run a system every day. Built for whoever spends eight hours in them, not for the screenshot.',
      },
      landings: {
        nombre: 'Landing pages',
        descripcion:
          'Presentation sites that load fast, get found and explain an offer without wasting anybody’s time.',
      },
      paneles: {
        nombre: 'Dashboards',
        descripcion:
          'Where the real state of the operation shows: inventory, sensors, progress, alerts. One fact per screen, not a wall of decoration.',
      },
      tiendas: {
        nombre: 'Online stores',
        descripcion:
          'Commerce wired into the inventory and invoicing that already exist, so selling does not mean entering everything twice.',
      },
    },

    enlaces: {
      demo: 'See it live',
      repositorio: 'Repository',
      caso: 'Case study',
      esquematico: 'Schematic',
      render: 'Render',
      gerbers: 'Fabrication files',
      ficha: 'Data sheet',
      video: 'Video',
    },

    ficha: {
      volver: 'Back to the Factory',
      medidas: 'MEASUREMENTS',
      pila: 'TECHNICAL STACK',
      arquitectura: 'HOW IT IS BUILT',
      servicio: 'SERVICE',
      incluye: 'What it includes',
      linea: 'Line',
      anio: 'Year',
      estado: 'Status',
      sector: 'Sector',
      cliente: 'Client',
      aporte: 'Ayemi’s contribution',
      anterior: 'Previous',
      siguiente: 'Next',
      masDeLaLinea: 'More parts from this line',
      sinEnlacesTitulo: 'No public links yet',
      sinEnlacesTexto:
        'This part belongs to a client and there is no authorisation yet to publish the repository or a demo. If the technical detail is useful to you, ask and we will go through it.',

      /* Third-party brands. Three statements, none of them spare: the brand is
         independent, what Ayemi did, and that naming it implies no endorsement. */
      atribucionTitulo: '{{cliente}} is an independent brand',
      atribucionTexto:
        '{{cliente}} is not part of Ayemi, nor Ayemi part of {{cliente}}. This part is work Ayemi did for them as a development supplier; the product, the brand and the data are theirs. It appears here as a work reference, not as an endorsement, partnership or recommendation on their side. Trademarks and trade names belong to their respective owners.',

      cierre:
        'Have something similar in your operation? Tell us how you work today and what breaks.',
      cierreBoton: 'Let’s talk about your case',
    },

    nota: 'Open slots are exactly that: gaps in the line. We would rather show them than fill the board with work that does not exist. When a part was built for another brand, that brand is named and marked as independent from Ayemi; what we do not publish without permission is the client’s data, code and figures.',
  },

  noEncontrada: {
    titulo: 'This page is not here.',
    texto:
      'The address does not match anything published. The link may have changed, or the part may not be on the board yet.',
    emi: 'Nothing you did wrong. Here is where to go next.',
    inicio: 'Go to the start',
    fabrica: 'See the Factory',
    lineas: 'PRODUCTION LINES',
  },

  emi: {
    etiqueta: 'THE THIRD SYLLABLE',
    titulo: 'Emi',
    quienEs:
      'Emi takes her name from Emilio, the third of the three. She is the part of the brand that talks to you when you need help: she accompanies, warns, celebrates and explains. She never sells and never signs.',
    nucleo:
      'Her antenna is topped by El Núcleo, the same cyan circle that crowns the “i” in the logotype. That detail is what makes her belong to the system rather than being a loose drawing.',

    lasExpresiones: 'THE EIGHT EXPRESSIONS',
    lasPoses: 'THE FOUR POSES',
    cuando: 'WHEN IT IS USED',
    diria: 'WHAT SHE WOULD SAY',
    retratoAlt: 'Emi with a {{expresion}} expression',

    expresiones: {
      feliz: {
        nombre: 'Happy',
        cuando: 'The default. Welcome, general success, new account.',
        dice: 'Hello. Shall we start with your first process?',
      },
      atento: {
        nombre: 'Listening',
        cuando: 'Paying attention. Forms, chat, questions.',
        dice: 'I am reading. Tell me what you need.',
      },
      procesando: {
        nombre: 'Working',
        cuando: 'Loading, deployment in progress, calculation.',
        dice: 'Getting your dashboard ready.',
      },
      celebrando: {
        nombre: 'Celebrating',
        cuando: 'Successful deployment, milestone, confirmed payment.',
        dice: 'Done. Your process is saved.',
      },
      alerta: {
        nombre: 'Warning',
        cuando: 'Recoverable warning. Quota, confirmation required.',
        dice: 'You have two sends left this month. You can extend whenever you want.',
      },
      error: {
        nombre: 'Error',
        cuando: 'Blocking failure. Lost connection, broken build.',
        dice: 'Something failed on our side. We are already looking at it.',
      },
      vacio: {
        nombre: 'Empty',
        cuando: 'No results, clean inbox, page not found.',
        dice: 'There is nothing here yet.',
      },
      reposo: {
        nombre: 'Idle',
        cuando: 'Inactivity, session paused.',
        dice: 'I am still here when you want to pick it up.',
      },
    },

    poses: {
      flotando: 'Floating',
      saludando: 'Waving',
      senalando: 'Pointing',
      celebrando: 'Celebrating',
    },

    dondeSi: 'Where she belongs',
    dondeNo: 'Where she does not',
    donde: {
      si: [
        'Empty states, loading, success and error',
        'Chat and help centre',
        'Onboarding and tutorials',
        'Product documentation',
        'Social and community',
        'Status and error pages',
      ],
      no: [
        'Contracts and legal annexes',
        'Invoices and quotes',
        'Technical and commercial proposals',
        'Corporate stationery',
        'Email signature',
        'Serious incident communication',
      ],
    },

    nota: 'On this site Emi does the two things that are hers: she welcomes you and walks you through each section, and she holds the states where something is missing, loading or going right. What she never does is sign: the signature is the logotype, not her.',
  },

  stack: {
    etiqueta: 'TECHNICAL CAPABILITY',
    tituloAntes: 'Technologies we ',
    tituloAcento: 'work with',
    subtitulo:
      'From firmware and industrial protocols through to cloud deployment. Every piece is chosen because someone has to maintain it afterwards.',
    guiaEmi:
      'Switch category with the arrows. Hover over the system and it stops so you can read it.',
    contador: '{{count}} technologies',
    contadorPosicion: '{{actual}} of {{total}}',
    pista: 'Tap a node for details',
    categorias: {
      frontend: 'Interface',
      backend: 'Services & APIs',
      datos: 'Databases',
      nube: 'Cloud & deployment',
      embebido: 'Embedded & IoT',
      electronica: 'Electronics',
      cad: '3D & CAD',
    },
  },

  posicionamiento: {
    etiqueta: 'POSITIONING',
    titulo: 'Against the ',
    acento: 'alternatives',
    tituloDespues: '.',

    guiaEmi:
      'Here is the comparison without decoration. If you recognise yourself in one of the three profiles below, you fit.',

    declaracion:
      'For the mid-sized company that no longer fits in its spreadsheets, Ayemi is the software factory that delivers systems you own, documented and operable, because it builds with engineering method and explains every decision in the language of the business.',

    frenteTitulo: 'Why Ayemi and not another option',
    frente: {
      freelance: {
        quien: 'Against a freelancer',
        ventaja:
          'Ayemi has method and continuity. The project does not depend on one person’s calendar or memory.',
      },
      agencia: {
        quien: 'Against a large agency',
        ventaja:
          'Direct contact with no overhead markup. You talk to whoever builds it, not to whoever forwards it.',
      },
      estanteria: {
        quien: 'Against off-the-shelf software',
        ventaja:
          'Ayemi fits your real process, not the other way round. You do not pay for modules you never use or reshape your operation to fit a product.',
      },
    },

    publicoTitulo: 'Who this is for',
    publicoEntradilla:
      'None of these people is a programmer. The how can be technical; the what and the why are said in hours saved and errors avoided.',
    queLeDuele: 'WHAT HURTS',
    queEspera: 'WHAT THEY EXPECT',

    publico: {
      primario: {
        quien: 'Companies of 10 to 200 people',
        duele:
          'Everything depends on one person and one file nobody else understands.',
        espera: 'Someone to turn that into a system and explain it to them.',
      },
      secundario: {
        quien: 'Operations or finance leadership',
        duele: 'They need a specific tool that IT will not prioritise.',
        espera:
          'A responsive supplier that does not force them to fight for internal budget.',
      },
      terciario: {
        quien: 'Another studio or agency',
        duele: 'Commitments sold without a team to deliver them.',
        espera:
          'A discreet partner who delivers and does not compete for the client.',
      },
    },
  },

  origen: {
    etiqueta: 'WHERE THE NAME COMES FROM',
    titulo: 'Three names, one single ',
    acento: 'current',

    manifiesto:
      'Ayemi does not say “Agustín makes software”. It says “something converges here and keeps going”.',

    parrafoCasa:
      'The name is a contraction of three: Agustín, Yazmín and Emilio. It is not a decorative acronym, it is the structure of the name, and it explains why the brand talks about confluence, current and flow. Three origins running into one.',
    parrafoFabrica:
      'That has a practical consequence: Ayemi is not a personal brand, it is a house. It can grow, bring people in and outlive any of its three names. The word factory is deliberate: a factory has processes, has measurements, delivers parts that fit and repeats results.',

    propositoEtiqueta: 'PURPOSE',
    proposito:
      'Turn a company’s repetitive work into systems that hold themselves up, so people can get back to what actually needs judgement.',
    propositoNota:
      'The purpose deliberately does not mention technology. Technology changes; the problem Ayemi solves does not.',

    normaEtiqueta: 'HOW IT IS WRITTEN',
    norma:
      'It is written Ayemi: one word, capital A, the rest lower case.',
    pronunciacion: '/a·ˈye·mi/ · stress on the second syllable',
  },

  contacto: {
    etiqueta: 'CONTACT',
    titulo: 'Tell us which part of your operation ',
    acento: 'hurts',
    tituloDespues: '.',
    entradilla:
      'You do not need to arrive with the system already designed. Describing how you work today and what breaks is enough to start.',
    guiaEmi:
      'I am reading. Two lines about the process that is costing you time is enough.',

    campos: {
      nombre: 'Name',
      correo: 'Email',
      empresa: 'Company',
      empresaAyuda: 'Optional. Helps us understand the size of the operation.',
      mensaje: 'What you need',
      mensajeAyuda:
        'Which process is costing you time today and who runs it.',
    },

    errores: {
      nombreFalta: 'Your name is missing, so we know how to address you.',
      correoFalta: 'The email is missing. It is how the reply gets back to you.',
      correoSinArroba:
        'That email has no at sign. Check that it is complete.',
      correoSinDominio:
        'The domain after the at sign is missing, for example .com or .mx.',
      mensajeFalta: 'The message is missing. Two lines about the process is enough.',
      mensajeCorto:
        '{{faltan}} more characters gives us enough context to reply with something useful.',
    },

    enviar: 'Send message',
    enviando: 'Sending',

    enviandoTitulo: 'Sending your message',
    enviandoEmi: 'One moment, it is going out.',

    exitoTitulo: 'Message received',
    exitoTexto:
      'We reply within one business day. If it is urgent, the direct email is alongside.',

    borradorTitulo: 'A draft opened in your email',
    borradorTexto:
      'This site does not have a sending service connected yet, so we will not call something sent that never left: the message was prepared in your email client with the details already filled in. All that is left is to send it.',
    borradorAsunto: 'Project · {{nombre}}',

    falloTitulo: 'The message did not go out',
    falloTexto:
      'The sending service did not respond, and we would rather not call something delivered when it was not.',
    falloAccion: 'Open an email draft',

    revisaTitulo: 'A few details are missing',
    revisaTexto:
      'The marked fields show what is missing. Nothing you wrote was lost.',

    directoTitulo: 'Direct line',
    directoTexto: 'If you would rather skip the form.',
    canales: {
      correo: 'Email',
      mensaje: 'Direct message',
    },
    sinCanales:
      'The direct channels are not published yet. The form works.',
    nuevaPestana: '(opens in a new tab)',
  },

  pie: {
    navegacion: 'Sections',
    contacto: 'Contact',
    derechos: 'All rights reserved',
    nuevaPestana: '(opens in a new tab)',
    sinCanales: 'Not published yet',
    sistema: 'Identity system · edition 2.0',
    privacidad: 'Privacy notice',
  },

  privacidad: {
    etiqueta: 'PRIVACY',
    soloEspanol: 'This notice is published in Spanish, the language required by Mexican data protection law.',
  },

  ofertas: {
    etiqueta: 'TO GET STARTED',
    titulo: 'Two ways to ',
    acento: 'try us',
    tituloDespues: ' before a project.',
    desde: 'From {{precio}}',
    gratis: 'Free',
    revisionPcb: {
      titulo: 'PCB review',
      texto: 'Send us your KiCad project before manufacturing and get back a report with every finding: JLCPCB rules, footprints against the datasheet, decoupling and routing. The price is fixed before we start.',
      boton: 'Request your review',
      mensaje: 'Hi, I want a review of my PCB before manufacturing it. My project is:',
    },
    diagnostico: {
      titulo: '30-min diagnosis',
      texto: 'A video call where you tell us what breaks today in your operation. We tell you what we would do first and what it would cost, no strings attached.',
      botonAgenda: 'Book 30 min',
      botonWhatsapp: 'Request your diagnosis',
      mensaje: 'Hi, I want to book the 30-min diagnosis. What breaks today is:',
    },
  },

  caso: {
    etiqueta: 'CASE · {{cliente}}',
    problema: 'The problem',
    hicimos: 'What we did',
    resultado: 'Result',
    capturas: 'Screenshots',
    testimonio: 'Testimonial',
    ficha: 'See the technical sheet',
    mensajeWhatsapp: 'Hi, I saw the {{cliente}} case and have something similar in my operation.',
  },

  enlaces: {
    propuesta: 'Internal software and circuit boards, documented and in your hands.',
    mensajeWhatsapp: 'Hi, I saw you on social media and want to talk about a project.',
    botones: {
      whatsapp: 'Message us on WhatsApp',
      pcb: 'Get a PCB quote',
      agenda: 'Book a 30-min diagnosis',
      youtube: 'Watch us on YouTube',
      caso: 'Case: ITA website',
      sitio: 'Meet Ayemi',
    },
  },

  cookies: {
    region: 'Cookie notice',
    texto: 'We use Google Analytics, Meta and Microsoft Clarity cookies to measure what works on this site. Your data and how to turn them off are in the',
    enlace: 'privacy notice',
    aceptar: 'Got it',
  },
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: 'es',
  /* El español es el idioma primario de la marca, así que también es el
     respaldo: una clave sin traducir cae al castellano, no al inglés. */
  fallbackLng: 'es',
  /* Las listas de entregables se leen como array desde el componente. */
  returnObjects: true,
  interpolation: {
    escapeValue: false, // React ya protege contra inyección
  },
});

export default i18n;
