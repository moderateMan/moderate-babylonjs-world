export class Touchpad {

	private readonly touchButtons: Array<HTMLDivElement>;
	private readonly PAD_TOUCHED = {
		'move-front': false, 'move-back': false, 'move-left': false, 'move-right': false,
		'move-up': false, 'move-down': false,
	}

	private touchstart = (e: TouchEvent) => {
		let value = (<HTMLDivElement>e.target).attributes.getNamedItem('button')?.value;
		if (value != null) {
			this.setTouchState(<TouchType>value, true);
		}
	}
	private touchend = (e: TouchEvent) => {
		let value = (<HTMLDivElement>e.target).attributes.getNamedItem('button')?.value;
		if (value != null) {
			this.setTouchState(<TouchType>value, false);
		}
	}

	constructor(touchButtons: Array<HTMLDivElement>) {
		this.touchButtons = touchButtons;
		this.addTouchListener();
	}

	public destroy(): void {
		this.removeTouchListener();
	}

	private addTouchListener(): void {
		for (let i = 0; i < this.touchButtons.length; i++) {
			this.touchButtons[i].addEventListener('touchstart', this.touchstart);
		}
		window.addEventListener('touchend', this.touchend);
	}

	private removeTouchListener(): void {
		for (let i = 0; i < this.touchButtons.length; i++) {
			this.touchButtons[i].removeEventListener('touchstart', this.touchstart);
		}
		window.removeEventListener('touchend', this.touchend);
	}

	public setTouchState(code: TouchType, state: boolean) {
		this.PAD_TOUCHED[code] = state;
	}

	public getTouchState(code: TouchType): boolean {
		return this.PAD_TOUCHED[code];
	}

}

export class TouchValue {
	public static MOVE_FRONT: TouchType = 'move-front';
	public static MOVE_BACK: TouchType = 'move-back';
	public static MOVE_LEFT: TouchType = 'move-left';
	public static MOVE_RIGHT: TouchType = 'move-right';
	public static MOVE_UP: TouchType = 'move-up';
	public static MOVE_DOWN: TouchType = 'move-down';
}

export type TouchType =
	'move-front' | 'move-back' | 'move-left' | 'move-right' |
	'move-up' | 'move-down';
