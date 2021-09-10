import { TYPES } from '../utils/constants.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// Generate destination template with description and photos if exist
const createDestinationTemplate = (destinationsData, city) => {
  const destination = destinationsData.filter((item) => item.name === city);
  const { description, pictures } = destination[0];

  const createPhotoList = () => {
    let photolist = '';
    if (pictures !== null) {
      for (const photocard of pictures) {
        const photo = `<img src='${photocard.src}' class='event__photo' alt='${photocard.description}'/>`;
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
        ${createPhotoList(pictures)}
        </div >
      </div>
    </section>
    `
    :  '';
};

// Generate template of one offer
const createOfferTemplate = (offerData) => {
  const id = `event-offer-${offerData.title.replaceAll(' ', '-')}`;

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="${id}" type="checkbox" name="${offerData.title}"
    ${offerData.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${offerData.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerData.price}</span>
      </label>
    </div>
  `;
};

// Generate offers list if offers exist
const createOffersTemplate = (offers) => {
  let offersList = '';

  for (const item of offers) {
    const offer = createOfferTemplate(item);
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

const createButtonTemplate = (isNewPoint, isDeleting) => {
  let text;

  if (isNewPoint) {
    text = 'Cancel';
  }

  if (!isNewPoint) {
    isDeleting ? text = 'Deleting...' : text = 'Delete';
  }

  return `<button class="event__reset-btn" type="reset">${text}</button>`;
};

const createPointPopupTemplate = (data = {}, destinationsData) => {
  const {
    id,
    type,
    city,
    dateFrom, dateTo,
    basePrice,
    isCitySelected,
    isNewPoint,
    availableOffers,
    isSaving,
    isDeleting,
  } = data;
  const destinations = destinationsData;
  const valueDateFrom = dayjs(dateFrom).format('DD/MM/YYYY HH:mm');
  const valueDateTo = dayjs(dateTo).format('DD/MM/YYYY HH:mm');
  const citiesList = destinations.map((item) => item.name);

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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createCityList(citiesList)}
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
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>

        ${createButtonTemplate(isNewPoint, isDeleting )}


        ${!isNewPoint ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button >' : ''}
      </header>
      <section class="event__details">
        ${availableOffers.length > 0 ? createOffersTemplate(availableOffers) : ''}

        ${isCitySelected ? createDestinationTemplate(destinations, city) : ''}
      </section>
    </form>
  </li>
  `;
};

export default class PointPopup extends SmartView {
  constructor(point, offersModel, destinationsModel) {
    super();
    this._offersModel = offersModel.getOffers();
    this._destinationsModel = destinationsModel.getDestinations();
    this._data = PointPopup.parsePointToData(point, this._offersModel);
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._pointTypeHandler = this._pointTypeHandler.bind(this);
    this._pointCitySelect = this._pointCitySelect.bind(this);
    this._pointPriceInput = this._pointPriceInput.bind(this);
    this._pointOffersHandler = this._pointOffersHandler.bind(this);
    this._pointDateFromChangeHandler = this._pointDateFromChangeHandler.bind(this);
    this._pointDateToChangeHandler = this._pointDateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  reset(point) {
    this.updateData(
      PointPopup.parsePointToData(point, this._offersModel),
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
    return createPointPopupTemplate(this._data, this._destinationsModel);
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _pointTypeHandler(evt) {
    evt.preventDefault();
    const type = evt.target.value;
    this.updateData({
      type: type,
      availableOffers: this._offersModel.find((item) => item.type === type).offers,
    }, false);
  }

  _pointCitySelect(evt) {
    evt.preventDefault();
    const cityValue = evt.target.value;
    const cityList = this._destinationsModel.map((city) => city.name);
    if (cityList.includes(cityValue)) {
      this.updateData({
        city: cityValue,
        destination: this._destinationsModel.find((city) => city.name === cityValue),
        isCitySelected: cityValue.length > 0,
      }, false);
    } else {
      throw new Error('Unfortunatelly you can not add this city');
    }
  }

  _pointPriceInput(evt) {
    evt.preventDefault();
    if (evt.target.value > 0) {
      this.updateData({
        basePrice: Number(evt.target.value),
      }, true);
    } else {
      throw new Error('Incorrect price!');
    }
  }

  _pointOffersHandler(evt) {
    evt.preventDefault();
    for (const offer of this._data.availableOffers) {
      if (offer.title === evt.target.name) {
        offer.isChecked = !offer.isChecked;
      }
    }

    this._data.checkedOffers = this._data.availableOffers.filter((offer) => offer.isChecked);


    this.updateData({
      pointOffers: Object.assign(
        {},
        this._data.checkedOffers,
      ),
    }, true);
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
    if (!this._data.isNewPoint) {
      this.setPopupCloseHandler(this._callback.popupClose);
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._pointTypeHandler);
    this.getElement().querySelector('.event__field-group--destination').addEventListener('change', this._pointCitySelect);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._pointPriceInput);

    if (this._data.availableOffers.length > 0) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._pointOffersHandler);
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointPopup.parseDataToPoint(this._data));
  }

  static parsePointToData(point, offersModel) {

    if (point === undefined) {
      point = {
        type: 'taxi',
        city: '',
        dateFrom: new Date(), dateTo: new Date(),
        basePrice: 0,
        destination: { city: '', description: '', photos: null },
        isFavorite: false,
        pointOffers: [],
        isNewPoint: true,
      };
    }

    let offers = offersModel.find((item) => item.type === point.type).offers;
    offers = offers.map((offer) => ({ ...offer }));

    for (const offer of offers) {
      offer['isChecked'] = Object.values(point.pointOffers).some((pointOffer) => pointOffer.title === offer.title);
    }

    const data = Object.assign(
      {},
      point,
      {
        isCitySelected: point.city !== '',
        checkedOffers: point.pointOffers,
        availableOffers: offers,
        isSaving: false,
        isDeleting: false,
      },
    );

    return data;
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    data.pointOffers = Object.values(data.checkedOffers);

    delete data.isCitySelected;
    delete data.checkedOffers;
    delete data.availableOffers;
    delete data.isNewPoint;
    delete data.pointOffers.isChecked;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
