import AbstractView from './abstract.js';

const createFilterTemplate = (filter, currentFilterType) => {
  const { type, name, isDisabled } = filter;

  return (
    `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${isDisabled? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>
    `
  );
};

const createFiltersTemplate = (filters, currentFilterType) =>
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;

export default class Filters extends AbstractView{
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
