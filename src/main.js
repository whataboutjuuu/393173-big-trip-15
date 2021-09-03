import { getRandomInteger } from './utils/utils.js';
import { render, RenderPosition, remove } from './utils/render.js';
import MenuView from './view/menu.js';
import { MenuItem, UpdateType, FilterType } from './utils/constants.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import { generatePoint } from './mock/point.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import StatsisticsView from './view/stats.js';

const pointsCount = getRandomInteger(15, 20);

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const points = generatePoint(pointsCount);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const siteMenuComponent = new MenuView();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(siteMainElement, siteHeadingElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const handleNewPointFormClose = () => {
  siteHeadingElement.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_POINT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.itin();
      tripPresenter.createPoint(handleNewPointFormClose);
      siteMenuComponent.getElement().querySelector(`[data-value=${MenuItem.TABLE}]`).disabled = true;
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatsisticsView(pointsModel.getPoints());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();
