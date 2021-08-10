import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createRouteTemplate = (points) => {
  let startDates = points.map((point) => point.dateFrom);
  let finishDates = points.map((point) => point.dateTo);
  startDates = [...new Set(startDates)];
  startDates = dayjs(startDates[0]).format('MMM DD');
  finishDates = [...new Set(finishDates)];
  finishDates = dayjs(finishDates[finishDates.length - 1]).format('DD');

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
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
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
