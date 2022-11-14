import { Color3, HemisphericLight, Scene, Vector3 } from "babylonjs";

export class Light {

	private readonly scene: Scene;
	private readonly light: HemisphericLight;

	constructor(scene: Scene) {
		this.scene = scene;
		this.light = new HemisphericLight("Light", new Vector3(0, 1, 0), this.scene);
		this.light.intensity = 1;
		this.light.specular = new Color3(0, 0, 0);
	}

}
