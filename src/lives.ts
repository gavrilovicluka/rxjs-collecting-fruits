import { GameInfo } from "./game-info";

export class Lives extends GameInfo {
  constructor() {
    super(3, 'Lives');
  }

  decrease() {
    this.value--;
    this.updateInfoDisplay();
  }
}