import AbstractView from './abstract.js';

const createFilterTemplate = (filter, currentFilterType) => {
  const { type, name } = filter;

  return (
    `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>
    `
  );
};

const createFiltersTemplate = (filterItems, currentFilterType) => {

  let filtersList = '';
  for (const filterItem of filterItems) {
    console.log(filterItem);
    const filter = createFilterTemplate(filterItem, currentFilterType);
    console.log(filter);
    filtersList = filtersList + filter;
  }
  //const filtersTemplate = filtersItem.map((filter) => createFilterTemplate(filter, currentFilterType)).join('');
  console.log(filtersList);
  return `
    <form class="trip-filters" action="#" method="get">

      ${filtersList}


    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
};


export default class Filters extends AbstractView{
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    const a = createFiltersTemplate(this._filters, this._currentFilter);
    console.log(a);
    return a;
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
