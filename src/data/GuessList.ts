import { Guess } from '../Models/Guess';
import { GuessDetail } from '../Models/GuessDetail';

const getItems = (): GuessDetail[] => {
  let items = [] as GuessDetail[];
  [0, 1, 2, 3, 4].map((j) => items.push({ position: j } as GuessDetail));
  return items;
};

export const getGuessList = (): Map<number, Guess> => {
  const guessList = new Map<number, Guess>();
  for (let i = 0; i < 6; i++) {
    guessList.set(i, {
      row: i,
      items: getItems(),
    } as Guess);
  }

  return guessList;
};
