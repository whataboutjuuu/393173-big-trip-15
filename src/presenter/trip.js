import RouteView from '../view/route.js';
import PointPresenter, { State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import EmptyListView from '../view/emptylist.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointListView from '../view/point-list.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { sortingByPrice, sortingByTime, sortingByDate } from '../utils/utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/constants.js';
import { filter } from '../utils/filter.js';

export default class Trip {
  constructor(container, header, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._container = container;
    this._header = header;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;

    this._pointPresenter = new Map();
    this._isLoading = true;
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SortType.DEFAULT;

    this._sortingComponent = null;
    this._routeComponent = null;
    this._loadingComponent = new LoadingView();
    this._pointListComponent = new PointListView();
    this._emptyListComponent = null;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPoint = {
      type: 'taxi',
      city: '',
      dateFrom: new Date(), dateTo: new Date(),
      basePrice: 0,
      destination: { city: '', description: '', photos: null },
      pointOffers: [],
      isNewPoint: true,
    };
    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction, this._newPoint, this._offersModel, this._destinationsModel);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderPage();
  }

  destroy() {
    this._clearPage({ resetSortType: true });
    remove(this._pointListComponent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._filterType](points);
    switch (this._currentSortType) {
      case SortType.PRICE:
        return filtredPoints.sort(sortingByPrice);
      case SortType.TIME:
        return filtredPoints.sort(sortingByTime);
      case SortType.DEFAULT:
        return filtredPoints.sort(sortingByDate);
    }

    return filtredPoints;
  }

  _renderRoute() {
    const points = this._pointsModel.getPoints();
    remove(this._routeComponent);
    this._routeComponent = new RouteView(points);
    render(this._header, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._container, this._sortingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    this._emptyListComponent = new EmptyListView(this._filterType);
    render(this._container, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPage() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints().slice();
    if (points.length <= 0) {
      this._renderEmptyList();
      return;
    }

    render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
    this._renderRoute();
    this._renderSorting();

    points.forEach((point) => this._renderPoint(point));
  }

  _clearPage({ resetSortType = false } = {}) {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortingComponent);

    if (this._emptyListComponent) {
      remove(this._emptyListComponent);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handlePointChange(updatedPoint) {
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPage();
    this._renderPage();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearPage();
        this._renderPage();
        break;
      case UpdateType.MAJOR:
        this._clearPage();
        this._renderPage();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPage();
        break;
    }
  }
}
