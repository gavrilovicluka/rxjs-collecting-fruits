export class Basket {
  element: HTMLElement;

  constructor() {
    this.element = document.getElementById('empty-fruit-basket');
  }

  createBasket(parent: HTMLDivElement): void {
    const basketContainer = document.createElement('div');
    basketContainer.id = 'empty-fruit-basket';
    parent.appendChild(basketContainer);
    this.element = basketContainer;
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

  makeFullBasket(): void {
    this.element.style.backgroundImage = `url('../assets/images/full-basket.png')`;
  }

  makeEmptyBasket(): void {
    this.element.style.backgroundImage = `url('../assets/images/empty-basket.png')`;
  }
}