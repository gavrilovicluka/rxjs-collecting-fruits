import { Observable, Subscription, animationFrameScheduler, combineLatest, concatMap, debounceTime, from, fromEvent, interval, map, merge, mergeMap, of, subscribeOn, switchMap, take, takeUntil, takeWhile, tap, timer, zip } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";
import { Fruit } from "./fruit";
import { Lives } from "./lives";
import { createGameMenuDiv, createStartButton, gameOver, prepareGame } from "./game";

let gameSubscription: Subscription | null = null;
let basketMoveSubscription: Subscription | null = null;
const basket = new Basket();
const score = new Score();
const lives = new Lives();
const fruits_url = 'http://localhost:3000/fruits';
const gameContainer = document.getElementById('game-container');
// const gameLevel = {
//   1: 2000,
//   2: 1000,
//   3: 500
// }

basket.createBasket();
const gameMenuDiv = createGameMenuDiv();
const startButton = createStartButton(gameMenuDiv);

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

const randomFruit$: Observable<Fruit> = fromEvent(startButton, 'click')
  .pipe(
    tap(() => basketMoveSubscription = prepareGame(startButton, score, lives, gameMenuDiv, basketMoveSubscription, basket)),
    switchMap(() => interval(1000)
      .pipe(
        switchMap(() => fruits$),
        switchMap((fruits) => getRandomFruit(fruits, fruits.length))
      ))
  );

randomFruit$.subscribe((randomFruit) => {
  drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
});


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

function startFallingAnimation(fruitElement: HTMLElement) {
  interval(50)      //ovde se podesava brzina animacije padanja
    .pipe(
      take(200),
      takeWhile(() => lives.getValue() > 0),
    )
    .subscribe(() => { animateFallingFruit(fruitElement) });
}

function animateFallingFruit(fruitElement: HTMLElement) {
  const currentPosition: number = fruitElement.offsetTop;   //sa parseInt(fruitElement.style.top, 10) dolazi do problema jer pretpostavljam da stil top nije postavljen tacno na brojcanu vrednost
  fruitElement.style.top = `${currentPosition + 5}px`;

  checkFruitPosition(fruitElement, currentPosition);

}

function checkFruitPosition(fruitElement: HTMLElement, currentPosition: number) {

  if (currentPosition >= window.innerHeight) {
    fruitElement.remove();
    lives.decrease();
    if (lives.getValue() <= 0) {
      basketMoveSubscription = gameOver(basketMoveSubscription, startButton);
    }
  } else if (basket.checkCollision(fruitElement)) {
    score.increaseScore();
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
