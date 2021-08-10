import { getRandomInteger } from './utils/utils.js';
import { render, RenderPosition, replace } from './utils/render.js';

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
    replace(pointPopupComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointPopupComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setPopupOpenHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointPopupComponent.setPopupCloseHandler(() => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointPopupComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
  });

  pointPopupComponent.setFormResetHandler(() => {
    replaceFormToPoint();
  });

  render(pointsContainer, pointComponent, RenderPosition.BEFOREEND);
};

render(siteTabsNavigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);

if (isLoading) {
  render(siteMainElement, new LoadingView(), RenderPosition.BEFOREEND);
} else {
  const pointListComponent = new PointListView();
  render(siteMainElement, pointListComponent, RenderPosition.BEFOREEND);

  if (pointsCount !== 0) {
    render(siteHeadingElement, new RouteView(points), RenderPosition.AFTERBEGIN);
    render(siteMainElement, new SortingView(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < pointsCount; i++) {
      renderPoint(pointListComponent, points[i]);
    }

  } else {
    render(siteMainElement, new EmptyListView(), RenderPosition.BEFOREEND);
  }
}
