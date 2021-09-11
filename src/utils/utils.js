import dayjs from 'dayjs';
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getDuration = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  return to.diff(from);
};

export const getFormattedTimeDifference = (diff) => {
  if (diff / 60000 / 60 < 1) {
    diff = dayjs(diff).format('mm[M]');
  } else if (diff / 60000 / 60 >= 1 && diff / 60000 / 60 < 24) {
    diff = dayjs(diff).format('HH[H] mm[M]');
  } else {
    diff = dayjs(diff).format('DD[D] HH[H] mm[M]');
  }

  return diff;
};

export const sortingByTime = (pointA, pointB) => getDuration(pointB.dateFrom, pointB.dateTo) - getDuration(pointA.dateFrom, pointA.dateTo);

export const sortingByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortingByDate = (pointA, pointB) => {
  const pointDateA = new Date(pointA.dateFrom);
  const pointDateB = new Date(pointB.dateFrom);

  return pointDateA - pointDateB;
};

export const isFutureDateStart = (pointDate) => {
  const currentDate = new Date();
  pointDate = new Date(pointDate);
  return pointDate >= currentDate;
};

export const isPastDateFinish = (pointDate) => {
  const currentDate = new Date();
  pointDate = new Date(pointDate);

  return pointDate < currentDate;
};

export const isAllFiltersDate = (pointDateFrom, pointDateTo) => {
  const currentDate = new Date();
  pointDateFrom = new Date(pointDateFrom);
  pointDateTo = new Date(pointDateTo);

  return pointDateFrom < currentDate && pointDateTo > currentDate;
};
