import FilterView from '../view/filters.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

import { FilterType, UpdateType } from '../utils/constants.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    //sconst prevFilterComponent = this._filterComponent;
    console.log(this._filterModel.getFilter());
    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
    console.log(this._filterContainer, this._filterComponent);
    // if (prevFilterComponent === null) {
    //   console.log(prevFilterComponent, this._filterComponent);
    //   return;
    // }
    // replace(this._filterComponent, prevFilterComponent);
    // remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
      },
      {
        type: FilterType.PAST,
        name: 'Past',
      },
    ];
  }
}
