import RouteView from '../view/route.js';
import PointPresenter from './point.js';
import EmptyListView from '../view/emptylist.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointListView from '../view/point-list.js';
import { render, RenderPosition } from '../utils/render.js';
import { sortingByPrice, sortingByTime, sortingByDate } from '../utils/utils.js';
import { SortType, UpdateType, UserAction } from '../utils/constants.js';


const isLoading = false;

export default class Trip {
  constructor(container, header, pointsModel) {
    this._container = container;
    this._header = header;
    this._pointsModel = pointsModel;
    this._points = this._getPoints();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._sourcePoints = this._getPoints();
    this._routeComponent = new RouteView(this._points);
    this._sortingComponent = new SortingView();
    this._loadingComponent = new LoadingView();
    this._pointListComponent = new PointListView();
    this._emptyListComponent = new EmptyListView();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderPointsList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortingByPrice);
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortingByTime);
      case SortType.DEFAULT:
        return this._pointsModel.getPoints().slice().sort(sortingByDate);
    }

    return this._pointsModel.getPoints();
  }

  _renderRoute() {
    render(this._header, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

  }

  _renderLoading() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._container, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderPointsList() {
    const points = this._getPoints().slice();
    console.log(points);
    if (points.length <= 0) {
      this._renderEmptyList();
      return;
    }

    render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
    this._renderRoute(points);
    this._renderSorting();
    this._renderPoints(points);
  }

  _renderPoints(points) {
    console.log(points);
    for (let i = 0; i < points.length; i++){
      this._renderPoint(points[i]);
    }
    //points.forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlePointChange(updatedPoint) {

    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  // _sortPoints(sortType) {
  //   switch (sortType) {
  //     case SortType.PRICE:
  //       this._points.sort(sortingByPrice);
  //       break;
  //     case SortType.TIME:
  //       this._points.sort(sortingByTime);
  //       break;
  //     case SortType.DEFAULT:
  //       this._points.sort(sortingByDate);
  //       break;
  //   }

  //   this._currentSortType = sortType;
  // }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
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
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        console.log(this._pointsPresenter);
        this._pointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }
}
