export const projectsData = [
  {
    id: "01",
    title: "pit0nisa",
    categoryLabel: "LITERATURA EXPANDIDA",
    category: "literatura",
    description: `pit0nisa es una antología que explora la naturaleza mediúmnica del lenguaje computacional. Generados a partir de un algoritmo de cadenas de Markov, los poemas de pit0nisa son excusas para hacer hablar a la máquina sobre sí misma. La dimensión cinemática de la carga marca su propio ritmo: el mensaje no puede ser acelerado, tampoco retardado; estamos ante un oráculo aleatorio y arbitrario.
      \n
      Este proyecto fue desarrollado en el taller *Escribir como máquinas*, de Matías Buonfrate y Gerardo Montoya, e incluido en la antología de [Lit(e)Lat 2024](https://litelat.net/). 
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
    @_botkowski es un bot de X inspirado en ["My Computer"](https://allpoetry.com/My-Computer), de Charles Bukowski. En este poema, el autor cuenta las reacciones de su entorno luego de la compra de su primera computadora: sus colegas y hasta su editor temían que la máquina terminara escribiendo su obra. 
    \n
    En "My computer", Bukowski responde: 
    \`me? I want to go the next step beyond the computer\`
    \n
    
  Este bot cumple esa ambición: extrae vocabulario de *Essential Bukowski: Poetry* y recombina sus palabras para crear contenido original en X, manteniendo su gramática y estilo.
  \n
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
    BudínCam es un sistema de monitoreo hogareño construido con una ESP32-CAM conectada a WiFi y enlazada a un bot de Telegram. 
    
    A través de comandos como \`/photo\` o \`/flash\`, permite la captura remota de imágenes y control del flash integrado.
    
    El proyecto fue pensado para chequear a mi gata cuando no estoy en casa, especialmente, que su alimentador automático siga funcionando.
    `,
    image: "/images/esp32.jpeg",
    link: "",
    year: "2024",
    technologies: ["ESP32-CAM", "Telegram Bot", "IoT"],
    images: [
      {
        src: "/budin-cam/budin-cam-1.jpeg",
        alt: "Budín con la ESP32-CAM",
        caption: "Budín con la ESP32-CAM",
      },
      {
        src: "/budin-cam/budin-cam-2.jpeg",
        alt: "Prueba de flash de la ESP32-CAM",
        caption: "Prueba de flash de la ESP32-CAM",
      },
      {
        src: "/budin-cam/budin-cam-3.jpeg",
        alt: "Montaje en pared",
        caption: "Montaje en pared",
      },
      {
        src: "/budin-cam/budin-cam-4.jpeg",
        alt: "Capturas del bot de Telegram",
        caption: "Capturas del bot de Telegram",
      },
    ]
  },
  {
    id: "05",
    title: "mdq-cyborg",
    categoryLabel: "ELECTRÓNICA",
    category: "hardware",
    description: `
    mdq-cyborg es un souvenir marplatense reimaginado: una estación climática casera que consulta una API para obtener datos de la temperatura y humedad como los clásicos lobos marinos del clima. 
    
    El dispositivo consta de una placa ESP-WROOM, conectada a tres LEDs que son los que traducen la data de la API e indican el nivel de humedad: azul (normal), violeta (media) y rosa (alta). Su v1 tenía, además, un sensor de temperatura y humedad DHT22, que luego fue reemplazado por la API Open-Meteo.
    `,
    image: "/images/mdq-cyborg-16.jpeg",
    link: "",
    year: "2024",
    technologies: ["ESP-WROOM", "Clima API", "LEDs", "Electrónica"],
    images: [
      {
        src: "/mdq-cyborg/mdq-cyborg-1.jpeg",
        alt: "Esquemático en Fritzing (v1)",
        caption: "Esquemático en Fritzing (v1)",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-4.jpeg",
        alt: "Transferencia térmica del diseño",
        caption: "Transferencia térmica del diseño",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-8.jpeg",
        alt: "Grabado en ácido férrico",
        caption: "Grabado en ácido férrico",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-5.jpeg",
        alt: "Limpieza de la placa en agua",
        caption: "Limpieza de la placa en agua",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-7.jpeg",
        alt: "Resultado del grabado",
        caption: "Resultado del grabado",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-11.jpeg",
        alt: "Placa transferida",
        caption: "Placa transferida",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-12.jpeg",
        alt: "Posicionamiento de los LEDs para soldado",
        caption: "Posicionamiento de los LEDs para soldado",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-13.jpeg",
        alt: "Soldado de componentes",
        caption: "Soldado de componentes",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-17.jpeg",
        alt: "Resultado del soldado",
        caption: "Resultado del soldado",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-19.jpeg",
        alt: "Sensor de temperatura y humedad quemado (v1)",
        caption: "Sensor de temperatura y humedad quemado (v1)",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-20.jpeg",
        alt: "mdq-cyborg en un día de buen clima (1)",
        caption: "mdq-cyborg en un día de buen clima (1)",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-21.jpeg",
        alt: "mdq-cyborg en un día de buen clima (2)",
        caption: "mdq-cyborg en un día de buen clima (2)",
      },
      {
        src: "/mdq-cyborg/mdq-cyborg-22.jpeg",
        alt: "mdq-cyborg en un día de mucha humedad",
        caption: "mdq-cyborg en un día de mucha humedad",
      },
    ],
  },
  {
    id: "06",
    title: "script-fusión",
    categoryLabel: "INSTALACIÓN",
    category: "creative-coding",
    description: `
    Proyecto final para la Maestría en Artes Electrónicas (UNTREF). La web del proyecto fue desarrollada en Next.js, frontend y backend, y conectada por Bluetooth a una impresora térmica. El backend actúa como proceso padre y controla un submódulo que replica, mediante ingeniería inversa, la app original de la impresora. Al repositorio original se le sumaron funciones como la impresión sin mantener ratio de la imagen (para imprimir, por ejemplo, tickets largos, como las recetas que utilizamos para el proyecto) y desactivar el modo suspensión (para matener funcionando la impresora durante la exposición).  
    \n
    El proyecto fue expuesto en [Casa Belgrado](https://www.instagram.com/casabelgrado/) durante la muestra [La pulsión de lo errático](https://www.instagram.com/p/DDBDIrpvue7/).
    `,
    image: "/images/scriptfusion.png",
    link: "https://script-fusion.vercel.app/",
    year: "2024",
    technologies: [
      "Next.js",
      "Bluetooth",
      "Thermal Printer",
      "Node.js",
      "Reverse Engineering",
    ],
  },
  {
    id: "07",
    title: "bucles",
    categoryLabel: "ELECTRÓNICA",
    category: "hardware",
    description: `

bucles está construido sobre una placa Arduino Mega 2560 a la que están conectados, a través de una protoboard, los siguientes componentes:

- Una pantalla lcd de 16x2, soldada al módulo I2C
- Un potenciómetro de 100k ohms 
- Una serie de seis leds, organizados en forma de círculo

El potenciómetro controla la frecuencia de los procesos. El lcd recibe la orden y despacha el poema al ritmo solicitado. Los leds reaccionan en el mismo sentido, cubriendo un loop completo. La comunicación entre los componentes sucede de forma cíclica.

El proyecto recupera el poema de [@lafatbordieu](https://www.instagram.com/lafatbordieu/) que encapsula el ritmo de las cosas y su recursividad. En el concepto de bucles extraños, según dice Douglas Hofstadter, autor de *Gödel Escher Bach: un eterno y grácil bucle*, va implícito el de infinito, porque qué otra cosa es un bucle sino una forma de representar de manera finita un proceso interminable. 


    `,
    image: "/images/bucles1.png",
    link: "https://vimeo.com/1091489697?share=copy#t=0",
    video: "https://vimeo.com/1091489697?share=copy#t=0",
    year: "2024",
    technologies: ["Arduino Mega 2560", "LCD", "LEDs", "Poesía"],
  },
  {
    id: "08",
    title: "page turner DIY",
    categoryLabel: "ELECTRÓNICA",
    category: "hardware",
    description: `
En abril me pedí por Amazon un page turner con control remoto para el Kindle, junto con otros dispositivos para leer cómoda desde el sillón.MEl envío se retrasó… después se volvió a retrasar… y al final lo cancelaron y me ofrecieron el reembolso. Así que pensé en armar uno DIY.

Usé un Arduino Pro Mini, un sensor IR, un micro servo y un control remoto genérico. El primer obstáculo fue mínimo pero clásico: el control no traía pila. Se resolvió con una batería reciclada de otro dispositivo.

La pantalla del Kindle es capacitiva, así que el toque del servo necesitaba conductividad. Le envolví el brazo en papel aluminio y lo conecté a 3.3V para simular un dedo.

El resultado: un page turner DIY, funcional, preciso y cómodo para leer sin moverse del sillón.

    `,
    image: "/images/page-turner-diy-1.jpeg",
    video: "https://vimeo.com/1092307749?share=copy",
    year: "2025",
    technologies: ["Arduino Pro Mini", "IR sensor", "Micro Servo Motor"],
  },
];
