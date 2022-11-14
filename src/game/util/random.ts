/**
 * 像Math.seededRandom这种伪随机数生成器叫做线性同余生成器（LCG, Linear Congruential Generator)，几乎所有的运行库提供的rand都是采用的LCG，形如：
 * I n+1=aI n+c(mod m)
 * 生成的伪随机数序列最大周期m，范围在0到m-1之间。要达到这个最大周期，必须满足：
 * 1.c与m互质
 * 2.a - 1可以被m的所有质因数整除
 * 3.如果m是4的倍数，a - 1也必须是4的倍数
 * 以上三条被称为Hull-Dobell定理。作为一个伪随机数生成器，周期不够大是不好意思混的，所以这是要求之一。因此才有了：a=9301, c = 49297, m = 233280这组参数，以上三条全部满足。
 * */
export class Random {

	private seed: number;

	// 实例化一个随机数生成器，seed=随机数种子，默认当前时间
	constructor(seed?: number) {
		this.seed = (seed || Date.now()) % 999999999;
	}

	// 返回0~1之间的数
	next() {
		this.seed = (this.seed * 9301 + 49297) % 233280;
		return this.seed / 233280.0;
	}

	// 返回0~max之间的数
	nextInt(max: number) {
		return Math.floor(this.next() * max);
	}

}
