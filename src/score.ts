export class Score {
  private score: number = 0;
  private scoreElement: HTMLElement;

  constructor() {
    //this.createScoreElement();
  }

  createScoreElement(parent: HTMLElement) {
    this.scoreElement = document.createElement('div');
    //this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '10px';
    this.scoreElement.style.left = '10px';
    this.scoreElement.style.fontSize = '40px'

    this.scoreElement.className = 'game-info-label';
    this.scoreElement.textContent = `Score: 0`;
    document.body.appendChild(this.scoreElement);
  }

  public get value(): number {
    return this.score;
  }

  public get element(): HTMLElement {
    return this.scoreElement;
  }

  increaseScore(): void {
    this.score++;
    this.updateScoreDisplay();
  }

  private updateScoreDisplay(): void {
    this.scoreElement.textContent = `Score: ${this.score}`;
  }

  reset() : void {
    this.element.className = 'game-info-label';
    this.element.textContent = `Score: 0`;
  }
}
