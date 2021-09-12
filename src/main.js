
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
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const STORE_VER = 'v15';
const StoreNames = {
  POINTS: `big-trip-points-localstorage-${STORE_VER}`,
  OFFERS: `big-trip-offers-localstorage-${STORE_VER}`,
  DESTINATIONS: `big-trip-destinations-localstorage-${STORE_VER}`,
};

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

const storePoints = new Store(StoreNames.POINTS, window.localStorage);
const storeOffers = new Store(StoreNames.OFFERS, window.localStorage);
const storeDestinations = new Store(StoreNames.DESTINATIONS, window.localStorage);
const api = new Api(END_POINT, AUTHORIZATION);
const apiWithProvider = new Provider(api, storePoints, storeOffers, storeDestinations);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const siteMenuComponent = new MenuView();
const filterModel = new FilterModel();
const errorMessage = new ErrorMessageView();
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

apiWithProvider.getData().then((data) => {
  const [points, offers, destinations] = data;
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

}).catch(() => {
  render(siteMainElement, errorMessage, RenderPosition.AFTERBEGIN);
  pointsModel.setPoints(UpdateType.INIT, []);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(siteTabsNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});


window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
