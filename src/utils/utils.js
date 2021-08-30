import dayjs from 'dayjs';
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getDuration = (point) => {
  const from = dayjs(point.dateFrom);
  const to = dayjs(point.dateTo);
  return to.diff(from);
};

export const sortingByTime = (pointA, pointB) => getDuration(pointB) - getDuration(pointA);

export const sortingByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortingByDate = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

export const isFutureDateStart = (point) => {
  const currentDate = new Date();

  return point.dateFrom >= currentDate;
};

export const isPastDateFinish = (point) => {
  const currentDate = new Date();

  return point.dateTo <= currentDate;
};
