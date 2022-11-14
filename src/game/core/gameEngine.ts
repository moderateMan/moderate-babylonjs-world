import { Engine, WebGPUEngine } from "babylonjs";
import { GameWindow } from "./gameWindow";
import type {GameLogic} from './gameLogic'

export class GameEngine {

	private readonly container: HTMLDivElement;
	private readonly canvas: HTMLCanvasElement;
	private readonly logic: GameLogic;
	private readonly engine: Engine;
	private readonly window: GameWindow;

	private loopFunc?: () => void;

	constructor(
		container: HTMLDivElement,
		touchButtons: Array<HTMLDivElement>,
		gameLogic: GameLogic
	) {
		this.container = container;
		this.canvas = document.createElement('canvas');
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.container.appendChild(this.canvas);
		this.logic = gameLogic;

		this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
		this.window = new GameWindow(this.container, touchButtons, this.engine);
		this.init();
		this.loop();

		// this.engine = new WebGPUEngine(this.canvas, {});
		// this.window = new GameWindow(this.container, this.engine);
		// this.engine.initAsync().then((res) => {
		// 	this.window.addKeyListener();
		// 	this.window.addResizeListener();
		// 	this.init();
		// 	this.loop();
		// })
	}

	private init(): void {
		this.logic.create(this.engine, this.canvas);
	}

	private input(): void {
		this.logic.input(this.window);
	}

	private update(): void {
		this.logic.update();
	}

	private render(): void {
		this.logic.render();
	}

	private loop(): void {
		this.loopFunc = () => {
			this.input();
			this.update();
			this.render();
		}
		this.engine.runRenderLoop(this.loopFunc);
	}

	public destroy(): void {
		this.engine.stopRenderLoop(this.loopFunc);
		this.engine.dispose();
	}

	public getWindow(): GameWindow {
		return this.window;
	}

}
