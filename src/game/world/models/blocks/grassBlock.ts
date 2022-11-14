import { Mesh, Scene, Vector4 } from "babylonjs";
import type { MaterialMgr } from "../../manager/materialMgr";
import { AbstractBlock } from "./abstract/abstract-block";

export class GrassBlock extends AbstractBlock {

	private readonly materialLib: MaterialMgr;

	constructor(scene: Scene, materialLib: MaterialMgr, option?: {
		fromClone?: boolean,
		clonedBox?: Mesh,
	}) {
		let faceUV = [
			new Vector4(1 / 4, 0, 2 / 4, 1),
			new Vector4(1 / 4, 0, 2 / 4, 1),
			new Vector4(2 / 4, 0, 3 / 4, 1),
			new Vector4(2 / 4, 0, 3 / 4, 1),
			new Vector4(0, 0, 1 / 4, 1),
			new Vector4(3 / 4, 0, 1, 1),
		];
		super(scene, 'GrassBlock', {
			faceUV: faceUV,
			mat: materialLib.getGrassMaterial(),
			fromClone: option?.fromClone,
			clonedBox: option?.clonedBox,
		});
		this.materialLib = materialLib;
	}

	public clone(): GrassBlock {
		return new GrassBlock(this.scene, this.materialLib, { fromClone: true, clonedBox: this.box.clone() });
	}

}
