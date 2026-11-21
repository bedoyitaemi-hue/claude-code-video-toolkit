# Canal de YouTube: memoria de trabajo

Resumen para retomar el canal en una sesión nueva. Última actualización: 21 de noviembre de 2026.

**Nombre del canal: De cero a libre.**

## Quién y cómo trabajamos

- Principiante total, trabaja desde el celular. Explicar en español, simple y un paso a la vez.
- Mostrar el guion y esperar aprobación antes de hacer el video.
- Por ahora todo con herramientas gratis. Avisar antes de cualquier cosa que cueste o pida una cuenta.

## Estilo del canal (decidido)

- Formato: Shorts verticales de unos 45 segundos.
- Temas: finanzas personales, disciplina y hábitos (desarrollo personal). Tono serio y motivador, sin promesas exageradas.
- Dibujo: stickman negros sobre fondo blanco o gris. Colores con significado: dorado para la motivación (la llama),
  azul para la disciplina (el camino), verde para el progreso (los ✓ y la escalera).
- Caras con expresiones, respiración y movimiento constante, leve acercamiento de cámara por escena.
- Subtítulos palabra por palabra (karaoke). "motivación" en dorado, "disciplina" en azul.
- Voz: Piper, voz `es_ES-davefx-medium` (acento de España), con un tono distinto por frase.
- Efectos de sonido suaves y música de fondo sintetizada, que baja sola cuando habla la voz.
- Gancho en los primeros 2 segundos: empezar por el final de la historia (la llama que se apaga) y luego retroceder.

## Video 1: "Por qué la motivación no dura (y la disciplina sí)"

- Estado: terminado (versión 3, 48 segundos, volumen a -14 LUFS, control de calidad sin errores). Le gustó.
- Proyecto: `projects/disciplina-short/` (Remotion). Guion en `scripts/guion.txt`.
- Título: `Por qué la motivación no dura (y la disciplina sí) #shorts`
- Descripción: "La motivación es una emoción: sube y baja. La disciplina es una decisión que tomas antes de tener
  ganas. Mañana, cuando no tengas ganas, haz la versión pequeña. Y vuelve." más `#disciplina #motivación #hábitos #shorts`
- Publicación: subir con la app de YouTube, primero como "No listado", revisar y pasar a "Público".
  No es contenido para niños.
- Hora sugerida: 7 p. m. hora de Colombia (público hispanohablante de todo el mundo). Probar después
  2 p. m. de Colombia, que es la noche en España, y comparar.

## Cómo se hizo (para repetirlo)

1. Voz: `scripts/voice_tones.py` genera una toma por frase con Piper y su tono (velocidad, melodía con
   `tools/voice_prosody.py expand`, tono con rubberband, volumen, pausa previa). Escribe `src/phrases.json`.
2. Tiempos de palabras: `scripts/align.py` (sílabas y pausas de cada toma; whisper no estaba disponible).
3. Sonidos y música: `scripts/sfx.py <segundos>` y `scripts/puff.py`.
4. Render: `npx remotion render Disciplina out/video.mp4 --browser-executable=/opt/pw-browsers/chromium`,
   luego `uv run tools/qc.py --render <archivo> --fix` para el volumen.

Los scripts usan rutas de la carpeta temporal de la sesión: hay que ajustarlas. Piper se instala con
`uv pip install piper-tts` y las voces se bajan de huggingface.co (repositorio `rhasspy/piper-voices`).
Para eso se creó el entorno de nube personal "Video toolkit (voces gratis)", que permite huggingface.co y sus servidores de descarga.

## Pendientes

- [ ] Publicar el video 1 y revisar en YouTube Studio cómo le va.
- [ ] Decir desde qué país publica, para darle la hora exacta en su reloj.
- [ ] Elegir el tema del video 2 (se reutiliza todo el estilo).
- [ ] Definir un horario fijo, por ejemplo martes y viernes a las 7 p. m.
- [ ] Con 5 a 10 videos: ver en YouTube Studio a qué hora se conecta su público y ajustar el horario.

## Mejoras posibles (ofrecidas, no elegidas todavía)

- Voz más humana: ElevenLabs (plan gratis limitado, pide cuenta) o Qwen3-TTS en Modal (créditos gratis mensuales,
  pide cuenta). Es la mejora que más se notaría.
- Música real con ACE-Step (necesita la misma cuenta de nube).
- Más cortes y cambios de cámara en los primeros 12 segundos (el control de calidad lo marca).
