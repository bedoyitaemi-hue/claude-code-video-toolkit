# disciplina-short

Short vertical (1080x1920, 30 fps, 47,6 s): "Por qué la motivación no dura (y la disciplina sí)".
Estado: **terminado y aprobado**, pendiente de publicar. La memoria del canal (estilo, decisiones, pendientes)
está en `../CANAL-YOUTUBE.md`: léela antes de trabajar aquí.

## Con quién trabajas

Principiante total, desde el celular. Responder en español, simple y un paso a la vez. Mostrar el guion y esperar
aprobación antes de hacer el video. Solo herramientas gratis salvo que pida otra cosa.

## Archivos

| Archivo | Qué es |
|---|---|
| `scripts/guion.txt` | El guion, una línea por escena (8 escenas, 100 palabras) |
| `src/phrases.json` | Una entrada por frase: texto, audio, duración, pausa previa, tono y tiempos de cada palabra |
| `src/timeline.ts` | Arma la línea de tiempo desde la voz: cada frase espera su pausa y dura lo que dura su audio |
| `src/Stickman.tsx` | El muñequito: poses, caminar y correr, caras (`mood`), respiración, llama y ✓ |
| `src/Scenes.tsx` | Las 8 escenas (la 1 abre con el gancho en primer plano) y las marcas de sonido (`sfxCues`) |
| `src/Video.tsx` | Junta escenas, subtítulos karaoke, voz, efectos y música (que baja cuando habla la voz) |
| `public/audio/phrases/` | La voz, un WAV por frase |
| `public/audio/music.wav`, `public/sfx/` | Música y efectos, sintetizados |
| `out/disciplina-final-v3.mp4` | El video final (-14 LUFS) |

## Volver a generar

```bash
# desde la raíz del toolkit
python3 projects/disciplina-short/scripts/voice_tones.py     # voz (ajustar rutas de Piper dentro del script)
uv run python projects/disciplina-short/scripts/align.py      # tiempos de palabras
uv run python projects/disciplina-short/scripts/sfx.py 47.6   # efectos y música
uv run python projects/disciplina-short/scripts/puff.py       # sonido de la llama
cd projects/disciplina-short && npm ci
npx remotion render Disciplina out/disciplina.mp4 --browser-executable=/opt/pw-browsers/chromium
cd ../.. && uv run tools/qc.py --render projects/disciplina-short/out/disciplina.mp4 --fix
```

Los scripts apuntan a la carpeta temporal de la sesión en que se hicieron: cambia esas rutas. Piper:
`uv pip install piper-tts`; voz `es_ES-davefx-medium` desde huggingface.co, repositorio `rhasspy/piper-voices`.

## Avisos del control de calidad que se aceptaron

- La parte de arriba queda quieta en algunos tramos (la acción está más abajo).
- No detecta un corte en los primeros 12 s: el corte tras el gancho existe, pero las dos tomas tienen fondo blanco.
