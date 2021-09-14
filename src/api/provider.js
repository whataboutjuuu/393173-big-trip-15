import PointsModel from '../model/points.js';
import { isOnline } from '../utils/utils.js';


const getSyncedPoints = (items) =>
  items.filter(({ success }) => success).map(({ payload }) => payload.point);

const createStoreStructure = (items, key) =>
  items.reduce((acc, current) => ({ ...acc, [current[key]]: current }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer), 'id');
          this._store.setItems(items, 'points');
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems('points'));
    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations, 'name');
          this._store.setItems(items, 'destinations');
          return destinations;
        });
    }
    const storeDestinations = Object.values(this._store.getItems('destinations'));

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers, 'type');
          this._store.setItems(items, 'offers');
          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getItems('offers'));
    return Promise.resolve(storeOffers);
  }

  getData() {
    return Promise.all([this.getPoints(), this.getOffers(), this.getDestinations()]);
  }

  updatePoint(point) {
    const storePoints = this._store.getItems('points');
    storePoints[point.id] = PointsModel.adaptToServer(point);

    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(storePoints, 'points');
          return updatedPoint;
        });
    }

    this._store.setItem(storePoints, 'points');

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          const storePoints = this._store.getItems('points');
          storePoints[newPoint.id] = PointsModel.adaptToServer(newPoint);
          this._store.setItem(storePoints, 'points');
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => {
          const storePoints = this._store.getItems('points');
          delete storePoints[point.id];
          this._store.setItems(storePoints, 'points');
        });
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems('points'));

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints], 'id');

          this._store.setItems(items, 'points');
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
