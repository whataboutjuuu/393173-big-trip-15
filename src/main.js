import { getRandomInteger } from './utils/utils.js';
import { render, RenderPosition } from './utils/render.js';
import MenuView from './view/menu.js';
// import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import { generatePoint } from './mock/point.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

const pointsCount = getRandomInteger(15, 20);

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const points = generatePoint(pointsCount);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(siteMainElement, siteHeadingElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

render(siteTabsNavigationElement, new MenuView(), RenderPosition.BEFOREEND);


filterPresenter.init();
tripPresenter.init();
