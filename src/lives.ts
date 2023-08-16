import { Subscription } from "rxjs";

export class Lives {
    private lives: number = 3;
    private livesElement: HTMLElement;
    private gameSubscription : Subscription;

    constructor() {
        //this.createLivesElement();
    }

    createLivesElement(parent: HTMLElement, subscription : Subscription) {
        this.livesElement = document.createElement('div');
        //this.livesElement.style.position = 'absolute';
        this.livesElement.style.top = '10px';
        this.livesElement.style.left = '10px';
        this.livesElement.style.fontSize = '40px';
        this.livesElement.className = 'game-info-label';
        this.livesElement.textContent = `Lives: 3`;
        document.body.appendChild(this.livesElement);

        this.gameSubscription = subscription;
    }

    public get value(): number {
        return this.lives;
    }

    public get element(): HTMLElement {
        return this.livesElement;
    }

    decreaseLives(): void {
        this.lives--;
        this.updateLivesDisplay();
    }

    private updateLivesDisplay(): void {
        this.livesElement.textContent = `Lives: ${this.lives}`;
    }

    reset(): void {
        this.element.className = 'game-info-label';
        this.element.textContent = `Lives: 3`;
    }

}