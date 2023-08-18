import { Subscription } from "rxjs";
import { Lives } from "./lives";
import { Score } from "./score";
import { Basket } from "./basket";

let gameOverMessage: HTMLElement | null;

export function createGameMenuDiv(): HTMLDivElement {
    const gameMenuDiv = document.createElement("div");
    gameMenuDiv.className = 'game-menu';
    document.body.appendChild(gameMenuDiv);

    return gameMenuDiv;
}

export function createStartButton(parent: HTMLDivElement): HTMLButtonElement {
    const startButton = document.createElement("button");
    startButton.innerHTML = "START";
    startButton.className = "start-button";
    parent.appendChild(startButton);

    return startButton;
}

export function prepareGame(startButton: HTMLButtonElement, score: Score, lives: Lives,
    gameMenuDiv: HTMLDivElement, basketMoveSubscription: Subscription | null, basket: Basket): Subscription {

    startButton.style.display = 'none';
    score.createElement(gameMenuDiv);
    lives.createElement(gameMenuDiv);

    if (gameOverMessage) {
        gameOverMessage.remove();
    }

    if (!basketMoveSubscription) {
        basketMoveSubscription = basket.moveObservable.subscribe((position) => {
            basket.move(position);
        });
    }

    return basketMoveSubscription;
}

export function gameOver(basketMoveSubscription: Subscription, startButton: HTMLButtonElement): Subscription {
    // if (gameSubscription) {
    //   gameSubscription.unsubscribe();
    //   gameSubscription = null;
    // }

    if (basketMoveSubscription) {
        basketMoveSubscription.unsubscribe();
        basketMoveSubscription = null;
    }

    showGameOverMessage();
    removeFruitsFromScreen();
    showStartButton(startButton);

    return basketMoveSubscription;
}

function showGameOverMessage(): void {
    const gameOverContainer = document.createElement('div');
    gameOverMessage = document.createElement('p');
    gameOverMessage.innerHTML = "GAME OVER";
    gameOverMessage.className = 'game-info-label';
    document.body.appendChild(gameOverContainer);
    gameOverContainer.appendChild(gameOverMessage);
}

function removeFruitsFromScreen(): void {
    const fruits = document.querySelectorAll('.fruit');
    fruits.forEach(fruit => fruit.remove());
}

function showStartButton(startButton: HTMLButtonElement): void {
    startButton.style.display = 'inline-block';
    startButton.disabled = false;
}