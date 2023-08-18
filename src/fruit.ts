import { interval, take, takeWhile } from "rxjs";
import { Basket } from "./basket";
import { Score } from "./score";

export class Fruit {
  id: number;
  name: string;
  image: string;

  constructor(id: number, name: string, image: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }

  // drawFruit(x: number, y: number, imageUrl: string, gameContainer : HTMLElement): HTMLElement {
  //   const fruitElement: HTMLElement = document.createElement('div');
  //   fruitElement.className = 'fruit';
  //   fruitElement.style.left = `${x}px`;
  //   fruitElement.style.top = `${y}px`;
  //   fruitElement.style.backgroundImage = `url('${imageUrl}')`;
  //   gameContainer.appendChild(fruitElement);

  //   interval(50)
  //     .pipe(
  //       take(100) 
  //     )
  //     .subscribe(() => {
  //       const currentPosition: number = parseInt(fruitElement.style.top, 10);
  //       fruitElement.style.top = `${currentPosition + 5}px`; 

  //       if (currentPosition >= window.innerHeight) {
  //         fruitElement.remove();
  //       }
  //     });

  //     return fruitElement;
  // }
}