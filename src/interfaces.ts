import { Subscription } from "rxjs";
import { Basket } from "./basket";
import { Game } from "./game";
import { Lives } from "./lives";
import { Score } from "./score";

export interface State {
    game: Game,
    basket: Basket,
    score: Score,
    lives: Lives,
    gameSubscription: Subscription
}

export interface Fruit {
    id: number;
    name: string;
    image: string;
}