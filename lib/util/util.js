
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const distance = (x1, y1, x2, y2) => {
  const xLength = x2 - x1;
  const yLength = y2 - y1;
  return Math.sqrt((xLength * xLength) + (yLength * yLength));
};
