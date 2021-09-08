import AbstractView from './abstract.js';
import dayjs from 'dayjs';


const calculatePrice = (points) => {
  let basePrices = points.map((point) => point.basePrice);
  basePrices = basePrices.reduce((a, b) => a + b);

  let offersPrices = points.map((point) => point.pointOffers).flat();
  offersPrices = offersPrices.map((offer) => offer.price);
  offersPrices = offersPrices.reduce((a, b) => a + b);

  return basePrices + offersPrices;
};

const createRouteTemplate = (points) => {
  let startDates = points[0].dateFrom;
  let finishDates = points[points.length-1].dateTo;
  startDates = dayjs(startDates).format('MMM DD');
  finishDates = dayjs(finishDates).format('DD');

  const cities = points.map((point) => point.city);
  let route = '';
  const uniqueCities = [...new Set(cities)];

  if (uniqueCities.length > 3) {
    route =
    `
    <h1 class="trip-info__title">${uniqueCities[0]} &mdash; ... &mdash; ${uniqueCities[uniqueCities.length - 1]}</h1>
    `;
  } else{
    route =
    `
    <h1 class="trip-info__title">${uniqueCities[0]} &mdash; ${uniqueCities[1]} &mdash; ${uniqueCities[2]}</h1>
    `;
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${route}

      <p class="trip-info__dates">${startDates}&nbsp;&mdash;&nbsp;${finishDates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculatePrice(points)}</span>
    </p>
  </section>
  `;
};

export default class Route extends AbstractView{
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createRouteTemplate(this._point);
  }
}
