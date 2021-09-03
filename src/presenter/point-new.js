import PointPopup from '../view/point-popup';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../utils/constants';

export default class PointNew {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._pointPopupComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointPopupComponent !== null) {
      return;
    }


    this._pointPopupComponent = new PointPopup();
    this._pointPopupComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointPopupComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._container, this._pointPopupComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointPopupComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointPopupComponent);
    this._pointPopupComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({ id: 100 }, point),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
