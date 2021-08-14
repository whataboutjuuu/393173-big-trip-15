import RouteView from '../view/route.js';
import PointPresenter from './point.js';
import EmptyListView from '../view/emptylist.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointListView from '../view/point-list.js';
import { render, RenderPosition } from '../utils/render.js';

const isLoading = false;

export default class Trip {
  constructor(container, header, points) {
    this._container = container;
    this._header = header;
    this._points = points.slice();
    this._routeComponent = new RouteView(this._points);
    this._sortingComponent = new SortingView();
    this._loadingComponent = new LoadingView();
    this._pointListComponent = new PointListView();
    this._emptyListComponent = new EmptyListView();
  }

  init() {
    this._renderPointList();
  }

  _renderRoute() {
    render(this._header, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.AFTERBEGIN);
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
    const pointPresenter = new PointPresenter(this._pointListComponent);
    pointPresenter.init(point);
  }
  _renderUpdatedPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent);
    pointPresenter.init(point);
  }
}
