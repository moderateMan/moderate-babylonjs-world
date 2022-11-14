import { Mesh, MeshBuilder, Scene, StandardMaterial, Vector4 } from "babylonjs";

export abstract class AbstractBlock {

	protected readonly scene: Scene;
	protected readonly name: string;
	protected readonly box: Mesh;

	protected constructor(scene: Scene, name: string, option: {
		faceUV: Array<Vector4>,
		mat?: StandardMaterial,
		fromClone?: boolean,
		clonedBox?: Mesh,
	}) {
		this.scene = scene;
		this.name = name;
		if (option.fromClone && option.clonedBox) {
			this.box = option.clonedBox;
		} else {
			let options = {
				faceUV: option.faceUV,
				wrap: false,
			}
			this.box = MeshBuilder.CreateTiledBox(name, options, this.scene);
			this.box.checkCollisions = true;
			if (option.mat != null) {
				this.box.material = option.mat;
			}
		}
	}

	public setPosition(x: number, y: number, z: number): void {
		this.box.position.x = x;
		this.box.position.y = y;
		this.box.position.z = z;
	}

	public getBox(): Mesh {
		return this.box;
	}

}
