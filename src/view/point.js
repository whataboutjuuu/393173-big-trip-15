import dayjs from 'dayjs';

const formatDate = (date, format) => dayjs(date).format(format);

// Get difference between start and finish date in defined format
const getTimeDifference = (dateFrom, dateTo) => {
  dateFrom = dayjs(dateFrom);
  dateTo = dayjs(dateTo);
  let diff = dateTo.diff(dateFrom);

  if (diff / 60000 / 60 < 1) {
    diff = dayjs(diff).format('mm[M]');
  } else if (diff / 60000 / 60 >= 1 && diff / 60000 / 60 < 24) {
    diff = dayjs(diff).format('HH[H] mm[M]');
  } else {
    diff = dayjs(diff).format('DD[D] HH[H] mm[M]');
  }

  return diff;
};

// Generate list of offers that checked
const createOffersList = (offersArray) => {

  let offersListTemplate = '';
  for (const offersItem of offersArray) {
    const offersList = offersItem.offers;

    for (const offersListItem of offersList) {
      const offer =
        `<li class="event__offer">
        <span class="event__offer-title">${offersListItem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offersListItem.price}</span>
      </li>
    `;
      offersListTemplate = offersListTemplate + offer;
    }
  }

  return offersListTemplate;
};

export const createPointTemplate = (point) => {

  const { dateFrom, dateTo, basePrice, isFavorite, type, city, pointOffers } = point;

  const datetimeStart = formatDate(dateFrom, 'YYYY-MM-DDTHH:mm');
  const datetimeFinish = formatDate(dateTo, 'YYYY-MM-DDTHH:mm');
  const difference = getTimeDifference(dateFrom, dateTo);
  const formattedDateFrom = formatDate(dateFrom, 'MMM D');
  const formattedTimeFrom = formatDate(dateFrom, 'HH:mm');
  const formattedTimeTo = formatDate(dateTo, 'HH:mm');

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${datetimeStart}">${formattedDateFrom}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${datetimeStart}">${formattedTimeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${datetimeFinish}">${formattedTimeTo}</time>
        </p>
        <p class="event__duration">${difference}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersList(pointOffers)}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};
