import type { StandardMaterial } from "babylonjs";
import GrassMaterial from "@/game/world/models/materials/grassMaterial";

export class MaterialMgr {
  private readonly materials: {
    grass: StandardMaterial;
  };

  constructor(size: number) {
    this.materials = {
      grass: new GrassMaterial().material,
    };
  }

  public getGrassMaterial(): StandardMaterial {
    return this.materials.grass;
  }
}
