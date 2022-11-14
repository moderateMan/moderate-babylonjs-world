import { Animation, Mesh, MeshBuilder, Scene } from "babylonjs";
import { SkyMaterial } from 'babylonjs-materials';
import type { GameOption } from "@/game/core/gameLogic";

export class Sky {

	private readonly option: GameOption;
	private readonly scene: Scene;
	private readonly skyBox: Mesh;

	constructor(scene: Scene, option: GameOption) {
		this.option = option;
		this.scene = scene;
		// Sky material
		let skyboxMaterial = new SkyMaterial('skyMaterial', this.scene);
		skyboxMaterial.backFaceCulling = false;
		//skyboxMaterial._cachedDefines.FOG = true;
		// Sky mesh (box)
		let width = this.option.bounds.bottomRight.x - this.option.bounds.topLeft.x + this.option.visualField * 2;
		let height = this.option.bounds.bottomRight.z - this.option.bounds.topLeft.z + this.option.visualField * 2;
		this.skyBox = MeshBuilder.CreateBox('skyBox', {
			width: width,
			height: height,
			depth: 1000
		}, this.scene);
		this.skyBox.material = skyboxMaterial;
		this.skyBox.position.x = this.option.start.x;
		this.skyBox.position.y = -10;
		this.skyBox.position.z = this.option.start.z;
		this.setSkyConfig('material.inclination', skyboxMaterial.inclination, 0);
		/**
		 * - 1: Day
		 * - 2: Evening
		 * - 3: Increase Luminance
		 * - 4: Decrease Luminance
		 * - 5: Increase Turbidity
		 * - 6: Decrease Turbidity
		 * - 7: Move horizon to -50
		 * - 8: Restore horizon to 0
		 * */
		// this.setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
		// this.setSkyConfig("material.inclination", skyboxMaterial.inclination, -0.5);
		// this.setSkyConfig("material.luminance", skyboxMaterial.luminance, 0.1);
		// this.setSkyConfig("material.luminance", skyboxMaterial.luminance, 1.0);
		// this.setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 40);
		// this.setSkyConfig("material.turbidity", skyboxMaterial.turbidity, 5);
		// this.setSkyConfig("material.cameraOffset.y", skyboxMaterial.cameraOffset.y, 50);
		// this.setSkyConfig("material.cameraOffset.y", skyboxMaterial.cameraOffset.y, 0);
	}

	private setSkyConfig(property: string, from: number, to: number) {
		let keys = [
			{ frame: 0, value: from },
			{ frame: 100, value: to }
		];
		let animation = new Animation('skyAnimation', property, 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		animation.setKeys(keys);
		this.scene.stopAnimation(this.skyBox);
		this.scene.beginDirectAnimation(this.skyBox, [animation], 0, 100, false, 1);
	};

}
