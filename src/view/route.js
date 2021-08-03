import dayjs from 'dayjs';
// eslint-disable-next-line no-undef
const minMax = require('dayjs/plugin/minMax');
dayjs.extend(minMax);

export const createRouteTemplate = (points) => {

  const cities = points.map((point) => point.city);
  let route = '';
  const uniqueCities = [...new Set(cities)];

  const startDates = points.map((point) => point.date.dateStart);
  const finishDates = points.map((point) => point.date.dateFinish);

  const startDate = dayjs.min(startDates).format('MMM DD');
  const finishDate = dayjs.max(finishDates).format('DD');

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

  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${route}

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>
  `;
};
