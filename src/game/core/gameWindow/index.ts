import type { Engine } from "babylonjs";
import { Keyboard, type KeyType } from "./interaction/keyboard";
import { Touchpad, type TouchType } from "./interaction/touchpad";

declare var elementResizeDetectorMaker: any;

export class GameWindow {

	private readonly container: HTMLDivElement;
	private readonly engine: Engine;
	private readonly keyboard: Keyboard
	private readonly touchpad: Touchpad;

	constructor(
		container: HTMLDivElement,
		touchButtons: Array<HTMLDivElement>,
		engine: Engine
	) {
		this.container = container;
		this.engine = engine;
		this.keyboard = new Keyboard();
		this.touchpad = new Touchpad(touchButtons);
		this.addResizeListener();
	}

	public destroy(): void {
		this.keyboard.destroy();
		this.touchpad.destroy();
		this.removeResizeListener();
	}

	public addResizeListener(): void {
		elementResizeDetectorMaker().listenTo(this.container, (e: HTMLDivElement) => {
			setTimeout(() => {
				this.engine.resize();
			})
		});
	}

	public removeResizeListener(): void {
		elementResizeDetectorMaker().uninstall(this.container);
	}

	public isKeyPressed(code: KeyType): boolean {
		return this.keyboard.getKeyState(code);
	}

	public isPadTouched(code: TouchType): boolean {
		return this.touchpad.getTouchState(code);
	}

}
