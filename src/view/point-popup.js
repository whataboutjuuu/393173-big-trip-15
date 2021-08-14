import { TYPES, CITIES } from '../utils/constants.js';
import { generateOffersByType } from '../mock/offers.js';
import AbstractView from './abstract.js';

// Generate destination template with description and photos if exist
const createDestinationTemplate = (destination) => {
  const { description, photos } = destination;

  const createPhotoList = () => {
    let photolist = '';
    if (photos !== null) {
      for (const photocard of photos) {
        const photo = `<img src='${photocard}' class='event__photo' alt='Event photo'/>`;
        photolist = photolist + photo;
      }
    }

    return photolist;
  };

  const conditiontoDisplay = description !== '' && createPhotoList() !== '';

  return conditiontoDisplay
    ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${createPhotoList(photos)}
        </div >
      </div>
    </section>
    `
    :  '';
};

// Generate template of one offer
const createOfferTemplate = (offerData, pointOffers) => {
  const isChecked = pointOffers.some((pointOffer) => pointOffer.title === offerData.title);
  const id = `event-offer-${offerData.title.replaceAll(' ', '-')}`;

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="${id}" type="checkbox" name="${offerData.title}"
    ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${offerData.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerData.price}</span>
      </label>
    </div>
  `;
};

// Generate offers list if offers exist
const createOffersTemplate = (type, point) => {
  let offersList = '';
  const offers = generateOffersByType(type);

  if (offers.length === 0) {
    return '';
  }

  for (const item of offers) {
    const offer = createOfferTemplate(item, point.pointOffers);
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
};

// Generate cities list for input
const createCityList = (cities) => {
  let cityList = '';
  for (const city of cities) {
    const cityOption =
      `
      <option value="${city}"></option>
      `;
    cityList = cityList + cityOption;
  }

  return cityList;
};

// Generate list of types for selector
const createTypesList = () => {
  let typesList = '';
  for (const type of TYPES) {
    const typeItem =
      `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>
      `;
    typesList = typesList + typeItem;
  }

  return typesList;
};

const createPointPopupTemplate = (point = {}) => {
  const {
    type = TYPES[5],
    destination = { description:'', photos: null},
  } = point;

  return `<li class="trip-events__item">
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
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>
      </header>
      <section class="event__details">
        ${createOffersTemplate(type, point)}

        ${createDestinationTemplate(destination)}

      </section>
    </form>
  </li>
  `;
};

export default class PointPopup extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
  }

  getTemplate() {
    return createPointPopupTemplate(this._point);
  }

  _popupCloseHandler() {
    this._callback.popupClose();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  setPopupCloseHandler(callback) {
    this._callback.popupClose = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._popupCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector('.event--edit').addEventListener('reset', this._formResetHandler);
  }
}
