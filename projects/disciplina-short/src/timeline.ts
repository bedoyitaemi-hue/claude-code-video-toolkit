import phrases from './phrases.json';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const LEAD_IN = 0.3;
const TAIL = 1.6;

export type Phrase = {scene: number; text: string; file: string; duration: number; gap: number; tone: string; start: number; end: number; words?: {w: string; s: number; e: number}[]};
export type Scene = {n: number; start: number; end: number; phrases: Phrase[]};

const f = (s: number) => Math.round(s * FPS);

// Anchored to the narration: each sentence waits its own pause (gap), then plays for its length.
// A scene cut sits in the middle of the pause before the scene's first sentence.
const build = () => {
	const scenes: Scene[] = [];
	let t = LEAD_IN;
	for (const p of phrases) {
		let scene = scenes.find((s) => s.n === p.scene);
		const cut = t + p.gap / 2;
		t += p.gap;
		if (!scene) {
			scene = {n: p.scene, start: scenes.length ? f(cut) : 0, end: 0, phrases: []};
			scenes.push(scene);
		}
		scene.phrases.push({...p, start: f(t), end: f(t + p.duration)});
		t += p.duration;
	}
	t += TAIL;
	scenes.forEach((s, i) => (s.end = i + 1 < scenes.length ? scenes[i + 1].start : f(t)));
	return {scenes, total: f(t)};
};

export const TIMELINE = build();
