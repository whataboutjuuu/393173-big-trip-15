import PointView from '../view/point.js';
import PointPopupView from '../view/point-popup.js';
import { render, replace, RenderPosition, remove } from '../utils/render.js';

export default class Point {
  constructor(container) {
    this._container = container;
    this._pointComponent = null;
    this._pointPopupComponent = null;
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointPopupComponent = this._pointPopupComponent;

    this._pointComponent = new PointView(point);
    this._pointPopupComponent = new PointPopupView(point);

    this._pointComponent.setPopupOpenHandler(this._handleOpenPopup);
    this._pointPopupComponent.setPopupCloseHandler(this._handleClosePopup);
    this._pointPopupComponent.setFormSubmitHandler(this._handleClosePopup);
    this._pointPopupComponent.setFormResetHandler(this._handleClosePopup);

    if (prevPointComponent === null || prevPointPopupComponent === null) {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._container.getElement().contains(prevPointPopupComponent.getElement())) {
      replace(this._pointPopupComponent, prevPointPopupComponent);
    }

    remove(prevPointComponent);
    remove(prevPointPopupComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointPopupComponent);
  }

  _replacePointToForm(){
    replace(this._pointPopupComponent, this._pointComponent);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointPopupComponent);
  }

  _onEscKeyDown(evt){
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleOpenPopup() {
    this._replacePointToForm();
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleClosePopup(){
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

}
