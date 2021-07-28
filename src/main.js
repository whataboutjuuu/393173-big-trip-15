import { createRouteTemplate } from './view/route.js';
import { createMenuTemplate } from './view/menu.js';
import { createFiltersTemplate } from './view/filters.js';
import { createPointTemplate } from './view/point.js';
import { createPointPopupTemplate } from './view/point-popup.js';
import { createSortingTemplate } from './view/sorting.js';

import { createLoadingTemplate } from './view/loading.js';
import { createEmptyTemplate } from './view/emptylist.js';

const EVENTS_COUNT = 3;
const isLoading = false;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.trip-events');
const siteHeadingElement = document.querySelector('.trip-main');
const siteTabsNavigationElement = siteHeadingElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeadingElement.querySelector('.trip-controls__filters');

render(siteTabsNavigationElement, createMenuTemplate(), 'beforeend');
render(siteFiltersElement, createFiltersTemplate(), 'beforeend');

if (isLoading) {
  render(siteMainElement, createLoadingTemplate(), 'beforeend');
} else {
  const siteEventsListElement = document.createElement('ul');
  siteEventsListElement.classList.add('trip-events__list');
  siteMainElement.insertAdjacentElement('beforeend', siteEventsListElement);

  if (EVENTS_COUNT !== 0) {
    render(siteHeadingElement, createRouteTemplate(), 'afterbegin');
    render(siteEventsListElement, createSortingTemplate(), 'beforebegin');

    for (let i = 0; i < EVENTS_COUNT; i++) {
      if (i === 0) {
        render(siteEventsListElement, createPointPopupTemplate(), 'beforeend');
      } else {
        render(siteEventsListElement, createPointTemplate(), 'beforeend');
      }
    }
  } else {
    render(siteMainElement, createEmptyTemplate(), 'beforeend');
  }
}
