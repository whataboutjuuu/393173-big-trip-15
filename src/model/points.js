import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }


  updatePoint (updateType, update) {
    const index = this._points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting point');
    }

    this._points = [...this._points.slice(0, index), update, ...this._points.slice(index + 1)];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update, ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can not delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basePrice: point['base_price'],
        dateFrom: point['date_from'],
        dateTo: point['date_to'],
        isFavorite: point['is_favorite'],
        pointOffers: point.offers,
        city: point.destination.name,
      });

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basePrice,
        'date_from': point.dateFrom,
        'date_to': point.dateTo,
        'is_favorite': point.isFavorite,
        'offers': point.pointOffers,
        'destination': {
          'name': point.city,
          'description': point.destination.description,
          'pictures':point.destination.pictures,
        },
      },
    );

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.pointOffers;
    delete adaptedPoint.city;

    return adaptedPoint;
  }
}
