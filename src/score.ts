export class Score {
    private score: number = 0;
    private scoreElement: HTMLElement;
  
    constructor() {
      this.createScoreElement();
    }

    createScoreElement() {
      this.scoreElement = document.createElement('div');
      this.scoreElement.style.position = 'absolute';
      this.scoreElement.style.top = '10px';
      this.scoreElement.style.left = '10px';
      this.scoreElement.style.fontSize = '40px'
      document.body.appendChild(this.scoreElement);
    }

    public get value() : number {
      return this.score;
    }
    
    increaseScore(): void {
      this.score++;
      this.updateScoreDisplay();
    }
  
    private updateScoreDisplay(): void {
      this.scoreElement.textContent = `Score: ${this.score}`;
    }
  }
  