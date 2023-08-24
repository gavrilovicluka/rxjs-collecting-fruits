import { Observable, Subscription, animationFrameScheduler, combineLatest, concatMap, debounceTime, forkJoin, from, fromEvent, generate, interval, map, merge, mergeMap, of, subscribeOn, switchMap, take, takeUntil, takeWhile, tap, timer, zip } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";
import { Fruit } from "./fruit";
import { Lives } from "./lives";
import { Game } from "./game";

const game = new Game();
let gameSubscription: Subscription | null = null;
let basketMoveSubscription: Subscription | null = null;
const basket = new Basket();
const score = new Score();
const lives = new Lives();
const fruits_url = 'http://localhost:3000/fruits';

game.drawGame(score, lives);
//const gameMenuDiv = game.createGameMenuDiv();
const gameContainer = game.getGameContainer();
basket.createBasket(gameContainer);
//const gameOverMessage = game.createGameOverMessage(gameContainer);
const startButton = game.createStartButton(gameContainer);

const fruits$: Observable<Fruit[]> = fetchFruits();

function fetchFruits(): Observable<Fruit[]> {
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

basket.moveObservable = fromEvent<MouseEvent>(document, 'mousemove')
  .pipe(map(event => event.clientX - basket.element.offsetWidth / 2));

basketMoveSubscription = basket.moveObservable.subscribe((position) => {
  basket.move(position);
});

/*     start       1111              */
// const startGame$: Observable<Fruit> = fromEvent(startButton, 'click')
//   .pipe(
//     map(() => basketMoveSubscription = prepareGame(startButton, score, lives, gameMenuDiv, basketMoveSubscription, basket)),
//     switchMap(() => randomFruit$)
//   );

// const randomFruit$: Observable<Fruit> = interval(1000)
// .pipe(
//   switchMap(() => fruits$),
//   switchMap((fruits) => getRandomFruit(fruits, fruits.length))
// )

const startGame$: Observable<Fruit[]> = fromEvent(startButton, 'click').pipe(
  map(() => game.prepareGame(startButton, score, lives, basketMoveSubscription, basket)),
  switchMap(() => interval(1000)),
  switchMap(() => fruits$),
  mergeMap((fruits: Fruit[]) => generateRandomFruitsObservable(fruits))
);

function generateRandomFruitsObservable(fruits: Fruit[]): Observable<Fruit[]> {

  const numberOfFruitsToDrop = game.setNumberOfFruitsToDrop(); // U zavisnosti od nivoa pada razlicit broj vocki odjednom
  const randomFruits$: Observable<Fruit>[] = [];

  for (let i = 0; i < numberOfFruitsToDrop; i++) {
    randomFruits$.push(getRandomFruit(fruits, fruits.length));
  }
  return forkJoin(randomFruits$); // Ovde koristimo forkJoin da bismo čekali sve voćke da se pripreme

}

startGame$.subscribe((randomFruits) => {
  randomFruits.forEach((randomFruit) => {
    drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
  });
});




/*     end         111111             */

// randomFruit$.subscribe((randomFruit) => {
//   drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
// });

//************new */
const fruitsToDrop$: Observable<Fruit>[] = [];


/*       start         11111111111                   */
// for (let i = 0; i < 3; i++) { // Primer: Želite da padne do 5 voćki istovremeno
//   fruitsToDrop$.push(startGame$);
//   //console.log(randomFruit$);
//   randomFruit$.subscribe((x) => console.log(x))

// }



// const combinedFruits$: Observable<Fruit> = merge(...fruitsToDrop$);

// combinedFruits$.subscribe((randomFruit) => {
//   drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
// });

/*      end           11111111111111111                */
//********************end new */

// const combinedFruits$: Observable<Fruit> = randomFruit$
//   .pipe(

//     concatMap(() => {

//       let numFruitsToDrop = Math.floor(Math.random() * 5) + 1; // Generišite slučajan broj od 1 do 5
//       let fruitsToDrop$: Observable<Fruit>[] = [];

//       console.log(`Dropping ${numFruitsToDrop} fruits`);

//       for (let i = 0; i < numFruitsToDrop; i++) {
//         fruitsToDrop$.push(randomFruit$);
//       }

//       return merge(...fruitsToDrop$);
//     })
//   );

// combinedFruits$.subscribe((randomFruit) => {
//   //console.log('Combined randomFruit$:', randomFruit);
//   drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
// });











// const startButtonClick$ = fromEvent(startButton, 'click').pipe(
//       tap(() => startButton.style.display = 'none'),
//       tap(() => score.createScoreElement(gameMenuDiv)),
//       tap(() => lives.createLivesElement(gameMenuDiv, gameSubscription)));

// const fruitsInterval$ = interval(1000).pipe(
//   switchMap(() => fruits$),
//   switchMap((fruits) => getRandomFruit(fruits, fruits.length))
// ).subscribe((randomFruit) => {
//     drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
//   });

// gameSubscription = merge([basket.moveObservable, fruitsInterval$]).pipe(
//   switchMap(() => interval(50)),
//   takeWhile(() => lives.value > 0),
// ).subscribe();
//gameSubscription = merge(basket.moveObservable, randomFruit$).subscribe();
//gameSubscription = basket.moveObservable.pipe(merge(randomFruit$));

function getRandomFruit(fruits: Fruit[], length: number): Observable<Fruit> {
  const randomNumber = Math.floor(Math.random() * length);
  return of(fruits[randomNumber]);
}

function drawFruit(x: number, y: number, imageUrl: string) {
  const fruitElement: HTMLElement = document.createElement('div');
  fruitElement.className = 'fruit';
  fruitElement.style.left = `${x}px`;
  fruitElement.style.top = `${y}px`;
  fruitElement.style.backgroundImage = `url('${imageUrl}')`;
  gameContainer.appendChild(fruitElement);

  startFallingAnimation(fruitElement);
  //return fruitElement;
}

// const fallingAnimationObservable = interval(50)
//   .pipe(
//     take(200),
//     takeWhile(() => lives.value > 0),
//   );

//   const combinedObservable = combineLatest([basketMoveObservable, fallingAnimationObservable]);

// // Pretplatite se na kombinirani Observable
// gameSubscription = combinedObservable.subscribe(([basketMovePosition, randomFruit]) => {
//   basket.move(basketMovePosition);
//   const fruitElement = drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
//   animateFallingFruit(fruitElement);
// });

/* --------------------------------------------------*/
function startFallingAnimation(fruitElement: HTMLElement) {
  interval(Math.floor(Math.random() * (70 - 50)) + 50)      //ovde se podesava brzina animacije padanja
    .pipe(
      take(200),
      takeWhile(() => lives.getValue() > 0),
    )
    .subscribe(() => { animateFallingFruit(fruitElement) });
}

function animateFallingFruit(fruitElement: HTMLElement) {
  const currentPosition: number = fruitElement.offsetTop;   //sa parseInt(fruitElement.style.top, 10) dolazi do problema jer pretpostavljam da stil top nije postavljen tacno na brojcanu vrednost
  //fruitElement.style.top = `${currentPosition + 15}px`;
  //console.log('current position: ', currentPosition);
  fruitElement.style.top = '120vh';     //ako se stavi npr. 50px, vocka padne do 50px s vrha i stane, zbog toga je 100vh da padne skroz dole. Stavljeno je 120vh jer kad je 100vh animacija uspori pred kraj
  //fruitElement.style.transform = `translateY(${currentPosition + 5}px)`;
  fruitElement.style.transform = `translateY(5px)`;

  checkFruitPosition(fruitElement, currentPosition);

}
/*--------------------------------------------------------*/

function checkFruitPosition(fruitElement: HTMLElement, currentPosition: number) {

  if (currentPosition >= window.innerHeight) {
    fruitElement.remove();
    lives.decrease();
    if (lives.getValue() <= 0) {
      basketMoveSubscription = game.gameOver(basketMoveSubscription, startButton);
    }
  } else if (basket.checkCollision(fruitElement)) {
    score.increaseScore();
    game.checkLevel(score.getValue());
    console.log(game.getLevel());
    fruitElement.remove();
    if (score.getValue() === 3) {
      basket.makeFullBasket();
    }
  }
}

// function animateFallingFruit(fruitElement: HTMLElement) {


//   const animationSubscription = animationFrameScheduler.schedule(
//     function (height) {
//       const currentPosition: number = parseInt(fruitElement.style.top, 10);
//       fruitElement.style.top = `${height}px`;
//       //console.log(height);
//       this.schedule(height + 5); // `this` references currently executing Action,
//       // which we reschedule with new state
//     },
//     0,
//     0
//   );
//   setTimeout(() => {
//     animationSubscription.unsubscribe();
//   }, 10000)
//   console.log("1")
//   const currentPosition: number = parseInt(fruitElement.style.top, 10);
//   console.log(currentPosition)
//   if (currentPosition >= window.innerHeight) {
//     console.log("2")
//     fruitElement.remove();
//     animationSubscription.unsubscribe();
//     //lives.decreaseLives();
//   } else if (basket.checkCollision(fruitElement)) {
//     console.log("3")
//     score.increaseScore();
//     fruitElement.remove();
//     animationSubscription.unsubscribe();
//     if (score.value === 3) {
//       basket.makeFullBasket();
//     }
//   }

//}





// function animateFallingFruit(fruitElement: HTMLElement) {
//   const animationDuration = 1000; // Animation duration in milliseconds
//   const startTimestamp = performance.now();

//   function animationStep(timestamp: number) {
//     const elapsedTime = timestamp - startTimestamp;
//     const positionRatio = Math.min(1, elapsedTime / animationDuration);
//     const height = -100 + positionRatio * (window.innerHeight + 100);

//     fruitElement.style.top = `${height}px`;

//     if (positionRatio < 1) {
//       requestAnimationFrame(animationStep); // Continue the animation
//     }
//   }

//   requestAnimationFrame(animationStep);
// }
