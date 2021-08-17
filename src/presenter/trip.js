import RouteView from '../view/route.js';
import PointPresenter from './point.js';
import EmptyListView from '../view/emptylist.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointListView from '../view/point-list.js';
import { render, RenderPosition } from '../utils/render.js';
import { updateItem, sortingByPrice, sortingByTime } from '../utils/utils.js';
import { SortType } from '../utils/constants.js';

const isLoading = false;

export default class Trip {
  constructor(container, header, points) {
    this._container = container;
    this._header = header;
    this._points = points.slice();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._sourcePoints = points.slice();
    this._routeComponent = new RouteView(this._points);
    this._sortingComponent = new SortingView();
    this._loadingComponent = new LoadingView();
    this._pointListComponent = new PointListView();
    this._emptyListComponent = new EmptyListView();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderPointList();
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

  _renderPointList() {
    if (isLoading) {
      this._renderLoading();
    } else {
      if (this._points.length === 0) {
        this._renderEmptyList();
      } else {
        render(this._container, this._pointListComponent, RenderPosition.BEFOREEND);
        this._renderRoute(this._points);
        this._renderSorting();
        this._renderPoints();
      }
    }
  }

  _renderPoints() {
    for (let i = 0; i < this._points.length; i++) {
      this._renderPoint(this._points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearPointsList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcePoints = updateItem(this._sourcePoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._points.sort(sortingByPrice);
        break;
      case SortType.TIME:
        this._points.sort(sortingByTime);
        break;
      default:
        this._points = this._sourcePoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPoints();
  }
}
