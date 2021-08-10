import { allOffers } from './allOffers';
import { getRandomInteger } from '../utils/utils.js';

// Generate offers for type of point
export const generateOffersByType = (type) => {
  const offers = allOffers.filter((offer) => offer.type === type);

  return offers.length < 1 ? [] : offers[0].offers;
};

// Generate randomly checked offers for type of point
export const generatePointOffers = (type) => {
  let pointOffers = generateOffersByType(type);

  if (pointOffers.length > 0) {
    pointOffers = pointOffers.slice(0, getRandomInteger(0, pointOffers.length - 1));
  }

  return pointOffers;
};
