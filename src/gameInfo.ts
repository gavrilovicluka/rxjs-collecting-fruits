export abstract class GameInfo {
    protected value: number;
    protected element: HTMLElement;

    constructor(private initialValue: number, private label: string) {
        this.value = initialValue;
    }

    createElement(parent: HTMLElement) {

        if (this.element) {
            this.element.remove();
            this.value = this.initialValue;
        }
        this.element = document.createElement('div');
        this.element.className = 'game-info-label';
        this.updateInfoDisplay();
        document.body.appendChild(this.element);
    }

    getValue(): number {
        return this.value;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    protected updateInfoDisplay() {
        this.element.textContent = `${this.label}: ${this.value}`;
    }

    reset() {
        this.value = this.initialValue;
        this.updateInfoDisplay();
    }
}
