import { GameInfo } from "./gameInfo";

export class Score extends GameInfo {

  constructor() {
    super(0, 'Score');
  }

  increaseScore() {
    this.value++;
    this.updateInfoDisplay();
  }
}