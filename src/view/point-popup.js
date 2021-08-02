import { TYPES, CITIES } from '../constants.js';
import { generateOffers } from '../mock/offers.js';

const createDestinationTemplate = (destination) => {
  const { description, photos } = destination;

  const createPhotoList = () => {
    let photolist = '';
    for (let i = 0; i < photos.length; i++) {
      const photo = `<img src='${photos[i]}' alt='Event photo'/>`;
      photolist = photolist + photo;
    }

    return photolist;
  };

  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${createPhotoList(photos)}
      </div >
    </div>
  </section>
  `;
};


const createOfferTemplate = (offerData) => (
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="${offerData.name}" type="checkbox" name="${offerData.name}"
    ${offerData.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${offerData.name}">
        <span class="event__offer-title">${offerData.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerData.price}</span>
      </label>
    </div>
  `);

const createOffersTemplate = (type) => {
  let offersList = '';
  if (generateOffers(type).offers === null) {
    return '';
  } else {
    const offers = generateOffers(type).offers;

    for (let i = 0; i < offers.length; i++) {
      const offer = createOfferTemplate(offers[i]);
      offersList = offersList + offer;
    }

    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersList}
        </div>
      </section>
    `;
  }
};

const createCityList = (cities) => {
  let cityList = '';
  for (let i = 0; i < cities.length; i++) {
    const city =
      `
      <option value="${cities[i]}"></option>
      `;
    cityList = cityList + city;
  }

  return cityList;
};

const createTypesList = () => {
  let typesList = '';
  for (let i = 0; i < TYPES.length; i++) {
    const type =
      `
      <div class="event__type-item">
        <input id="event-type-${TYPES[i]}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${TYPES[i]}">
        <label class="event__type-label  event__type-label--${TYPES[i]}" for="event-type-${TYPES[i]}-1">${TYPES[i]}</label>
      </div>
      `;
    typesList = typesList + type;
  }

  return typesList;
};

export const createPointPopupTemplate = (point = {}) => {
  const {
    type = null,
    destination = '',
  } = point;

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypesList(TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createCityList(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${createOffersTemplate(type)}

        ${createDestinationTemplate(destination)}

      </section>
    </form>
  </li>
  `;

};
