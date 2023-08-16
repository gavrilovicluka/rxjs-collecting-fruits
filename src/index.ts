import { Observable, Subscription, combineLatest, concatMap, debounceTime, from, fromEvent, interval, map, merge, mergeMap, of, subscribeOn, switchMap, take, takeUntil, tap, timer, zip } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";
import { Fruit } from "./fruit";
import { Lives } from "./lives";

let gameSubscription: Subscription | null = null;
const basket = new Basket();
const score = new Score();
const lives = new Lives();
const fruits_url = 'http://localhost:3000/fruits';
//const intervalRandomNumber = Math.floor(Math.random() * 1000);
const gameContainer = document.getElementById('game-container');
// const gameLevel = {
//   1: 2000,
//   2: 1000,
//   3: 500
// }

const gameMenuDiv = document.createElement("div");
gameMenuDiv.className = 'game-menu';
document.body.appendChild(gameMenuDiv);

const startButton = document.createElement("button");
startButton.innerHTML = "START";
startButton.className = "start-button";
gameMenuDiv.appendChild(startButton);

// score.createScoreElement(gameMenuDiv);
//lives.createLivesElement(gameMenuDiv, gameSubscription);

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

const randomFruit$ : Observable<Fruit> = fromEvent(startButton, 'click')
  .pipe(
    tap(() => startButton.style.display = 'none'),
    tap(() => score.createScoreElement(gameMenuDiv)),
    tap(() => lives.createLivesElement(gameMenuDiv, gameSubscription)),
    switchMap(() => interval(1000)
      .pipe(
        switchMap(() => fruits$),
        switchMap((fruits) => getRandomFruit(fruits, fruits.length))
      ))
  );

  randomFruit$.subscribe((randomFruit) => {
    drawFruit(Math.random() * (window.innerWidth - 50), -100, randomFruit.image);
  });


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

  animateFallingFruit(fruitElement);

}

function animateFallingFruit(fruitElement: HTMLElement) {
  interval(50)
    .pipe(
      take(1000)
    )
    .subscribe(() => {
      const currentPosition: number = parseInt(fruitElement.style.top, 10);
      fruitElement.style.top = `${currentPosition + 5}px`;

      if (currentPosition >= window.innerHeight) {
        fruitElement.remove();
        //lives.decreaseLives();
      } else if (basket.checkCollision(fruitElement)) {
        score.increaseScore();
        fruitElement.remove();
        if (score.value === 3) {
          basket.makeFullBasket();
        }
      }

    });
}


function gameOver() {
  // if (gameSubscription) {
  //   // Unsubscribe from the game subscription to stop the game
  //   gameSubscription.unsubscribe();
  //   gameSubscription = null;
  // }

  // You can show a game over message or perform any other actions here
  const gameOverMessage = document.createElement('p');
  gameOverMessage.innerHTML = "GAME OVER";
  gameOverMessage.className = 'game-info-label';


  // Remove any remaining fruit elements on the screen
  const fruits = document.querySelectorAll('.fruit');
  fruits.forEach(fruit => fruit.remove());

  // Show the start button again
  startButton.style.display = 'inline-block';
}
