import dayjs from 'dayjs';
import { getRandomInteger } from '../utils.js';
import { generateDestination } from './destination.js';
// Generate type
const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

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
  }


  return date;
}

// Generate city
const generateCity = () => {
  const cities = ['Amsterdam', 'Chamonix', 'Geneva', 'Warszawa', 'Berlin', 'Dresden', 'Madrid ', 'Lisboa'];

  const randomCityIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomCityIndex];
};


// Offers structure - move to separate file
const getOffersArray = () => {
  const isOffers = Boolean(getRandomInteger(0, 1));
  const offers = [
    {
      name: 'Add luggage',
      price: 30,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      name: 'Switch to comfort class',
      price: 100,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      name: 'Add meal',
      price: 15,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      name: 'Choose seats',
      price: 5,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
    {
      name: 'Travel by train',
      price: 40,
      isChecked: Boolean(getRandomInteger(0, 1)),
    },
  ];

  return isOffers
    ? offers
    : null;

};

export const generatePoint = () => {

  const city = generateCity();

  return {
    type: generateType(),
    city: city,
    price: getRandomInteger(800, 2000),
    date: generateData(),
    destination: generateDestination(city),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersArray(),
  };

};
