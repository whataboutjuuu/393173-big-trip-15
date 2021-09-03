import AbstractView from './abstract.js';
import { MenuItem } from '../utils/constants.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATS}">${MenuItem.STATS}</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const activeMenu = evt.target.dataset.value;
    this.setMenuItem(activeMenu);
    this._callback.menuClick(evt.target.dataset.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');
    menuItems.forEach((element) => element.classList.remove('trip-tabs__btn--active'));

    if (menuItem !== null) {
      this.getElement().querySelector(`[data-value=${menuItem}]`).classList.add('trip-tabs__btn--active');
    }
  }
}
