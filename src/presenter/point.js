import PointView from '../view/point.js';
import PointPopupView from '../view/point-popup.js';
import { render, replace, RenderPosition, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../utils/constants.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Point {
  constructor(container, changeData, changeMode, offersModel, destinationsModel) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointPopupComponent = null;
    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointPopupComponent = this._pointPopupComponent;
    this._pointComponent = new PointView(this._point);
    this._pointPopupComponent = new PointPopupView(this._point, this._offersModel, this._destinationsModel);

    this._pointComponent.setPopupOpenHandler(this._handleOpenPopup);
    this._pointPopupComponent.setPopupCloseHandler(this._handleClosePopup);
    this._pointPopupComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointPopupComponent.setFormResetHandler(this._handleClosePopup);
    this._pointPopupComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevPointPopupComponent === null) {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._pointPopupComponent, prevPointPopupComponent);
    }

    remove(prevPointComponent);
    remove(prevPointPopupComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._pointPopupComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointPopupComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointPopupComponent.reset(this._point);
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleOpenPopup() {
    this._replacePointToForm();
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleClosePopup() {
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleFormSubmit(update) {
    const currentDate = new Date();
    const isMajorUpdate = this._point.city === update.city || this._point.basePrice === update.basePrice;
    const isMinorUpdate = currentDate < update.dateFrom;
    let updateType = UpdateType.PATCH;

    if (isMajorUpdate) {
      updateType = UpdateType.MAJOR;
    } else if(isMinorUpdate){
      updateType = UpdateType.MINOR;
    }

    this._changeData(
      UserAction.UPDATE_POINT,
      updateType,
      update,
    );
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point, { isFavorite: !this._point.isFavorite }),
    );
  }

  _handleDeleteClick(point) {

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }
}
