import { Engine, Scene, Vector3 } from "babylonjs";
import { KeyValue } from "@/game/core/gameWindow/interaction/keyboard";
import { GameCamera } from "../world/models/camera";
import { TouchValue } from "@/game/core/gameWindow/interaction/touchpad";
import { Mainland } from "@/game/world/models/mainland";
import type { GameWindow } from "./gameWindow";

export class GameLogic {
  private readonly option: GameOption;
  private scene?: Scene;
  private camera?: GameCamera;
  private mainland?: Mainland;

  constructor(option: GameOption) {
    if (option.visualField % 2 != 0) {
      option.visualField -= 1;
    }
    this.option = option;
  }

  public create(engine: Engine, canvas: HTMLCanvasElement): void {
    this.scene = new Scene(engine);
    this.scene.gravity = new Vector3(0, -0.1, 0);
    this.scene.collisionsEnabled = true;
    this.camera = new GameCamera(this.scene, canvas, this.option);
    this.mainland = new Mainland(
      this.option.seed,
      this.scene,
      this.camera,
      this.option
    );
  }

  public input(gameWindow: GameWindow): void {
    // 键盘事件
    if (gameWindow.isKeyPressed(KeyValue.W)) {
      this.camera?.moveFront();
    }
    if (gameWindow.isKeyPressed(KeyValue.A)) {
      this.camera?.moveLeft();
    }
    if (gameWindow.isKeyPressed(KeyValue.S)) {
      this.camera?.moveBack();
    }
    if (gameWindow.isKeyPressed(KeyValue.D)) {
      this.camera?.moveRight();
    }
    if (gameWindow.isKeyPressed(KeyValue.SPACE)) {
      this.camera?.moveUp();
    }
    if (gameWindow.isKeyPressed(KeyValue.SPACE)) {
      this.camera?.moveUp();
    } else {
      this.camera?.moveDown();
    }
    if (gameWindow.isKeyPressed(KeyValue.SHIFT_LEFT)) {
      this.camera?.moveDown();
    }
    // 触控事件
    if (gameWindow.isPadTouched(TouchValue.MOVE_FRONT)) {
      this.camera?.moveFront();
    }
    if (gameWindow.isPadTouched(TouchValue.MOVE_LEFT)) {
      this.camera?.moveLeft();
    }
    if (gameWindow.isPadTouched(TouchValue.MOVE_BACK)) {
      this.camera?.moveBack();
    }
    if (gameWindow.isPadTouched(TouchValue.MOVE_RIGHT)) {
      this.camera?.moveRight();
    }
    if (gameWindow.isPadTouched(TouchValue.MOVE_UP)) {
      this.camera?.moveUp();
    }
    if (gameWindow.isPadTouched(TouchValue.MOVE_DOWN)) {
      this.camera?.moveDown();
    }
  }

  public update(): void {
    if (this.mainland) {
      this.mainland.update();
    }
  }

  public render(): void {
    if (this.camera) {
      this.camera.render();
    }
    if (this.mainland) {
      this.mainland.render();
    }
    if (this.scene && this.scene.activeCamera) {
      this.scene.render();
    }
  }
}

export type GameOption = {
  seed: number;
  start: { x: number; y: number; z: number };
  bounds: {
    topLeft: {
      x: number;
      z: number;
    };
    bottomRight: {
      x: number;
      z: number;
    };
  };
  visualField: number;
  frameUpdateBlock: number;
};
