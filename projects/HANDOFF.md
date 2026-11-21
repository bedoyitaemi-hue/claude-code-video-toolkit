# Handoff: canales de YouTube (disciplina y Leonida al Día)

Para quien retome este trabajo en una sesión nueva. Estado al 21 de noviembre de 2026. Todo está en la rama
`claude/new-session-it7zxs` del repositorio `bedoyitaemi-hue/claude-code-video-toolkit` (incluye todo lo de la rama
anterior `claude/youtube-kit-mobile-setup-bu3g84`).

## Con quién trabajas

- Principiante total, trabaja desde el **celular**. Responder **siempre en español** (lo pidió varias veces: ni una
  frase en inglés, tampoco en los avisos de avance), simple y **un paso a la vez**.
- **Mostrar el guion y esperar aprobación** antes de hacer un video. Cambios de texto (ganchos nuevos, frases) también.
- **Solo herramientas gratis.** Rechazó pagar Ideogram y no quiso crear cuenta de Hugging Face para FLUX. No volver a
  ofrecer opciones de pago o con cuenta salvo que lo pida.
- Revisa todo con su oído y su ojo. Si dice "no me gusta", preguntar qué quiere con opciones concretas en vez de adivinar
  (con las miniaturas se hicieron 5 versiones antes de preguntar).
- Mandar siempre los archivos finales con SendUserFile y recordarle descargarlos.

## Reglas que no se negocian

- **Nada de logos, arte ni la palabra "oficial" de GTA o Rockstar.** El canal de GTA es de fans y lo dice en cada descripción.
- **Material de Rockstar**: solo sin fines comerciales, sin spoilers ni filtraciones, siempre con voz y overlays propios.
- **Clips de otros creadores**: solo con permiso o pocos segundos con crédito. **No descargar gameplays de YouTube.**
- **Datos**: solo los que aparecen en varias fuentes. Finanzas: sin porcentajes inventados ni promesas; las
  descripciones dicen "Este video es educativo y no es asesoría financiera".
- Todo texto público pasa por `uv run tools/copy_lint.py` (sin guiones largos ni frases de relleno).
- **El stickman del canal de disciplina no lleva gorra** (lo pidió). Personajes con nombre (Pedro) se identifican con
  una etiqueta en pantalla, no con accesorios.

## Canal 1: disciplina

### Tanda 1 (`projects/disciplina-short/`)
- Short "Por qué la motivación no dura (y la disciplina sí)", `out/disciplina-final-v3.mp4` (voz Piper, versión vieja).

### Tanda 2 (`projects/disciplina-tanda2/`): terminada, falta publicar
- **Video largo** 16:9, `out/LARGO-final.mp4` (3 min 26 s): "Ganas más y sigues sin dinero: la trampa que nadie te
  explica". Inflación del estilo de vida, ley de Parkinson (1955), adaptación hedónica y 3 reglas (págate primero, sube
  el ahorro antes que el gasto, espera 24 horas o una semana antes de comprar). Historia de Pedro.
- **Short 1** `out/S1-final.mp4` (48 s): "Nunca falles dos veces".
- **Short 2** `out/S2-final.mp4` (42 s): "El gasto que no ves" (gasto hormiga, 3 al día, 90 al mes, 1.095 al año).
- **Miniatura elegida**: `out/miniatura.png` = la amarilla "¿Y MI PLATA?" (`ThumbA`). Las demás (`miniatura-B` a `-E`)
  quedaron descartadas.
- Títulos, descripciones y capítulos: `PUBLICAR.md`. Guiones originales: `GUIONES.md`; texto actual: `scripts/lines.json`.
- Orden sugerido: largo, a los 2 días Short 1, a los 2 días Short 2; 7 p. m. hora de Colombia. Fijar en los Shorts un
  comentario con el enlace del largo.

### Estilo (tanda 2)
- Stickman negro (azul = cuando actúa con disciplina) sobre blanco, gris `#ECECEE`, azul claro `#E4ECFA` o verde claro
  `#E3F2E7`; un fondo por acto. Azul `#2D6CDF` disciplina, verde dinero que se guarda, rojo gasto, dorado tentación.
- Ganchos: gancho fuerte en la primera frase, pregunta abierta en pantalla ("¿A DÓNDE SE FUE?") hasta la respuesta,
  ganchos de reenganche antes de cada bloque y una vuelta al inicio al final. Los planos de gancho llevan zoom, sacudida
  y sonido de subida (`src/hooks.tsx`).
- Video largo: etiqueta de capítulo arriba a la izquierda y barra de avance arriba (`largoOverlay` en `src/largo.tsx`).
- Música lo-fi original y efectos sintetizados (`scripts/sfx_extra.py`), nada descargado.

## Canal 2: Leonida al Día, GTA 6 (`projects/gta6-shorts/`)

- Sin cambios en esta sesión. 4 Shorts terminados en `out/` (`GTA6-short-1/2/3.mp4`, `GTA6-curiosidades-v2.mp4`),
  textos en `PUBLICAR.md`, kit del canal en `canal/`. Detalle en `canal/RESUMEN-SESION.md`.

## Cómo rehacer el entorno (se pierde con cada sesión)

- Entorno de nube: **"Video toolkit voces"** (personal). Permite huggingface.co y sus CDN, `image.pollinations.ai` y
  `black-forest-labs-flux-1-schnell.hf.space`. El viejo "Video toolkit (voces gratis)" no se puede elegir desde una
  sesión por los paréntesis del nombre.
- Kokoro (voz `em_alex`), en la carpeta temporal:
  ```bash
  uv venv kokoro/.venv && uv pip install --python kokoro/.venv/bin/python kokoro-onnx soundfile huggingface_hub faster-whisper scipy
  # modelo y voces: onnx-community/Kokoro-82M-v1.0-ONNX (onnx/model.onnx, voices/em_alex.bin) con HF_HUB_DISABLE_XET=1
  # las voces .bin se juntan en voices.npz: np.fromfile(..., float32).reshape(-1, 1, 256)
  ```
- Remotion: `projects/disciplina-tanda2/node_modules` es un enlace a `../gta6-shorts/node_modules`; correr `npm ci` en
  `projects/gta6-shorts` primero.
- Voz: `kokoro/.venv/bin/python scripts/voice.py <kokoro_dir> . [LARGO S1 S2]` lee `scripts/lines.json`
  (`[texto, energía, texto_hablado_opcional]`) y escribe `src/<ID>.json` con tiempos por palabra.
- Revisar pronunciación: transcribir cada frase con faster-whisper `small` (audio como arreglo de numpy). Kokoro dice mal
  "No." solo ("Nos") y "mires" ("maires"); se cambiaron por "No, no." y "mires bien". "gasto hormiga" y "haz la cuenta"
  suenan bien aunque whisper los junte (la h es muda).
- Planos: `src/s1.tsx`, `src/s2.tsx`, `src/largo.tsx`; los ganchos se insertan en `src/Root.tsx` con `slice`. Si cambian
  las frases de `lines.json`, cuadrar los índices allí y en `CHAPTERS`/`OPEN_Q` de `largo.tsx`.
- Hoja de contacto para revisar: `scripts/sheet.sh <ID> <carpeta> <columnas> <escala>`.
- Render: `npx remotion render <ID> out/<ID>.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4`
  (la máquina tiene 4 núcleos; más falla), luego desde la raíz `uv run tools/qc.py --render <archivo> --fix` y renombrar
  el `.loudnorm.mp4` a `-final.mp4`. Miniaturas: `npx remotion still ThumbA out/miniatura.png ...`.

## Avisos conocidos

- `qc.py` dice "no hay corte en los primeros segundos" y "el movimiento se detiene en una zona": es falso o menor, hay un
  plano por frase y la cámara siempre se mueve.
- IA de imágenes gratis sin cuenta: Pollinations da imágenes borrosas con marca de agua (modelo "sana") y limita a una
  cada 45 s; FLUX en Hugging Face Spaces gasta su cupo anónimo en un par de intentos. No sirven para miniaturas.
- La carpeta `projects/` está en `.gitignore`: usar `git add -f`.

## Pendientes

- [ ] Publicar la tanda 2 de disciplina (largo + 2 Shorts) con la miniatura amarilla y `PUBLICAR.md`.
- [ ] Que el usuario escuche los videos y diga si alguna frase suena rara.
- [ ] Crear el canal Leonida al Día y publicar sus Shorts (ver `projects/gta6-shorts/PUBLICAR.md`).
- [ ] Próximos videos de disciplina y dinero: temas posibles sin usar todavía: regla de los 2 minutos, diseñar el
      entorno, fondo de emergencia, deudas pequeñas primero.
- [ ] Próximos Reels de GTA 6 con clips que mande el usuario (propios o con permiso).
