import dayjs from 'dayjs';
import { CITIES, TYPES } from '../constants.js';
import { getRandomInteger } from '../utils.js';
import { generateDestination } from './destination.js';
import { generateOffers } from './offers.js';
// Generate type
const generateType = () => {
  const types = TYPES;

  const randomTypeIndex = getRandomInteger(0, types.length - 1);

  return types[randomTypeIndex];
};

const generateData = () => {
  const futureStartDay = getRandomInteger(0, 7);
  const futureEndDay = getRandomInteger(futureStartDay, 7);
  const dateStart = dayjs().add(futureStartDay, 'day');
  const dateFinish = dayjs().add(futureEndDay, 'day');

  const dateDifference = dateStart.diff(dateFinish, 'minute');

  const date = {
    dateStart: dateStart,
    dateFinish: dateFinish,
    dateDifference: dateDifference,
  };

  return date;
};

// Generate city
const generateCity = () => {
  const randomCityIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomCityIndex];
};

export const generatePoint = () => {

  const city = generateCity(CITIES);
  const type = generateType();

  return {
    type: type,
    city: city,

    price: getRandomInteger(800, 2000),
    date: generateData(),
    destination: generateDestination(city),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOffers(type),
  };

};
