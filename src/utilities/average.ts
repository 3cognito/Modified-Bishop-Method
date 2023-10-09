export function calculateAverage(numbers: { top: number; bottom: number }[]): {
  topSum: number;
  bottomSum: number;
  length: number;
} {
  console.log(numbers);
  const topSum = numbers.reduce((acc, currentValue) => acc + currentValue.top, 0);
  const bottomSum = numbers.reduce((acc, currentValue) => acc + currentValue.bottom, 0);
  const length = numbers.length;

  return { topSum, bottomSum, length };
}
