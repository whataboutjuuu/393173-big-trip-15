import AbstractView from './abstract.js';
import { FilterType } from '../utils/constants.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events',
  [FilterType.PAST]: 'There are no past events',
};

const createEmptyTemplate = (filterType) => {
  const noPointTextValue = NoPointTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>
    `);
};


export default class EmptyList extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createEmptyTemplate(this._data);
  }
}
