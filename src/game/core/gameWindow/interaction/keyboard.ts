export class Keyboard {

	private readonly KEY_PRESSED = {
		'KeyA': false, 'KeyB': false, 'KeyC': false, 'KeyD': false, 'KeyE': false, 'KeyF': false, 'KeyG': false,
		'KeyH': false, 'KeyI': false, 'KeyJ': false, 'KeyK': false, 'KeyL': false, 'KeyM': false, 'KeyN': false,
		'KeyO': false, 'KeyP': false, 'KeyQ': false, 'KeyR': false, 'KeyS': false, 'KeyT': false,
		'KeyU': false, 'KeyV': false, 'KeyW': false, 'KeyX': false, 'KeyY': false, 'KeyZ': false,
		'Digit1': false, 'Digit2': false, 'Digit3': false, 'Digit4': false, 'Digit5': false,
		'Digit6': false, 'Digit7': false, 'Digit8': false, 'Digit9': false, 'Digit0': false,
		'Backquote': false, 'Minus': false, 'Equal': false,
		'Space': false,
		'ShiftLeft': false,
		'ShiftRight': false,
	}

	private keydown = (e: KeyboardEvent) => {
		this.setKeyState(<KeyType>e.code, true);
	}
	private keyup = (e: KeyboardEvent) => {
		this.setKeyState(<KeyType>e.code, false);
	}

	constructor() {
		this.addKeyListener();
	}

	public destroy(): void {
		this.removeKeyListener();
	}

	private addKeyListener(): void {
		window.addEventListener('keydown', this.keydown);
		window.addEventListener('keyup', this.keyup);
	}

	private removeKeyListener(): void {
		window.removeEventListener('keydown', this.keydown);
		window.removeEventListener('keyup', this.keyup);
	}

	public setKeyState(code: KeyType, state: boolean) {
		this.KEY_PRESSED[code] = state;
	}

	public getKeyState(code: KeyType): boolean {
		return this.KEY_PRESSED[code];
	}

}

export class KeyValue {
	public static A: KeyType = 'KeyA';
	public static B: KeyType = 'KeyB';
	public static C: KeyType = 'KeyC';
	public static D: KeyType = 'KeyD';
	public static E: KeyType = 'KeyE';
	public static F: KeyType = 'KeyF';
	public static G: KeyType = 'KeyG';
	public static H: KeyType = 'KeyH';
	public static I: KeyType = 'KeyI';
	public static J: KeyType = 'KeyJ';
	public static K: KeyType = 'KeyK';
	public static L: KeyType = 'KeyL';
	public static M: KeyType = 'KeyM';
	public static N: KeyType = 'KeyN';
	public static O: KeyType = 'KeyO';
	public static P: KeyType = 'KeyP';
	public static Q: KeyType = 'KeyQ';
	public static R: KeyType = 'KeyR';
	public static S: KeyType = 'KeyS';
	public static T: KeyType = 'KeyT';
	public static U: KeyType = 'KeyU';
	public static V: KeyType = 'KeyV';
	public static W: KeyType = 'KeyW';
	public static X: KeyType = 'KeyX';
	public static Y: KeyType = 'KeyY';
	public static Z: KeyType = 'KeyZ';
	public static DIGIT_1: KeyType = 'Digit1';
	public static DIGIT_2: KeyType = 'Digit2';
	public static DIGIT_3: KeyType = 'Digit3';
	public static DIGIT_4: KeyType = 'Digit4';
	public static DIGIT_5: KeyType = 'Digit5';
	public static DIGIT_6: KeyType = 'Digit6';
	public static DIGIT_7: KeyType = 'Digit7';
	public static DIGIT_8: KeyType = 'Digit8';
	public static DIGIT_9: KeyType = 'Digit9';
	public static DIGIT_0: KeyType = 'Digit0';
	public static BACKQUOTE: KeyType = 'Backquote';
	public static MINUS: KeyType = 'Minus';
	public static EQUAL: KeyType = 'Equal';
	public static SPACE: KeyType = 'Space';
	public static SHIFT_LEFT: KeyType = 'ShiftLeft';
	public static SHIFT_RIGHT: KeyType = 'ShiftRight';
}

export type KeyType =
	'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' |
	'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' |
	'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' |
	'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ' |
	'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | 'Digit5' |
	'Digit6' | 'Digit7' | 'Digit8' | 'Digit9' | 'Digit0' |
	'Backquote' | 'Minus' | 'Equal' |
	'Space' |
	'ShiftLeft' |
	'ShiftRight';
