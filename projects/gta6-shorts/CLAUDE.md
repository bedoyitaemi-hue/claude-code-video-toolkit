# gta6-shorts

Tres Shorts verticales sobre GTA 6 (estreno del 19 de noviembre de 2026), con stickman propio: sin imágenes, logos ni
arte del juego. Estado: **terminados**, listos para subir. Títulos, descripciones y orden en `PUBLICAR.md`.

## Cómo está hecho

- `scripts/videos.json`: guiones aprobados. `text` es el subtítulo y `say` lo que lee la voz (nombres en inglés
  escritos como suenan: "Yéison", "Pléisteishon", "onlain"). `energy` da el tono de cada frase.
- Voz (Piper `es_ES-davefx-medium`), en cuatro pasos:
  1. `voice_takes.py`: 5 a 10 tomas por frase.
  2. `voice_pick.py`: les da energía (melodía, un poco más aguda, sin bajar nunca el tono) y elige la mejor por variación,
     final de frase, bajones y ritmo.
  3. `voice_shape.py`: suaviza las caídas de más de 2,5 semitonos (los "bajones" que molestaban) y hace subir el final de
     las preguntas.
  4. `realign.py`: tiempos de cada palabra para los subtítulos.
- `scripts/sfx_gta.py`: efectos y música, sintetizados.
- `src/engine.tsx`: una toma por frase, cámara, subtítulos karaoke, voz, efectos y música que baja con la voz.
  `src/kit.tsx`: stickman con manos, poses, caras, accesorios (coleta de Lucia, gorra de Jason).
  `src/props.tsx`: objetos. `src/v1.tsx`, `v2.tsx`, `v3.tsx`: las tomas; cada gesto va atado a una palabra con `w('palabra')`.
- Render: `npx remotion render GTA1 out/gta1.mp4 --browser-executable=/opt/pw-browsers/chromium`, luego
  `uv run tools/qc.py --render <archivo> --fix` desde la raíz del toolkit.

## Aviso de calidad aceptado

`qc.py` dice que no hay corte en los primeros 10 a 12 s: sí hay uno por frase, pero comparten el mismo fondo.
