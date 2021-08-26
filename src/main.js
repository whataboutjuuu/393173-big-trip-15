import { getRandomInteger } from './utils/utils.js';
import { render, RenderPosition } from './utils/render.js';
import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip.js';
import { generatePoint } from './mock/point.js';
import PointsModel from './model/points.js';

const pointsCount = getRandomInteger(15, 20);


const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const points = generatePoint(pointsCount);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripPresenter = new TripPresenter(siteMainElement, siteHeadingElement, pointsModel);

render(siteTabsNavigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FiltersView(), RenderPosition.BEFOREEND);

tripPresenter.init();
