import { Observable, Subscription, forkJoin, from, interval, map, of, take } from "rxjs";
import { Fruit } from "./interfaces";
import { Game } from "./game";
import { State } from "./interfaces";

export function fetchFruits(fruits_url: string): Observable<Fruit[]> {
    return from(fetch(fruits_url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error("Failed to fetch fruits");
            }
        })
        .catch(err => console.log(err)))
}

export function generateRandomFruitsObservable(game: Game, fruits: Fruit[]): Observable<Fruit[]> {
    const numberOfFruitsToDrop = game.setNumberOfFruitsToDrop();
    const randomFruits$: Observable<Fruit>[] = [];

    for (let i = 0; i < numberOfFruitsToDrop; i++) {
        randomFruits$.push(getRandomFruit(fruits));
    }

    return forkJoin(randomFruits$);
}

export function getRandomFruit(fruits: Fruit[]): Observable<Fruit> {
    const randomNumber = Math.floor(Math.random() * fruits.length);
    return of(fruits[randomNumber]);
}

export function drawFruits(fruits: Fruit[], gameContainer: HTMLDivElement, state: State) {

    fruits.forEach(fruit => {
        const x = Math.random() * (window.innerWidth - 50);
        const y = -100;
        const fruitElement: HTMLElement = document.createElement('div');
        fruitElement.className = 'fruit';
        fruitElement.style.left = `${x}px`;
        fruitElement.style.top = `${y}px`;
        fruitElement.style.backgroundImage = `url('${fruit.image}')`;
        gameContainer.appendChild(fruitElement);

        startFallingAnimation(fruitElement, state);
    })
}

export function startFallingAnimation(fruitElement: HTMLElement, state: State) {
    const animation$: Observable<void> = interval(Math.floor(Math.random() * (100 - 50)) + 50)      // brzina animacije padanja (od 50 do 100ms)
        .pipe(
            take(50),
            map(() => animateFallingFruit(fruitElement, state))
        )

    animation$.subscribe();   
}

export function animateFallingFruit(fruitElement: HTMLElement, state: State) {
    fruitElement.style.top = '120vh';
    fruitElement.style.transform = `translateY(5px)`;

    checkFruitPosition(fruitElement, state);
}

export function checkFruitPosition(fruitElement: HTMLElement, state: State) {
    const currentPosition: number = fruitElement.offsetTop; 
    if (currentPosition >= window.innerHeight) {
        fruitElement.remove();
        state.lives.decrease();
        if (state.lives.getValue() <= 0) {
            endGameSubscription(state);
        }
    } else if (state.basket.checkCollision(fruitElement)) {
        state.score.increaseScore();
        state.game.checkLevel(state.score.getValue());
        fruitElement.remove();
        if (state.score.getValue() === 3) {
            state.basket.makeFullBasket();
        }
    }
}

export function endGameSubscription(state: State) {
    state.gameSubscription.unsubscribe();
}