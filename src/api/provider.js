import PointsModel from '../model/points.js';
import { isOnline } from '../utils/utils.js';


const getSyncedPoints = (items) =>
  items.filter(({ success }) => success).map(({ payload }) => payload.point);

const createStoreStructure = (items) =>
  items.reduce((acc, current) => Object.assign(
    {},
    acc,
    {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, storePoints, storeOffers, storeDestinations) {
    this._api = api;
    this._storePoints = storePoints;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;

  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          console.log(points);
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          console.log(items);
          this._storePoints.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._storePoints.getItems());
    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._storeDestinations.setItems(destinations);
          return destinations;
        });
    }
    return Promise.resolve(this._storeDestinations.getItems());
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._storeOffers.setItems(offers);
          return offers;
        });
    }
    return Promise.resolve(this._storeOffers.getItems());
  }

  getData() {
    return Promise.all([this.getPoints(), this.getOffers(), this.getDestinations()]);
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._storePoints.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._storePoints.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._storePoints.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._storePoints.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._storePoints.getItems());
      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._storePoints.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
