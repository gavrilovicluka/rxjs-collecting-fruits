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
const state : State = {
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
//switchMap: Ako se koristi switchMap, obrada ce se prekinuti kada stigne novi dogadjaj u gameTick$. 
//To znaci da ce se samo vocke generisane za najnoviji dogadjaj u generateRandomFruitsObservable obradjivati. 
//Ako se brzo pokrecu novi dogadjaji u gameTick$, stari unutrasnji observabli ce biti odbaceni pre nego sto su zavrseni, 
//sto moze rezultirati manjim brojem vocki koje padaju ako se cesto pokrecu novi dogadjaji.
//mergeMap: Sa mergeMap, svi unutrasnji observabli ce se obradjivati paralelno, bez obzira na to kada stizu novi dogadjaji u gameTick$. 
//To znaci da ce se vocke generisane za svaki dogadjaj u generateRandomFruitsObservable obradjivati istovremeno. Ako se brzo pokreću novi 
//dogadjaji u gameTick$, svaki od njih ce dodati nove vocke u igru, sto moze rezultirati vecim brojem vocki koje padaju ako se cesto pokrecu novi dogadjaji.
//Ako se dogadjaji u gameTick$ ne pokrecu toliko brzo, mozda nema velike razlike izmedju switchMap i mergeMap, jer novi dogadjaji stizu pre nego sto se 
//stari unutrasnji observabli zavrse. U tom slucaju, oba operatora ce se ponasati slicno.


const gameInProgress$ = combineLatest([basketMoveObservable$, fruitsToDrop$])   // emituje vrednosti svih tokova kad bilo koji tok emituje. Moglo i sa merge(bez [])
    .pipe(
        takeWhile(() => lives.getValue() > 0),
        finalize(() => {            // razlika izmedju ovog i complete je sto se complete nece izvrsiti ako se tok zavrsi zbog greske
            game.gameOver(startButton);
        })
    )

// Stalno se osluskuje klik na Start dugme zbog situacije kada bude Game over, a gameSubscription se unsubscribe u toj situaciji     
startButtonClick$.subscribe(() => {
    game.prepareGame(startButton, score, lives, basket);
    state.gameSubscription = gameInProgress$.subscribe();
})
