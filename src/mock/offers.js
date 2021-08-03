import { allOffers } from './allOffers';


// Generate offers for type of point
export const generateOffersByType = (type) => {
  const offers = allOffers.filter((offer) => offer.type === type);

  return offers.length < 1 ? [] : offers;
};

export const generatePointOffers = (type) => {
  const pointOffers = generateOffersByType(type);

  return pointOffers;
};
