export const projectsData = [
  {
    id: "01",
    title: "pit0nisa",
    categoryLabel: "LITERATURA EXPANDIDA",
    category: "literatura",
    description: `pit0nisa es una antología que explora la naturaleza mediúmnica del lenguaje computacional. Generados a partir de un algoritmo de cadenas de Markov, los poemas de pit0nisa son excusas para hacer hablar a la máquina sobre sí misma. La dimensión cinemática de la carga marca su propio ritmo: el mensaje no puede ser acelerado, tampoco retardado; estamos ante un oráculo aleatorio y arbitrario.
      \n
      Este proyecto fue desarrollado en el curso *Escribir como máquinas*, de Matías Buonfrate y Gerardo Montoya, e incluido en la antología de [Lit(e)Lat 2024](https://litelat.net/). 
      `,
    image: "/images/pit0nisa.png",
    link: "https://pit0nisa.netlify.app/",
    year: "2020",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "02",
    title: "mc-txt",
    categoryLabel: "LITERATURA EXPANDIDA",
    category: "literatura",
    description: `
      mc-txt es un generador de texto gamificado. A partir de búsquedas en la API de Wikipedia, mc-txt recibe extractos relacionados a los inputs ingresados y utiliza cadenas de Markov para generar texto nuevo.
      \n
      Este proyecto fue desarrollado en el marco del taller *Escribir como máquinas*, de Matías Buonfrate y Gerardo Montoya, e incluido en la antología de [Lit(e)Lat 2024](https://litelat.net/). 
      `,
    image: "/images/mc-txt.png",
    link: "https://mc-txt.netlify.app/",
    year: "2021",
    technologies: ["React", "Nes.CSS"],
  },
  {
    id: "03",
    title: "botkowski",
    categoryLabel: "BOT",
    category: "bots",
    description: `
  @_botkowski es un bot de X inspirado en *My Computer*, un poema de Charles Bukowski donde el autor cuenta cómo, tras comprarse una computadora, sus colegas —incluso su editor— lo acusan de que la máquina va a terminar escribiendo por él.
  El bot nació en el taller *Jardín de Bots*, coordinado por [Canek Zapata](https://canekzapata.net/index.html). 
      `,
    image: "/images/botkowski.png",
    link: "https://x.com/_botkowski",
    year: "2022",
    technologies: ["Gimmick bots", "No-code"],
  },
  {
    id: "04",
    title: "budín-cam",
    categoryLabel: "IOT",
    category: "iot",
    description: `
    BudínCam es un sistema de monitoreo hogareño construido con una ESP32-CAM conectada a WiFi y enlazada a un bot de Telegram. A través de comandos como \`/photo\` o \`/flash\`, permite capturar imágenes o activar el flash de forma remota. El proyecto fue pensado para controlar a mi gata cuando no estoy en casa, especialmente su alimentador automático. 
    `,
    image: "/images/esp32.jpeg",
    link: "",
    year: "2024",
    technologies: ["ESP32-CAM", "Telegram Bot", "IoT"],
  },
  {
    id: "05",
    title: "mdq-cyborg",
    categoryLabel: "ELECTRÓNICA",
    category: "hardware",
    description: `
    mdq cyborg es un souvenir marplatense reimaginado: una estación climática casera que, con una ESP-WROOM, consulta una API de clima (espacio para completar) para obtener datos de temperatura y humedad en Mar del Plata. Tres LEDs indican el nivel de humedad: azul (normal), rosa (alta) y violeta (media). Una mezcla de nostalgia y electrónica con propósito.
    `,
    image: "/images/mdqcyborg.png",
    link: "",
    year: "2024",
    technologies: ["ESP-WROOM", "Clima API", "LEDs", "Electrónica"],
  },
  {
    id: "06",
    title: "script-fusión",
    categoryLabel: "INSTALACIÓN",
    category: "creative-coding",
    description: `
    Proyecto final para la Maestría en Artes Electrónicas (UNTREF), desarrollado con Next.js. Combina front y backend, junto con una impresora térmica conectada por Bluetooth. El backend actúa como proceso padre y controla un submódulo que replica, mediante ingeniería inversa, la app original de la impresora. Se sumaron funciones como impresión sin mantener ratio y desactivación del modo suspensión. La implementación derivó en un pull request al repo original, generando un ida y vuelta técnico con el maintainer.  
    Fue expuesto en Casa Belgrado durante la muestra *La pulsión de lo errático*.
    `,
    image: "/images/scriptfusion.png",
    link: "https://tu-link-al-proyecto.com",
    year: "2024",
    technologies: ["Next.js", "Bluetooth", "Thermal Printer", "Node.js", "Reverse Engineering"],
  },
  {
    id: "07",
    title: "bucles",
    categoryLabel: "ELECTRÓNICA",
    category: "hardware",
    description: `
    bucles es una instalación poética-tecnológica construida con una placa Arduino Mega 2560, una pantalla LCD 16x2 con I2C, un potenciómetro y seis LEDs dispuestos en círculo. El potenciómetro regula la frecuencia de aparición de versos en pantalla y el ritmo lumínico de los LEDs. Basado en un poema de @lafatbordieu, el proyecto explora la repetición como pulsión, como lujo y como condena, evocando la idea de bucles extraños de Hofstadter.
    `,
    image: "/images/bucles.png",
    link: "",
    year: "2024",
    technologies: ["Arduino Mega 2560", "LCD", "LEDs", "Poetry & Code"],
  }
  
];
