import { getValue } from '@testing-library/user-event/dist/utils';
import { NumberLiteralType } from 'typescript';

type Props = {
  x: number;
  y: number;
  isDisabled: boolean;
  css: string;
  updateGuess(value: string, x: number, y: number): void;
  getValue(x: number, y: number): string;
};

export const WordInput = ({ x, y, isDisabled, css, updateGuess, getValue }: Props) => {
  return (
    <input
      name={`guess-${x}-${y}`}
      id={`guess-${x}-${y}`}
      disabled={isDisabled}
      className={`border-2 border-grey-500 py-2 px-3 text-grey-darkest w-16 text-center text-2xl ${css}`}
      maxLength={1}
      type='text'
      onChange={(e) => updateGuess(e.target.value, x, y)}
      value={getValue(x, y)}
    />
  );
};
