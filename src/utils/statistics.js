import { getDuration } from './utils';

export const getTypesList = (data) => {
  let typesList = data.map((item) => item.type);
  typesList = Array.from(new Set(typesList));

  return typesList;
};

export const sumMoneyByType = (data) => {
  const typesList = getTypesList(data);
  const result = [];

  typesList.forEach((type) => {
    let basePrices = data.filter((el) => el.type === type);
    basePrices = basePrices.map((el) => el.basePrice);
    const sumByType = basePrices.reduce((sum, current) => sum + current);
    result.push(sumByType);
  });

  return result;
};

export const getTypesQuantity = (data) => {
  const typesList = getTypesList(data);
  const result = [];

  typesList.forEach((type) => {
    const typeQuantity = data.filter((el) => el.type === type).length;
    result.push(typeQuantity);
  });

  return result;
};

export const getDurationByType = (data) => {
  const typesList = getTypesList(data);
  const result = [];

  typesList.forEach((type) => {
    const typeList = data.filter((el) => el.type === type);
    const typeDuration = typeList.map((item) => getDuration(item.dateFrom, item.dateTo));
    const sumByType = typeDuration.reduce((sum, current) => sum + current);

    result.push(sumByType);
  });

  return result;
};

export const sortStatsDescending = (labels, values) => {
  const result = [];
  const labelsAndValus = {};

  values.forEach((key, i) => labelsAndValus[key] = labels[i]);
  const sorted = Object.keys(labelsAndValus).map((value) => Number(value));
  sorted.sort((a, b) => b - a);

  sorted.forEach((value) => {
    result.push([value, labelsAndValus[value]]);
  });

  return result;
};
