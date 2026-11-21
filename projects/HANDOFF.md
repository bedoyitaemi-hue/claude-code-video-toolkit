# Handoff: canales de YouTube (disciplina y Leonida al Día)

Para quien retome este trabajo en una sesión nueva. Estado al 20 de noviembre de 2026. Todo está en la rama
`claude/youtube-kit-mobile-setup-bu3g84` del repositorio `bedoyitaemi-hue/claude-code-video-toolkit`.

## Con quién trabajas

- Principiante total, trabaja desde el **celular**. Responder en **español**, simple y **un paso a la vez**.
- **Mostrar el guion y esperar aprobación** antes de hacer un video.
- **Solo herramientas gratis**, salvo que pida otra cosa. Avisar antes de algo que cueste o pida una cuenta.
- Revisa todo con su oído: si dice que algo suena mal, lo dice en serio (la voz Piper le sonó "trabada y robótica").
- Mandar siempre los archivos finales con SendUserFile y recordarle descargarlos.

## Reglas que no se negocian

- **Nada de logos, arte ni la palabra "oficial" de GTA o Rockstar.** El canal es de fans y lo dice en cada descripción.
- **Material de Rockstar** (tráileres, gameplay): su política solo lo permite sin fines comerciales. Sin spoilers,
  sin escenas sueltas, sin filtraciones. Si se usa, siempre con voz, comentario y overlays propios.
- **Clips de otros creadores**: solo con su permiso, o pocos segundos para comentarlos, con crédito.
  **No descargar gameplays de YouTube** ni buscar versiones sin marca de agua (el usuario lo pidió y se negó).
- **Datos**: solo los que aparecen en varias fuentes. Trucos y guías de dinero de GTA 6 se esperan hasta poder comprobarlos.
- Todo texto público pasa por `uv run tools/copy_lint.py` (sin guiones largos ni frases de relleno).

## Canal 1: disciplina (`projects/disciplina-short/`)

- Un Short terminado: "Por qué la motivación no dura (y la disciplina sí)", `out/disciplina-final-v3.mp4`.
- Estilo: stickman negro en fondo blanco o gris; dorado = motivación, azul = disciplina, verde = progreso.
- Memoria: `projects/CANAL-YOUTUBE.md`. Pendiente: publicarlo y elegir el tema del video 2.

## Canal 2: Leonida al Día, GTA 6 (`projects/gta6-shorts/`)

- **Nombre** Leonida al Día, **usuario** @LeonidaAlDia. Kit en `canal/` (foto de perfil, banner, marca de agua,
  `mark.svg`, `CANAL.md`). Resumen de la sesión: `canal/RESUMEN-SESION.md`.
- **Videos terminados** (`out/`):
  - `GTA6-short-1.mp4` "GTA 6 ya salió: lo que tienes que saber" (39 s)
  - `GTA6-short-2.mp4` "¿GTA 6 en PC? La respuesta" (31 s)
  - `GTA6-short-3.mp4` "GTA 6 sacó 99: lo bueno y lo malo" (31 s)
  - `GTA6-curiosidades-v2.mp4` "GTA 6 rompió internet" (44 s): el video del usuario rehecho sobre sus tomas de tráiler
- Títulos y descripciones: `PUBLICAR.md` (los 3 primeros) y el mensaje de la sesión para el de curiosidades
  ("GTA 6 rompió internet: 5 récords que no conocías #shorts").
- Orden sugerido: Short 1, luego 2 (el 1 lo anuncia), luego 3; a las 7 p. m. hora de Colombia.

### Estilo de los Shorts de GTA 6

- Stickman de `src/kit.tsx` (manos, caras, poses, coleta de Lucia, gorra de Jason) sobre fondos claros con acentos
  rosa `#E0407A`, turquesa `#0F9A96` y morado `#6A4AD6`. Un fondo por bloque de la historia.
- **Una toma por frase**; el stickman actúa lo que se dice en la palabra exacta (`w('palabra')` en `v1/v2/v3.tsx`).
- Subtítulos karaoke palabra por palabra; números y palabras clave en rosa.
- Voz: **Kokoro `em_alex`**, sin retoques de tono (los retoques la dejaban trabada). Música y efectos sintetizados.
- Videos con tomas de terceros (`src/r1.tsx`): tomas a pantalla completa, recuadro oscuro con subtítulos nuevos encima
  de los viejos, etiqueta del canal sobre la etiqueta vieja, tarjetas de números, stickman en un círculo, 5 puntos de avance.

## Cómo rehacer el entorno (se pierde con cada sesión)

```bash
# Kokoro (voz actual), en la carpeta temporal
uv venv kokoro/.venv && uv pip install --python kokoro/.venv/bin/python kokoro-onnx soundfile
# modelo y voces: huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX  (onnx/model.onnx, voices/em_alex.bin)
# las voces .bin se juntan en un voices.npz: np.fromfile(..., float32).reshape(-1, 1, 256)
cd projects/gta6-shorts && npm ci
```

- Red: el entorno personal **"Video toolkit (voces gratis)"** permite huggingface.co y sus CDN. Si una descarga de
  Hugging Face falla por `cas-server.xethub.hf.co`, usar `HF_HUB_DISABLE_XET=1`.
- Render: `npx remotion render <ID> out/x.mp4 --browser-executable=/opt/pw-browsers/chromium`, luego
  `uv run tools/qc.py --render out/x.mp4 --fix` desde la raíz (deja el volumen en -14 LUFS).
- Composiciones en `src/Root.tsx`: `GTA1`, `GTA2`, `GTA3`, `R1`, `Avatar`, `Banner`, `BannerCheck`, `Watermark`, `PoseTest`.
- Voz de una frase nueva: `scripts/voice_kokoro.py` (guiones en `scripts/videos.json`) o `scripts/voice_rework.py`
  (líneas dentro del script, con los tiempos de palabras incluidos); después `scripts/realign.py` si hace falta.
- Transcribir un video (para revisar uno ajeno): faster-whisper `small` con `HF_HUB_DISABLE_XET=1`, pasando el audio
  como arreglo de numpy (la lectura directa del archivo falla con la versión instalada de PyAV).

## Avisos conocidos

- `qc.py` dice "no hay corte en los primeros 12 s" en casi todos: es falso, hay un corte por frase pero con el mismo fondo.
- Piper no da tiempos por palabra; Kokoro tampoco. Los tiempos salen de pausas + peso de cada palabra.
- GitHub: la app de Claude tuvo que **instalarse** en el repositorio (no basta con autorizarla). Ya funciona.

## Pendientes

- [ ] Crear el canal Leonida al Día en YouTube y subir foto, banner, descripción; palabras clave y marca de agua
      desde YouTube Studio en el navegador.
- [ ] Publicar los Shorts en el orden de arriba. Si el @ no quedó @LeonidaAlDia, cambiarlo en las descripciones.
- [ ] Que el usuario escuche los videos y diga si alguna frase suena rara.
- [ ] Próximos Reels de GTA 6: el usuario mandará clips (propios o con permiso). Temas buscados y aún sin comprobar:
      trucos y códigos, dinero rápido, consejos para empezar, mapa de Leonida, Lucia y Jason.
- [ ] Opcional: voz más humana con ElevenLabs (plan gratis sin uso comercial).
