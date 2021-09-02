
import { FilterType } from './constants.js';
import { isFutureDateStart, isPastDateFinish } from './utils.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDateStart(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDateFinish(point.dateTo)),
};
