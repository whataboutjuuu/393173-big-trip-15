
import { render, RenderPosition, remove } from './utils/render.js';
import MenuView from './view/menu.js';
import { MenuItem, UpdateType } from './utils/constants.js';
import { isOnline } from './utils/utils.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FilterModel from './model/filter.js';
import StatsisticsView from './view/stats.js';
import ErrorMessageView from './view/error.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { toast } from './utils/toast.js';

const AUTHORIZATION = 'Basic IBS7LduqwnZWuYGRo';
const END_POINT = 'https://13.ecmascript.pages.academy/big-trip';

const STORE_VER = 'v15';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const store = new Store(STORE_NAME, window.localStorage);
const api = new Api(END_POINT, AUTHORIZATION);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const siteMenuComponent = new MenuView();
const filterModel = new FilterModel();
const addButtonComponent = siteHeadingElement.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(siteMainElement, siteHeadingElement, pointsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);

const handleNewPointFormClose = () => {
  addButtonComponent.disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

addButtonComponent.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast('You can\'t create new task offline');
    return;
  }
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


filterPresenter.init();
tripPresenter.init();

Promise.all([
  apiWithProvider.getPoints(),
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
]).then(([points, offers, destinations]) => {
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);

  const errorMessage = new ErrorMessageView('Data is not loaded!');
  render(siteMainElement, errorMessage, RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js');
});

const messageOffline = new ErrorMessageView('We\'re offline now!');
window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  if (messageOffline) {
    remove(messageOffline);
  }
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  render(siteMainElement, messageOffline, RenderPosition.AFTERBEGIN);
});
