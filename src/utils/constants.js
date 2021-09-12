export const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const SortType = {
  DEFAULT: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};
