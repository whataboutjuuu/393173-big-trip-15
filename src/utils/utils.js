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
// export const updateItem = (items, update) => {
//   const index = items.findIndex((item) => item.id === update.id);

//   if (index === -1) {
//     return items;
//   }

//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };
export const sortingByTime = (pointA, pointB) => getDuration(pointB) - getDuration(pointA);

export const sortingByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortingByDate = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

