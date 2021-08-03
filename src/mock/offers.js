import { getRandomInteger } from '../utils';
// Some offers array
const availableOffers = [
  {
    type: 'flight',
    name: 'Add luggage',
    price: 30,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'flight',
    name: 'Switch to comfort class',
    price: 100,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'flight',
    name: 'Add meal',
    price: 15,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'flight',
    name: 'Choose seats',
    price: 5,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'flight',
    name: 'Travel by train',
    price: 40,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'taxi',
    name: 'Order Uber',
    price: 20,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'sightseeing',
    name: 'Book tickets',
    price: 40,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'sightseeing',
    name: 'Lunch in city',
    price: 30,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'restaurant',
    name: 'Book a table',
    price: 50,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'train',
    name: 'Add luggage',
    price: 20,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    type: 'ship',
    name: 'Switch to comfort class',
    price: 70,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
];

// Generate offers for type of point
const generateOffersByType = (type) => {
  const offers = availableOffers.filter((offer) => offer.type === type);

  return offers.length < 1 ? null : offers;
};

export const generateOffers = (type) => ({
  type: type,
  offers: generateOffersByType(type),
});
