import { StandardMaterial, Texture } from "babylonjs";
import grass_64 from "@/assets/images/grass_64.png";

export default class GrassMaterial {
  readonly material: StandardMaterial;
  constructor() {
    // 草方块材质
    let grassMaterial = new StandardMaterial("GrassMaterial");
    let grassTexture = new Texture(grass_64);
    grassMaterial.diffuseTexture = grassTexture;
    this.material = grassMaterial;
  }
}
