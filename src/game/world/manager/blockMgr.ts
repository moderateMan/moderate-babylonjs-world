import { GrassBlock } from "../models/blocks/grassBlock";
import type { MaterialMgr } from "./materialMgr";
import type { AbstractBlock } from "@/game/world/models/blocks/abstract/abstract-block";
import type { Scene } from "babylonjs";

export class BlockMgr {
  private readonly scene: Scene;
  private readonly materialLib: MaterialMgr;
  private readonly blocks: {
    grass: GrassBlock;
  };

  constructor(scene: Scene, materialLib: MaterialMgr) {
    this.scene = scene;
    this.materialLib = materialLib;
    this.blocks = {
      grass: new GrassBlock(this.scene, this.materialLib),
    };
  }

  public getGrassBlock(): GrassBlock {
    return this.blocks.grass;
  }

  public destroyBlock(block: AbstractBlock): void {
    this.removeBlock(block);
    block.getBox().dispose();
  }

  public destroyBlocks(blocks: Array<AbstractBlock>): void {
    if (blocks.length == 0) {
      return;
    }
    for (let i = 0; i < blocks.length; i++) {
      this.destroyBlock(blocks[i]);
    }
  }

  public removeBlock(block: AbstractBlock): void {
    let box = block.getBox();
    this.scene.removeMesh(box);
  }

  public removeBlocks(blocks: Array<AbstractBlock>): void {
    if (blocks.length == 0) {
      return;
    }
    for (let i = 0; i < blocks.length; i++) {
      this.removeBlock(blocks[i]);
    }
  }
}
