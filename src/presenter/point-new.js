import PointPopup from '../view/point-popup';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../utils/constants';

export default class PointNew {
  constructor(container, changeData, point, offersModel, destinationsModel) {
    this._container = container;
    this._changeData = changeData;
    this._point = point;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointPopupComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, point) {
    this._point = point;
    this._destroyCallback = callback;
    if (this._pointPopupComponent !== null) {
      return;
    }

    this._pointPopupComponent = new PointPopup(this._point, this._offersModel, this._destinationsModel);
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

  setSaving() {
    this._pointPopupComponent.updateData({
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointPopupComponent.updateData({
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointPopupComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    //this.destroy();
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
