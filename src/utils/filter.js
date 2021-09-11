
import { FilterType } from './constants.js';
import { isAllFiltersDate, isFutureDateStart, isPastDateFinish } from './utils.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDateStart(point.dateFrom) || isAllFiltersDate(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDateFinish(point.dateTo) || isAllFiltersDate(point.dateFrom, point.dateTo)),
};
