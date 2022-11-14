import { Random } from "./random";

export class PerlinNoiseGenerator {

	private static readonly F2: number = 0.3660254037844386;
	private static readonly G2: number = 0.21132486540518713;
	private static readonly F3: number = 1.0 / 3.0;
	private static readonly G3: number = 1.0 / 6.0;
	private static readonly GRAD3: Array<Array<number>> = [
		[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
		[1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
		[0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
		[1, 0, -1], [-1, 0, -1], [0, -1, 1], [0, 1, 1]
	];
	private readonly PERM: Array<number> = [];
	private readonly octaves: number;
	private readonly persistence: number;
	private readonly lacunarity: number;

	constructor(
		seed: number,
		option: { octaves: number, persistence: number, lacunarity: number }
	) {
		this.octaves = option.octaves;
		this.persistence = option.persistence;
		this.lacunarity = option.lacunarity;
		let random = new Random(seed);
		for (let i = 0; i < 512; i++) {
			this.PERM.push(random.nextInt(256));
		}
	}

	private dot3(v1: Array<number>, v2: Array<number>): number {
		return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
	}

	private noise2(x: number, y: number): number {
		let i1, j1, I, J;
		let s = (x + y) * PerlinNoiseGenerator.F2;
		let i = Math.floor(x + s);
		let j = Math.floor(y + s);
		let t = (i + j) * PerlinNoiseGenerator.G2;
		let xx = [];
		let yy = [];
		let f = [];
		let noise = [0.0, 0.0, 0.0];
		let g = [];
		xx[0] = x - (i - t);
		yy[0] = y - (j - t);
		i1 = xx[0] > yy[0] ? 1 : 0;
		j1 = xx[0] <= yy[0] ? 1 : 0;
		xx[2] = xx[0] + PerlinNoiseGenerator.G2 * 2.0 - 1.0;
		yy[2] = yy[0] + PerlinNoiseGenerator.G2 * 2.0 - 1.0;
		xx[1] = xx[0] - i1 + PerlinNoiseGenerator.G2;
		yy[1] = yy[0] - j1 + PerlinNoiseGenerator.G2;
		I = i & 255;
		J = j & 255;
		g[0] = this.PERM[I + this.PERM[J]] % 12;
		g[1] = this.PERM[I + i1 + this.PERM[J + j1]] % 12;
		g[2] = this.PERM[I + 1 + this.PERM[J + 1]] % 12;
		for (let c = 0; c <= 2; c++) {
			f[c] = 0.5 - xx[c] * xx[c] - yy[c] * yy[c];
		}
		for (let c = 0; c <= 2; c++) {
			if (f[c] > 0) {
				noise[c] = f[c] * f[c] * f[c] * f[c] *
					(PerlinNoiseGenerator.GRAD3[g[c]][0] * xx[c] + PerlinNoiseGenerator.GRAD3[g[c]][1] * yy[c]);
			}
		}
		return (noise[0] + noise[1] + noise[2]) * 70.0;
	}

	private noise3(x: number, y: number, z: number): number {
		let c, o1, o2, g = [], I, J, K;
		let f = [], noise = [0.0, 0.0, 0.0, 0.0];
		let s = (x + y + z) * PerlinNoiseGenerator.F3;
		let i = Math.floor(x + s);
		let j = Math.floor(y + s);
		let k = Math.floor(z + s);
		let t = (i + j + k) * PerlinNoiseGenerator.G3;
		let pos: Array<Array<number>> = [[], [], [], []];
		pos[0][0] = x - (i - t);
		pos[0][1] = y - (j - t);
		pos[0][2] = z - (k - t);
		if (pos[0][0] >= pos[0][1]) {
			if (pos[0][1] >= pos[0][2]) {
				o1 = [1, 0, 0];
				o2 = [1, 1, 0];
			} else if (pos[0][0] >= pos[0][2]) {
				o1 = [1, 0, 0];
				o2 = [1, 0, 1];
			} else {
				o1 = [0, 0, 1];
				o2 = [1, 0, 1];
			}
		} else {
			if (pos[0][1] < pos[0][2]) {
				o1 = [0, 0, 1];
				o2 = [0, 1, 1];
			} else if (pos[0][0] < pos[0][2]) {
				o1 = [0, 1, 0];
				o2 = [0, 1, 1];
			} else {
				o1 = [0, 1, 0];
				o2 = [1, 1, 0];
			}
		}
		for (c = 0; c <= 2; c++) {
			pos[3][c] = pos[0][c] - 1.0 + 3.0 * PerlinNoiseGenerator.G3;
			pos[2][c] = pos[0][c] - o2[c] + 2.0 * PerlinNoiseGenerator.G3;
			pos[1][c] = pos[0][c] - o1[c] + PerlinNoiseGenerator.G3;
		}
		I = i & 255;
		J = j & 255;
		K = k & 255;
		g[0] = this.PERM[I + this.PERM[J + this.PERM[K]]] % 12;
		g[1] = this.PERM[I + o1[0] + this.PERM[J + o1[1] + this.PERM[o1[2] + K]]] % 12;
		g[2] = this.PERM[I + o2[0] + this.PERM[J + o2[1] + this.PERM[o2[2] + K]]] % 12;
		g[3] = this.PERM[I + 1 + this.PERM[J + 1 + this.PERM[K + 1]]] % 12;
		for (c = 0; c <= 3; c++) {
			f[c] = 0.6 - pos[c][0] * pos[c][0] - pos[c][1] * pos[c][1] -
				pos[c][2] * pos[c][2];
		}
		for (c = 0; c <= 3; c++) {
			if (f[c] > 0) {
				noise[c] = f[c] * f[c] * f[c] * f[c] * this.dot3(pos[c], PerlinNoiseGenerator.GRAD3[g[c]]);
			}
		}
		return (noise[0] + noise[1] + noise[2] + noise[3]) * 32.0;
	}

	public simplex2(x: number, y: number): number {
		let freq = 1.0;
		let amp = 1.0;
		let max = 1.0;
		let total = this.noise2(x, y);
		for (let i = 1; i < this.octaves; i++) {
			freq *= this.lacunarity;
			amp *= this.persistence;
			max += amp;
			total += this.noise2(x * freq, y * freq) * amp;
		}
		return (1 + total / max) / 2;
	}

	public simplex3(x: number, y: number, z: number): number {
		let freq = 1.0;
		let amp = 1.0;
		let max = 1.0;
		let total = this.noise3(x, y, z);
		for (let i = 1; i < this.octaves; ++i) {
			freq *= this.lacunarity;
			amp *= this.persistence;
			max += amp;
			total += this.noise3(x * freq, y * freq, z * freq) * amp;
		}
		return (1 + total / max) / 2;
	}

}
