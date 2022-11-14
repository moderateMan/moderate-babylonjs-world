# 速通babylon基础功能
那么我们快速过一遍，基础的功能点。
## 创建场景
在游戏中，我们的内容都呈现在场景里，那么接下来，就介绍一下**场景的创建过程**
### 创建并获得canvas节点
**html**
```html
<body>
  <canvas id="renderCanvas"></canvas>
</body>
```
**JS**
```js
let canvas = document.getElementById("renderCanvas");
```
### 创建一个engine引擎
`有了canvas就能创建engine了`

**那么，引擎是什么？**
> 对WebGL，audio等底层api进行封装，整合出更简便易用的接口。

**代码实现**
```js
var createDefaultEngine = function () {
  return new BABYLON.Engine(
    canvas,
    true,
    {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    });
};
```
**参数简单介绍一下**
- 第一个参数：把上面的canvas节点传入即可
- 第二个参数：设置抗锯齿，默认是flase
- 第三个参数：就是一些设置项，我直接用的官网例子中的配置方案，够用了。

### 可以创建场景了
`有了engine，就能创建场景了`

**实例化一个场景**
```js
const scene = new BABYLON.Scene(window.engine);
```
**接下来为场景，加一个摄像机**

那么，摄像机是啥？

> 我们看到的游戏画面，都是通过摄像机拍出来的，没有摄像机，就是漆黑一片。

代码实现：
```js
this.vector = new Vector3(
  this.option.start.x,
  this.option.start.y,
  this.option.start.z
);
this.camera = new FreeCamera("Camera", this.vector, this.scene);
```
- **Camera**的类型有几种，这里我拿`FreeCamera`举例，因为我们做的游戏是第一人称，而这个`FreeCamera`非常适合。
- 参数有三个
    - 第一个是相机实例的名称。
    - 第二个是三维坐标。
    - 第三个是要添加摄像机的场景，也就是我们刚刚创建的场景。

**仅仅创建一个场景实例还不够，我们需要让engine引擎把scene渲染出来**
```js
window.engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
    }
  });
```
- runRenderLoop就是engine提供的渲染循环，传入一个渲染函数，那么引擎就会根据屏幕的刷新去回调这个函数（一秒会触发很多次这个函数，帧数越高，那么回调的次数就越多）。
- 传入的函数逻辑很简单：判断场景是否存在和场景中是否添加了摄像机，成立的话，就调用场景实例的`render`这个api。

## 创建一个盒模型，天空和光
`有了场景，就能在里面加入模型，天空和光了`

### 创建盒模型
```js
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
```
效果图：

[代码片段](https://code.juejin.cn/pen/7165452918270181384)
蛤？怎么是漆黑的呢，能不能开下灯

### 创建光源
上面看到的黑色，并不是模型默认的颜色，而是没有光的缘故，那么我们开下灯。

**代码实现：**
```js
const light = new BABYLON.HemisphericLight(
    "light", 
    new BABYLON.Vector3(0, 1, 0)
);
const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, -1, 0), scene);
  light1.intensity = 0.5;
```
- 为啥要创建两个光源，并且第二个光源设置了intensity
    - 因为光设置一个光源，会有一个面漆黑一片
    - 设置第二个光源目的是让这面不黑
    - 设置intensity目的是让底面看着暗一些，intensity表示强烈成都，0表示不发光，1表示最强光
- 参数概述
    - 第一个参数是灯光实例的名称
    - 第二个参数就是坐标

效果：
[代码片段](https://code.juejin.cn/pen/7165406393954992128)

### 创建蓝天
目前的环境背景是这样的，如图：

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/607558f7de674f68a4972966370dde79~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="70%" />

不好看，所以我们要做一个蓝天，来当背景。

**先创建天空盒子**

代码实现：
```js
this.skyBox = MeshBuilder.CreateBox(
    'skyBox', 
    {
        width: width,
        height: height,
        depth: 1000
    }, 
    this.scene
);
```

**给天空盒子加个材质，让他变成蓝天**

那么，什么是材质？
> 材质，可以简单理解为，模型的面料，样子，贴图。

                                   
代码实现：
```js
 let skyBox = BABYLON.MeshBuilder.CreateBox('SkyBox', {size:1000}, scene, false, BABYLON.Mesh.BACKSIDE);
  skyBox.material = new BABYLON.SkyMaterial('sky', scene);
  skyBox.material.inclination = -0.15;
  skyBox.material.backFaceCulling = false
```

- 使用`BABYLON.MeshBuilder.CreateBox`创建，
    - 第一个参数是模型的名字
    - 第二个是参数，其中仅仅设置可size为1000，代表着，width（宽），hight（高），depth（深）同时设置了1000
    - inclination表示太阳的日照，区间为[-0.5,0.5],
    - backFaceCulling这个叫剔除，你不设置false，看不到天空

效果：
[代码片段](https://code.juejin.cn/pen/7165457880454266891)

### 给盒模型添加材质


**盒模型一共6个面，那么首先我们需要知道面的编号**

效果如下：
[代码片段](https://code.juejin.cn/pen/7165449658444021774)

通过效果可知：
- 0 前
- 1 后
- 2 左
- 3 右
- 4 上
- 5 下

**那么这个编号对应的就是faceUV的索引**

faceUV就是配置六个面显示的数组

```js
let faceUV = [
        new Vector4(1 / 4, 0, 2 / 4, 1), // 0号面
        new Vector4(1 / 4, 0, 2 / 4, 1), // 1号面
        new Vector4(2 / 4, 0, 3 / 4, 1), // 2号面
        new Vector4(2 / 4, 0, 3 / 4, 1), // 3号面
        new Vector4(0, 0, 1 / 4, 1), // 4号面
        new Vector4(3 / 4, 0, 1, 1), // 5号面
];
```

**我们设置一下材质所用的贴图**

![grass_64.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cc2485aa67f46e6aaba06dc435109e9~tplv-k3u1fbpfcp-watermark.image?)

**一张贴图如何切分给各个面**
你需要了解**Vector4**，他的参数值是比例，参数都有：
- x
- y
- z
- w

em～～～，我其实也搞不懂，这个四维坐标是咋回事，但我将亲测出来的理解写下来，希望对你有用：
- x和z，横向来看，你可以理解x表示截取图片的开始，z表示结束
- y和w，纵向来看，你可以理解y是为截取图片的开始，w表示结束

那以 `new Vector4(1 / 4, 0, 2 / 4, 1)`这个为例，表示计算出截取图片的部分是：
- 横向从`1/4`的位置到`2 / 4`
   
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac13674e66cb479695ac491ff5ac8e4d~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="70%" />

- 纵向从0也就是图片的最下方。到1，也就是最高点

    
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a25bd8c79c4d209caf043186605881~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="70%" />

经过测试，和我的猜想是一致的。

效果：
[代码片段](https://code.juejin.cn/pen/7165083410501730334)


那么这个盒子就会作为接下来游戏开发中必不可少的角色，实现陆地的基本单元，命名为**草地区块**`grassBlock`

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


