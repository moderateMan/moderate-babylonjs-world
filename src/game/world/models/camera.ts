import { FreeCamera, Scene, Vector3 } from "babylonjs";
import type { GameOption } from "../../core/gameLogic";

export class GameCamera {
  private readonly option: GameOption;
  private readonly scene: Scene;
  private readonly vector: Vector3;
  private readonly camera: FreeCamera;
  readonly speed: number = 0.02;
  private rate: number = 10;
  private moveValue: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private maxJumpY: number = 0.25;
  private eachJumpY: number = 0.025;
  private eachFallY: number = 0.0075;
  private isJumpStart: boolean = false;
  private isJumpFall: boolean = false;

  constructor(scene: Scene, canvas: HTMLCanvasElement, option: GameOption) {
    this.option = option;
    this.scene = scene;
    this.vector = new Vector3(
      this.option.start.x,
      this.option.start.y,
      this.option.start.z
    );
    this.camera = new FreeCamera("Camera", this.vector, this.scene);
    this.camera.minZ = 0.1;
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(canvas, true);
  }

  public render(): void {
    if (this.isJumpStart) {
      if (
        this.moveValue.y + this.eachJumpY < this.maxJumpY &&
        !this.isJumpFall
      ) {
        // 跳跃开始，上升
        if (this.moveValue.y < 0) {
          this.moveValue.y = 0;
        }
        this.moveValue.y += this.eachJumpY;
      } else {
        // 跳跃结束，开始下落
        // this.isJumpFall = true;
      }
    }
    this.camera.cameraDirection.copyFromFloats(
      this.moveValue.x,
      this.isJumpStart ? this.moveValue.y : 0.05,
      this.moveValue.z
    );
    this.moveValue.x = 0;
    this.moveValue.z = 0;
    if (this.isJumpFall) {
      if (this.moveValue.y > -this.maxJumpY) {
        // 跳跃过程中不断下落
        this.moveValue.y -= this.eachFallY;
      } else {
        // 下落结束，可以开始下一次跳跃
        this.isJumpFall = false;
        this.isJumpStart = false;
      }
    }
  }

  public moveFront(): void {
    let angle = this.getAngle();
    let move = 0.01 * this.rate;
    let xa = move * Math.cos(angle);
    let za = move * Math.cos(Math.PI / 2 - angle);
    let newDate = this.inBoundsXZ(-xa, za);
    this.moveValue.x += newDate.x;
    this.moveValue.z += newDate.z;
  }

  public moveBack(): void {
    let angle = this.getAngle();
    let move = 0.01 * this.rate;
    let xa = move * Math.cos(angle);
    let za = move * Math.cos(Math.PI / 2 - angle);
    let newDate = this.inBoundsXZ(xa, -za);
    this.moveValue.x += newDate.x;
    this.moveValue.z += newDate.z;
  }

  public moveLeft(): void {
    let angle = this.getAngle();
    let move = 0.01 * this.rate;
    let xa = move * Math.cos(Math.PI / 2 - angle);
    let za = move * Math.cos(angle);
    let newDate = this.inBoundsXZ(-xa, -za);
    this.moveValue.x += newDate.x;
    this.moveValue.z += newDate.z;
  }

  public moveRight(): void {
    let angle = this.getAngle();
    let move = 0.01 * this.rate;
    let xa = move * Math.cos(Math.PI / 2 - angle);
    let za = move * Math.cos(angle);
    let newDate = this.inBoundsXZ(xa, za);
    this.moveValue.x += newDate.x;
    this.moveValue.z += newDate.z;
  }

  public moveUp(): void {
    this.isJumpStart = true;
  }

  public moveDown(): void {
    this.moveValue.y -= 0.1;
  }

  public getCurrentPosition(): { x: number; y: number; z: number } {
    return {
      x: Math.floor(this.vector.x),
      y: Math.floor(this.vector.y),
      z: Math.floor(this.vector.z),
    };
  }

  private getAngle(): number {
    return this.camera.rotation.y + Math.PI / 2;
  }

  private inBoundsXZ(x: number, z: number): { x: number; z: number } {
    let x0 = x,
      z0 = z;
    if (x < 0) {
      if (this.vector.x + x < this.option.bounds.topLeft.x) {
        x0 = 0;
      }
    } else {
      if (this.vector.x + x > this.option.bounds.bottomRight.x) {
        x0 = 0;
      }
    }
    if (z < 0) {
      if (this.vector.z + z < this.option.bounds.topLeft.z) {
        z0 = 0;
      }
    } else {
      if (this.vector.z + z > this.option.bounds.bottomRight.z) {
        z0 = 0;
      }
    }
    return { x: x0, z: z0 };
  }
}
