import { createRouteTemplate } from './view/route.js';
import { createMenuTemplate } from './view/menu.js';
import { createFiltersTemplate } from './view/filters.js';
import { createEventTemplate } from './view/event.js';
import { createSortingTemplate } from './view/sorting.js';

import { createLoadingTemplate } from './view/loading.js';
import { createEmptyTemplate } from './view/emptylist.js';

const EVENTS_COUNT = 0;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const siteEventsListElement = document.createElement('ul');
siteEventsListElement.classList.add('trip-events__list');
siteMainElement.insertAdjacentElement('beforeend', siteEventsListElement);


render(siteHeadingElement, createRouteTemplate(), 'afterbegin');
render(siteTabsNavigationElement, createMenuTemplate(), 'beforeend');
render(siteFiltersElement, createFiltersTemplate(), 'beforeend');

render(siteEventsListElement, createSortingTemplate(), 'beforebegin');
if (EVENTS_COUNT != 0) {
  for (let i = 0; i < EVENTS_COUNT; i++) {
    render(siteEventsListElement, createEventTemplate(), 'afterbegin');
  }
} else {
  render(siteMainElement, createEmptyTemplate(), 'beforeend');
}


// loading
render(siteMainElement, createLoadingTemplate(), 'beforeend');
