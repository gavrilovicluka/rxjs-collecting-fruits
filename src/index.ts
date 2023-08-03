import { Observable, combineLatest, concatMap, debounceTime, from, fromEvent, interval, map, merge, mergeMap, of, switchMap, take, takeUntil, tap, timer, zip } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";
import { Fruit } from "./fruit";

const basket = new Basket();
const score = new Score();
const fruits_url = 'http://localhost:3000/fruits';
const intervalRandomNumber = Math.floor(Math.random() * 1000);
const gameContainer = document.getElementById('game-container');
const gameLevel = {
  1: 2000,
  2: 1000,
  3: 500
}
const fruits$: Observable<Fruit[]> = fetchFruits();

function fetchFruits(): Observable<Fruit[]> {
  return from(fetch(fruits_url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error("Failed to fetch fruit")
      }
    })
    .catch(err => console.log(err)))

}

interval(1000)    //menja se interval u zavisnosti od nivoa
  .pipe(
    switchMap(() => fruits$),
    switchMap((fruits) => getRandomFruit(fruits, fruits.length))
  )
  .subscribe((randomFruit) => {
    const fruitX = Math.random() * (window.innerWidth - 50);
    const fruitY = -100;
    const fruitElement = drawFruit(fruitX, fruitY, randomFruit.image);
  });

function getRandomFruit(fruits: Fruit[], length: number): Observable<Fruit> {
  const randomNumber = Math.floor(Math.random() * length);
  return of(fruits[randomNumber]);
}

function drawFruit(x: number, y: number, imageUrl: string): HTMLElement {
  const fruitElement: HTMLElement = document.createElement('div');
  fruitElement.className = 'vocka';
  fruitElement.style.left = `${x}px`;
  fruitElement.style.top = `${y}px`;
  fruitElement.style.backgroundImage = `url('${imageUrl}')`;
  gameContainer.appendChild(fruitElement);

  animateFallingFruit(fruitElement);

  return fruitElement;
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
      } else if (basket.checkCollision(fruitElement)) {
        score.increaseScore();
        fruitElement.remove();
        if(score.value === 3) {
          basket.makeFullBasket();
        }
      }

    });
}
