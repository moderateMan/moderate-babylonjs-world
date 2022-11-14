import { PerlinNoiseGenerator } from "@/game/util/perlinNoiseGenerator";
import { MaterialMgr } from "@/game/world/manager/materialMgr";
import { BlockMgr } from "@/game/world/manager/blockMgr";
import isPointInCircle from "@/game/util/isPointInCircle";
import { Light } from "./light";
import { Sky } from "./sky";
import type { GameCamera } from "./camera";
import type { AbstractBlock } from "./blocks/abstract/abstract-block";
import type { Scene, MeshBuilder, Color3 } from "babylonjs";
import type { GameOption } from "@/game/core/gameLogic";

export class Mainland {
  // 参数
  private readonly option: GameOption;
  private readonly visualField: number;
  private readonly frameUpdateBlock: number;
  private readonly groundArrayLength: number;
  private readonly terrainPerlinNoise1: PerlinNoiseGenerator;
  private readonly terrainPerlinNoise2: PerlinNoiseGenerator;
  // 实例
  private readonly scene: Scene;
  private readonly camera: GameCamera;
  private readonly materialLib: MaterialMgr;
  private readonly blockLib: BlockMgr;
  private readonly light: Light;
  private readonly sky: Sky;
  // 存储
  private lastPosition: { x: number; y: number; z: number };
  private groundBlocksData: Array<
    Array<{
      x: number;
      y: number;
      z: number;
      show: boolean;
      blocks: Array<AbstractBlock>;
    }>
  > = [];
  private removeBlocks: Array<Array<AbstractBlock>> = [];

  constructor(
    seed: number,
    scene: Scene,
    camera: GameCamera,
    option: GameOption
  ) {
    this.option = option;
    this.visualField = this.option.visualField;
    this.frameUpdateBlock = this.option.frameUpdateBlock;
    this.groundArrayLength = this.visualField * 2 + 1;
    this.scene = scene;
    this.camera = camera;
    this.lastPosition = camera.getCurrentPosition();
    this.materialLib = new MaterialMgr(64);
    this.blockLib = new BlockMgr(this.scene, this.materialLib);
    this.terrainPerlinNoise1 = new PerlinNoiseGenerator(seed, {
      octaves: 4,
      persistence: 0.5,
      lacunarity: 2,
    });
    this.terrainPerlinNoise2 = new PerlinNoiseGenerator(seed, {
      octaves: 2,
      persistence: 0.9,
      lacunarity: 2,
    });

    this.light = new Light(this.scene);
    this.sky = new Sky(this.scene, this.option);

    // this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    // this.scene.fogColor = new BABYLON.Color3(0.7, 0.7, 0.8);
    // this.scene.fogDensity = 0.025;
    this.initGroundBlocks();
  }

  public update(): void {
    let position = this.camera.getCurrentPosition();
    if (
      position.x != this.lastPosition.x ||
      position.y != this.lastPosition.y ||
      position.z != this.lastPosition.z
    ) {
      this.lastPosition = position;
      this.move();
    }
  }

  public render(): void {
    for (let i = 0; i < this.removeBlocks.length; i++) {
      this.blockLib.destroyBlocks(this.removeBlocks[i]);
    }
    this.removeBlocks = [];
    let drawCount = 0;
    for (let i = 0; i < this.groundArrayLength; i++) {
      for (let j = 0; j < this.groundArrayLength; j++) {
        let each = this.groundBlocksData[i][j];
        if (each.show) {
          if (drawCount < this.frameUpdateBlock && each.blocks.length == 0) {
            let grassBlock = this.blockLib.getGrassBlock().clone();
            grassBlock.setPosition(each.x, each.y, each.z);
            this.groundBlocksData[i][j].blocks = [grassBlock];
            drawCount += 1;
          }
        } else {
          this.blockLib.destroyBlocks(each.blocks);
          this.groundBlocksData[i][j].blocks = [];
        }
      }
    }
  }

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

  private move(): void {
    let position = this.camera.getCurrentPosition();
    let bottomRight =
      this.groundBlocksData[this.groundArrayLength - 1][
        this.groundArrayLength - 1
      ];
    // 右下为正，左上为负
    let x = position.x + this.visualField - bottomRight.x;
    let z = position.z + this.visualField - bottomRight.z;
    while (true) {
      let moveX = 0;
      if (x > 0) {
        moveX = 1;
        x -= 1;
      }
      if (x < 0) {
        moveX = -1;
        x += 1;
      }
      let moveZ = 0;
      if (z > 0) {
        moveZ = 1;
        z -= 1;
      }
      if (z < 0) {
        moveZ = -1;
        z += 1;
      }
      this.updateBlocksDataByMove(moveX, moveZ);
      if (x == 0 && z == 0) {
        break;
      }
    }
    this.updateShow();
  }

  private updateBlocksDataByMove(moveX: number, moveZ: number): void {
    if (Math.abs(moveX) > 1 || Math.abs(moveZ) > 1) {
      throw "updateBlocksDataByMove only allow move value = 1";
    }
    this.deleteBlocksDataByMove(moveX, moveZ);
    this.addBlocksDataByMove(moveX, moveZ);
  }

  private deleteBlocksDataByMove(moveX: number, moveZ: number): void {
    // 删除X轴数组
    let deleteData = [];
    if (moveX < 0) {
      // W，删除末尾数据
      deleteData.push(...this.groundBlocksData[this.groundArrayLength - 1]);
      this.groundBlocksData.pop();
    }
    if (moveX > 0) {
      // S，删除开头数据
      deleteData.push(...this.groundBlocksData[0]);
      this.groundBlocksData.shift();
    }
    // 删除Z轴数组
    if (moveZ < 0) {
      // A，删除末尾数据
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        deleteData.push(this.groundBlocksData[i][this.groundArrayLength - 1]);
        this.groundBlocksData[i].pop();
      }
    }
    if (moveZ > 0) {
      // D，删除开头数据
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        deleteData.push(this.groundBlocksData[i][0]);
        this.groundBlocksData[i].shift();
      }
    }
    for (let i = 0; i < deleteData.length; i++) {
      this.removeBlocks.push(deleteData[i].blocks);
    }
  }

  private addBlocksDataByMove(moveX: number, moveZ: number): void {
    // 添加Z轴数组
    if (moveZ < 0) {
      // A，添加开头数据
      let x0 = this.groundBlocksData[0][0].x;
      let z0 = this.groundBlocksData[0][0].z;
      let newData = [];
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        let x = x0 + i;
        let z = z0 - 1;
        let y = this.getHeight(x, z);
        newData.push({ x: x, y: y, z: z, show: false, blocks: [] });
      }
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        this.groundBlocksData[i].unshift(newData[i]);
      }
    }
    if (moveZ > 0) {
      // D，添加末尾数据
      let x0 =
        this.groundBlocksData[0][this.groundArrayLength - 1 - Math.abs(moveZ)]
          .x;
      let z0 =
        this.groundBlocksData[0][this.groundArrayLength - 1 - Math.abs(moveZ)]
          .z;
      let newData = [];
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        let x = x0 + i;
        let z = z0 + 1;
        let y = this.getHeight(x, z);
        newData.push({ x: x, y: y, z: z, show: false, blocks: [] });
      }
      for (let i = 0; i < this.groundArrayLength - Math.abs(moveX); i++) {
        this.groundBlocksData[i].push(newData[i]);
      }
    }
    // 添加X轴数组
    if (moveX < 0) {
      // W，添加开头数据
      let x0 = this.groundBlocksData[0][0].x;
      let z0 = this.groundBlocksData[0][0].z;
      let newData = [];
      for (let i = 0; i < this.groundArrayLength; i++) {
        let x = x0 - 1;
        let z = z0 + i;
        let y = this.getHeight(x, z);
        newData.push({ x: x, y: y, z: z, show: false, blocks: [] });
      }
      this.groundBlocksData.unshift(newData);
    }
    if (moveX > 0) {
      // S，添加末尾数据
      let x0 =
        this.groundBlocksData[this.groundArrayLength - 1 - Math.abs(moveX)][0]
          .x;
      let z0 =
        this.groundBlocksData[this.groundArrayLength - 1 - Math.abs(moveX)][0]
          .z;
      let newData = [];
      for (let i = 0; i < this.groundArrayLength; i++) {
        let x = x0 + 1;
        let z = z0 + i;
        let y = this.getHeight(x, z);
        newData.push({ x: x, y: y, z: z, show: false, blocks: [] });
      }
      this.groundBlocksData.push(newData);
    }
  }

  private updateShow(): void {
    for (let i = 0; i < this.groundArrayLength; i++) {
      for (let j = 0; j < this.groundArrayLength; j++) {
        let isInCircle = isPointInCircle(
          { a: i, b: -j },
          { a: this.visualField, b: -this.visualField },
          this.visualField
        );
        this.groundBlocksData[i][j].show = isInCircle;
      }
    }
  }
}
