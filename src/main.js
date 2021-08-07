import { getRandomInteger } from './utils.js';

import MenuView from './view/menu.js';
import EmptyListView from './view/emptylist.js';
import FiltersView from './view/filters.js';
import LoadingView from './view/loading.js';
import SortingView from './view/sorting.js';
import PointListView from './view/point-list.js';
import PointView from './view/point.js';
import PointPopupView from './view/point-popup.js';
import RouteView from './view/route.js';

import { generatePoint } from './mock/point.js';
import { render, RenderPosition } from './utils.js';

const pointsCount = getRandomInteger(15, 20);
const isLoading = false;

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const points = generatePoint(pointsCount);

const renderPoint = (pointsContainer, point) => {
  const pointComponent = new PointView(point);
  const pointPopupComponent = new PointPopupView(point);

  const replacePointToForm = () => {
    pointsContainer.replaceChild(pointPopupComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointsContainer.replaceChild(pointComponent.getElement(), pointPopupComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
  });

  pointPopupComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(pointsContainer, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteTabsNavigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

if (isLoading) {
  render(siteMainElement, new LoadingView().getElement(), RenderPosition.BEFOREEND);
} else {
  const pointListComponent = new PointListView();
  render(siteMainElement, pointListComponent.getElement(), RenderPosition.BEFOREEND);

  if (pointsCount !== 0) {
    render(siteHeadingElement, new RouteView(points).getElement(), RenderPosition.AFTERBEGIN);
    render(siteMainElement, new SortingView().getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < pointsCount; i++) {

      renderPoint(pointListComponent.getElement(), points[i]);
    }

  } else {
    render(siteMainElement, new EmptyListView().getElement(), RenderPosition.BEFOREEND);
  }
}
