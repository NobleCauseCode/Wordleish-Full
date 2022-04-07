import { GuessDetail } from './GuessDetail';

export interface Guess {
  row: number;
  items: GuessDetail[];
  isWinner?: boolean;
}
