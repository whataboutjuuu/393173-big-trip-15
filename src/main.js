import { getRandomInteger } from './utils/utils.js';
import { render, RenderPosition, remove } from './utils/render.js';
import MenuView from './view/menu.js';
import { MenuItem } from './utils/constants.js';
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
const addButtonComponent = siteHeadingElement.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(siteMainElement, siteHeadingElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();

const handleNewPointFormClose = () => {
  addButtonComponent.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};


addButtonComponent.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handleNewPointFormClose);
  addButtonComponent.disabled = true;
});

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      addButtonComponent.disabled = false;
      siteFiltersElement.style.pointerEvents = 'all';
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatsisticsView(pointsModel.getPoints());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      addButtonComponent.disabled = true;
      siteFiltersElement.style.pointerEvents= 'none';
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

