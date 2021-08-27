import { TYPES, CITIES } from '../utils/constants.js';
import { generateOffersByType } from '../mock/offers.js';
import { generateDestination } from '../mock/destination.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// Generate destination template with description and photos if exist
const createDestinationTemplate = (destination) => {
  const {description, photos } = destination;

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
const createOffersTemplate = (type, data) => {
  let offersList = '';
  const offers = generateOffersByType(type);

  if (offers.length === 0) {
    return '';
  }

  for (const item of offers) {
    const offer = createOfferTemplate(item, data.pointOffers);
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

const createPointPopupTemplate = (data = {}) => {

  const {
    id,
    type = TYPES[5],
    city,
    dateFrom, dateTo,
    basePrice,
    destination = { city: city, description: '', photos: null },
    isCitySelected,
  } = data;

  const valueDateFrom = dayjs(dateFrom).format('DD/MM/YYYY HH:mm');
  const valueDateTo = dayjs(dateTo).format('DD/MM/YYYY HH:mm');

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypesList(TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.city}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createCityList(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${valueDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${valueDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>
      </header>
      <section class="event__details">
        ${createOffersTemplate(type, data)}
        ${isCitySelected ? createDestinationTemplate(destination) : ''}
      </section>
    </form>
  </li>
  `;
};

export default class PointPopup extends SmartView {
  constructor(point) {
    super();
    this._data = PointPopup.parsePointToData(point);
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._pointTypeHandler = this._pointTypeHandler.bind(this);
    this._pointCitySelect = this._pointCitySelect.bind(this);
    this._pointDateFromChangeHandler = this._pointDateFromChangeHandler.bind(this);
    this._pointDateToChangeHandler = this._pointDateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  reset(point) {
    this.updateData(
      PointPopup.parsePointToData(point),
    );
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerTo || this._datepickerFrom) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }
  }

  getTemplate() {
    return createPointPopupTemplate(this._data);
  }

  _popupCloseHandler() {
    this._callback.popupClose();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointPopup.parseDataToPoint(this._data));
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

  // TODO: separate Cancel from Delete
  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }


  _pointTypeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
    }, false);
  }

  _pointCitySelect(evt) {
    evt.preventDefault();

    this.updateData({
      city: evt.target.value,
      destination: generateDestination(evt.target.value),
      isCitySelected: evt.target.value.length>0,
    }, false);
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('.event__field-group--time input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._data.dateFrom,
        maxDate: this._data.dateTo,
        onChange:this._pointDateFromChangeHandler,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('.event__field-group--time input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._data.dateTo,
        minDate: this._data.dateFrom,
        onChange: this._pointDateToChangeHandler,
      },
    );
  }

  _pointDateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    }, true);
  }

  _pointDateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setPopupCloseHandler(this._callback.popupClose);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._pointTypeHandler);
    this.getElement().querySelector('.event__field-group--destination').addEventListener('change', this._pointCitySelect);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointPopup.parseDataToPoint(this._data));
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {isCitySelected: point.city !== ''},
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isCitySelected;
    return data;
  }
}
