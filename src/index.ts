import { Observable, Subscription, animationFrameScheduler, combineLatest, finalize, forkJoin, from, fromEvent, interval, merge, mergeMap, of, switchMap, take, tap, timer, zip } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";
import { Fruit } from "./interfaces";
import { Lives } from "./lives";
import { Game } from "./game";
import { takeWhile, map } from 'rxjs/operators';
import { drawFruits, fetchFruits, generateRandomFruitsObservable } from "./functions";
import { State } from "./interfaces";
import { fruits_url } from "./environment";

const game = new Game();
const basket = new Basket();
const score = new Score();
const lives = new Lives();
let gameSubscription: Subscription | null = null;
const state: State = {
    game,
    basket,
    score,
    lives,
    gameSubscription
}

game.drawGame(score, lives);

const gameContainer = game.getGameContainer();
basket.createBasket(gameContainer);

const startButton = game.createStartButton(gameContainer);

const startButtonClick$: Observable<Event> = fromEvent(startButton, 'click');

const fruits$: Observable<Fruit[]> = fetchFruits(fruits_url);

const mouseMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mousemove');

const basketMoveObservable$ = mouseMove$.pipe(
    map(event => event.clientX - basket.element.offsetWidth / 2),
    map(position => basket.move(position)),
    takeWhile(() => lives.getValue() > 0)
);

const gameTick$: Observable<number> = interval(1000);

const fruitsToDrop$: Observable<Fruit[]> = gameTick$.pipe(
    switchMap(() => fruits$),
    switchMap((fruits: Fruit[]) => generateRandomFruitsObservable(game, fruits)),
    tap((randomFruits) => drawFruits(randomFruits, gameContainer, state)),
    takeWhile(() => lives.getValue() > 0)
);


const gameInProgress$ = combineLatest([basketMoveObservable$, fruitsToDrop$])
    .pipe(
        takeWhile(() => lives.getValue() > 0),
        finalize(() => {
            game.gameOver(startButton);
        })
    )


startButtonClick$.subscribe(() => {
    game.prepareGame(startButton, score, lives, basket);
    state.gameSubscription = gameInProgress$.subscribe();
})
