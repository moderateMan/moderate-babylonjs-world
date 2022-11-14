# 游戏设计
首先游戏设计讲起来是很复杂很繁琐的，由于篇幅有限，我用一个轻巧的方式，把游戏开发的整体思路给大家串一下，这样对阅读项目源码会很有帮助，源码我会在文章底部贴出。
## 架构设计
### 架构图


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9086570291a24cc5b3b08426d257dfde~tplv-k3u1fbpfcp-watermark.image?)

### 职能划分
面向对象的思路，单纯的前端开发来看，大部分都是UI开发，这些用面向过程的思路来做，往往就能应对大部分场景。但是在游戏开发中，不用面向对象我觉得是不可以的，那可太费劲了，所以整体都是面向对象的思路。

大体分三层：
- Vue显示层
- Core核心层
- World原料层

- 结构设计
engine核心对象
众多实例对象：
window相关管理对象
游戏实例对象
相机实例对象
### 项目结构

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6820ebeeafb04580b6e1bc828c30b857~tplv-k3u1fbpfcp-watermark.image?)
## 功能设计
### 创建地图，通过噪声算法

首先陆地的组成单位，就是上面我们创建好的**草地区块**`grassBlock`，我们需要通过一个个`grassBlock`拼出来我们的地图。

而噪声算法就是常见的用来生成地图的，直接拿来用，这里我简单说说为什么用噪声算法？

`因为，我们需要一个办法，一个可以生成一个随机种子，往后通过这个种子就能生成固定的数据，并且具备连续性，数据是平滑的。`

**噪声算法算法就具备如下特点：**
- 随机性：创建的地图是随机的。
- 可哈希：简单说作用，就是地图我们都是渲染我们视野范围内的，我们要保证离开视野之后，返回地图还是跟之前一致，不能再随机了。
- 平滑，连续：随机出来的数据具有一点的连续性，不突兀，这样我们的地形就很平滑。

**噪声算法代码如下：**
```js
class Random {

	private seed: number;

	// 实例化一个随机数生成器，seed=随机数种子，默认当前时间
	constructor(seed?: number) {
		this.seed = (seed || Date.now()) % 999999999;
	}

	// 返回0~1之间的数a
	next() {
		this.seed = (this.seed * 9301 + 49297) % 233280;
		return this.seed / 233280.0;
	}

	// 返回0~max之间的数
	nextInt(max: number) {
		return Math.floor(this.next() * max);
	}

}

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

```

那么借助了噪声算法，我们就能够创建一个函数，传入x，z坐标，就能获得高的函数。
```js
  private getHeight(x: number, y: number): number {
    let f = this.terrainPerlinNoise1.simplex2(x * 0.01, y * 0.01);
    let g = this.terrainPerlinNoise2.simplex2(-x * 0.01, -y * 0.01);
    let mh = g * 32;
    let h = f * mh;
    if (h <= 0) {
      h = 0;
    }
    return Math.floor(h);
  }

```

这样，我们只要遍历循环一个区域的x，z坐标传入这个函数获得y，就能获得一个区域内创建地图区块`grassBlock`的坐标数据了。

贴出
```ts
private initGroundBlocks(): void {
    let position = this.camera.getCurrentPosition();
    for (let i = 0; i < this.groundArrayLength; i++) {
      if (this.groundBlocksData[i] == null) {
        this.groundBlocksData[i] = [];
      }
      let a = 1;
      for (let j = 0; j < this.groundArrayLength; j++) {
        let x = position.x - this.visualField + i;
        let z = position.z - this.visualField + j;
        let y = this.getHeight(x, z);
        let isInCircle = isPointInCircle(
          { a: i, b: -j },
          { a: this.visualField, b: -this.visualField },
          this.visualField
        );
        let blocks = [];
        if (isInCircle) {
          let grassBlock = this.blockLib.getGrassBlock().clone();
          grassBlock.setPosition(x, y, z);
          blocks.push(grassBlock);
        }
        this.groundBlocksData[i][j] = {
          x: x,
          y: y,
          z: z,
          show: isInCircle,
          blocks: blocks,
        };
      }
    }
  }
```


### 只渲染视野范围内的
`既然创建地图的功能已经好了，我们就来制定渲染地图的规则`

- 首先我们肯定不能全部渲染出来，我们需要渲染一部分，那么是哪一部分呢？
    - 全部渲染出来，卡爆了

- 肯定是以摄像机这个第一视角为中心，以一个合适的视野距离画圆这个区域最为合理。
    - 这个视野距离就会作为半径画圆，目前设置的是36，很流程，扫出来的区域也够大

- 也就是根据摄像机的中心坐标，开始计算一个圆形区域的坐标集合
    - 这块就是简单的遍历一个圆内的坐标集合，间隔单位就是grassBlock的宽度默认为1

- 但是画圆有点难度，不如我们用一个取巧的方式，画一个方形，然后写个判定是否在圆内的工具函数来进行筛选，岂不是更容易。
    - 先画出一个方形，然后在用算法过滤，就这么简单


那么根据思路，我们一个圆形区域就画出来了
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13325bd92da54d089c09dd77286f5817~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="70%" />

### 镜头可以碰撞，移动，跳跃

镜头就是第一人称，就是我们游戏内容人物。

首先镜头不可以穿透模型，能够遇到地形就挺住，这就需要具备碰撞能力

镜头需要移动，那么我们就需要实现键盘或者触摸事件的监听，来响应操作

当操作开始的时候，我们就通过引擎的事件循环，来进行对摄像机的移动，或者跳跃的处理

跳跃不能一直跳，跳到天上去，所以我们需要加入重力，这样我们就可以让他具备了向下运动的基本特征。

那么根据思路，就实现了一个在地形上奔腾的场景了。

![ezgif.com-gif-maker (11).gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/430e035fbb644cfebf3bbafce85f17c8~tplv-k3u1fbpfcp-watermark.image?)


