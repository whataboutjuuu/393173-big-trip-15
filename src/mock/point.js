import { CITIES, TYPES } from '../utils/constants.js';
import { getRandomInteger } from '../utils/utils.js';
import { generateDestination } from './destination.js';
import { generatePointOffers } from './offers.js';

// Generate type
const generateType = () => {
  const types = TYPES;
  const randomTypeIndex = getRandomInteger(0, types.length - 1);

  return types[randomTypeIndex];
};

// Generate city
const generateCity = () => {
  const randomCityIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomCityIndex];
};

// Generate data
const generateDate = (date) => new Date(date.getTime() + getRandomInteger(1, 30) * 60 * 60 * 1000);

// Generate one point
const point = (date) => {
  const city = generateCity(CITIES);
  const type = generateType();
  const dateFrom = generateDate(date);
  const dateTo = generateDate(dateFrom);

  return {
    type: type,
    city: city,
    basePrice: getRandomInteger(800, 2000),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: generateDestination(city),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    pointOffers: generatePointOffers(type),
  };
};

export const generatePoint = (size) => {
  const points = [];
  let date = new Date();

  for (let i = 0; i < size; i++) {
    const pointItem = point(date);
    pointItem.id = i;
    date = pointItem.dateTo;
    points.push(pointItem);
  }

  return points;
};
