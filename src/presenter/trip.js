import RouteView from '../view/route.js';
import PointPresenter from './point.js';
import EmptyListView from '../view/emptylist.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointListView from '../view/point-list.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { sortingByPrice, sortingByTime, sortingByDate } from '../utils/utils.js';
import { SortType, UpdateType, UserAction } from '../utils/constants.js';
import { filter } from '../utils/filter.js';

export default class Trip {
  constructor(container, header, pointsModel, filterModel) {
    this._container = container;
    this._header = header;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._points = this._getPoints();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._sourcePoints = this._getPoints();
    this._routeComponent = new RouteView(this._points);
    this._sortingComponent = null;
    this._loadingComponent = new LoadingView();
    this._pointListComponent = new PointListView();
    this._emptyListComponent = new EmptyListView();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderPage();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

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
    render(this._container, this._emptyListComponent, RenderPosition.BEFOREEND);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPage() {
    const points = this._getPoints().slice();

    if (points.length <= 0) {
      this._renderEmptyList();
      return;
    }

    render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
    this._renderRoute(points);
    this._renderSorting();

    points.forEach((point) => this._renderPoint(point));
  }

  _clearPage({ resetSortType = false } = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handlePointChange(updatedPoint) {

    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
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
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
    }
  }
}
