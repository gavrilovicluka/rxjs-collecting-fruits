import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

export class Basket {
  element: HTMLElement;
  moveObservable: Observable<number>;

  constructor() {
    this.element = document.getElementById('empty-fruit-basket');
    this.moveObservable = fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(map(event => event.clientX - this.element.offsetWidth / 2));

    this.moveObservable.subscribe((position) => {
      this.move(position);
    });
  }

  move(position: number): void {
    this.element.style.left = `${position}px`;
  }

  checkCollision(fruitElement: HTMLElement): boolean {

    const fruitRect = fruitElement.getBoundingClientRect();
    const basketRect = this.element.getBoundingClientRect();

    const collisionX = fruitRect.left <= basketRect.right && fruitRect.right >= basketRect.left;
    const collisionY = fruitRect.top <= (basketRect.bottom - basketRect.height / 2) && fruitRect.bottom >= basketRect.top;

    if (collisionX && collisionY) {
      return true;
    } else {
      return false;
    }
  }
}