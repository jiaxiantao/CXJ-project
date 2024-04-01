const subtract = (a: number, b: number) => {
  return (a * 1000000000 - b * 1000000000) / 1000000000;
};

const plus = (a: number, b: number) => {
  return (a * 1000000000 + b * 1000000000) / 1000000000;
};

export { subtract, plus };
