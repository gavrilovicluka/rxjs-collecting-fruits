import { Observable, Subscription } from "rxjs";
import { Score } from "./score";
import { Lives } from "./lives";
import { Basket } from "./basket";

export class Game {

    private level: number;
    private levelElement: HTMLElement | null;
    private gameMenuDiv: HTMLDivElement;
    private gameContainer: HTMLDivElement;
    private gameOverMessage: HTMLElement | null;


    constructor() {
        this.level = 1;
    }

    drawGame(score: Score, lives: Lives) {
        this.createGameMenuDiv();
        this.createGameContainer();
        this.createGameOverMessage();

        score.createElement(this.gameMenuDiv);
        lives.createElement(this.gameMenuDiv);
        this.createLevelElement(this.gameMenuDiv);
    }

    private createGameMenuDiv(): HTMLDivElement {
        this.gameMenuDiv = document.createElement("div");
        this.gameMenuDiv.className = 'game-menu';
        document.body.appendChild(this.gameMenuDiv);

        return this.gameMenuDiv;
    }

    private createGameContainer(): HTMLDivElement {
        this.gameContainer = document.createElement("div");
        this.gameContainer.className = 'game-container';
        document.body.appendChild(this.gameContainer);

        return this.gameContainer;
    }

    private createGameOverMessage() {
        const gameOverContainer = document.createElement('div');
        this.gameOverMessage = document.createElement('p');
        this.gameOverMessage.innerHTML = "GAME OVER";
        this.gameOverMessage.className = 'game-info-label';
        gameOverContainer.appendChild(this.gameOverMessage);
        this.gameContainer.appendChild(gameOverContainer);

        this.gameOverMessage.style.display = 'none';
    }

    createStartButton(parent: HTMLDivElement): HTMLButtonElement {
        const startButtonDiv = document.createElement("div");
        this.gameContainer.appendChild(startButtonDiv);
        const startButton = document.createElement("button");
        startButton.innerHTML = "START";
        startButton.className = "start-button";
        startButtonDiv.appendChild(startButton);

        return startButton;
    }

    getGameContainer(): HTMLDivElement {
        return this.gameContainer;
    }

    prepareGame(startButton: HTMLButtonElement, score: Score, lives: Lives, basket: Basket) {

        startButton.style.display = 'none';

        this.resetLevel();
        score.reset();
        lives.reset();


        if (this.gameOverMessage) {
            this.gameOverMessage.style.display = 'none';
        }

        basket.makeEmptyBasket();
    }

    private createLevelElement(gameMenuDiv: HTMLElement) {
        this.levelElement = document.createElement('div');
        this.levelElement.className = 'game-info-label';
        this.updateLevelText();
        gameMenuDiv.appendChild(this.levelElement);
    }

    private updateLevelText() {
        this.levelElement.textContent = `Level: ${this.level}`;
    }

    gameOver(startButton: HTMLButtonElement) {

        this.showGameOverMessage(this.gameOverMessage);
        this.removeFruitsFromScreen();
        this.showStartButton(startButton);
    }

    private showGameOverMessage(gameOverMessage: HTMLElement) {
        gameOverMessage.style.display = 'inline-block';
    }

    private removeFruitsFromScreen(): void {
        const fruits = document.querySelectorAll('.fruit');
        fruits.forEach(fruit => fruit.remove());
    }

    private showStartButton(startButton: HTMLButtonElement): void {
        startButton.style.display = 'block';
        startButton.disabled = false;
    }

    setNumberOfFruitsToDrop(): number {
        return Math.floor(Math.random() * this.level) + 1;
    }

    checkLevel(score: number) {
        this.level = Math.floor((score / 10) + 1);
        this.updateLevelText();
    }

    private resetLevel() {
        this.level = 1;
        this.updateLevelText();
    }
}