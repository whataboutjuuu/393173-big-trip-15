import { getRandomInteger } from '../utils.js';

// Generate type
const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const randomTypeIndex = getRandomInteger(0, types.length - 1);

  return types[randomTypeIndex];
};

// Generate city
const generateCity = () => {
  const cities = ['Amsterdam', 'Chamonix', 'Geneva', 'Warszawa', 'Berlin', 'Dresden', 'Madrid ', 'Lisboa'];

  const randomCityIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomCityIndex];
};


// Generate description
const generateDescription = () => {
  const DESCRIPTION_COUNTER_MAX = 5;
  const DESCRIPTION_COUNTER_MIN = 1;

  const descriptionCount = getRandomInteger(DESCRIPTION_COUNTER_MIN, DESCRIPTION_COUNTER_MAX);

  const descriptionsText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras aliquet varius magna, non porta ligula feugiat eget.Fusce tristique felis at fermentum pharetra.Aliquam id orci ut lectus varius viverra.Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.Sed sed nisi sed augue convallis suscipit in sed felis.Aliquam erat volutpat.Nunc fermentum tortor ac porta dapibus.In rutrum ac purus sit amet tempus.';

  const descriptions = descriptionsText.split('.');

  let descriptionMessage = '';
  for (let i = 1; i < descriptionCount; i++) {
    const randomDescriptionIndex = getRandomInteger(0, descriptions.length - 1);
    descriptionMessage = `${descriptionMessage + descriptions[randomDescriptionIndex]}. `;
  }

  return descriptionMessage;
};

// Generate photos
const generatePhotos = () => {
  const PHOTOS_QUANTITY_MIN = 1;
  const PHOTOS_QUANTITY_MAX = 10;
  const url = 'http://picsum.photos/248/152?r=';
  const photos = [];

  const randomPhotosQuantity = getRandomInteger(PHOTOS_QUANTITY_MIN, PHOTOS_QUANTITY_MAX);

  for (let i = 1; i < randomPhotosQuantity; i++) {
    const randomPhotoIndex = getRandomInteger(0, 100);
    photos.push(`${url + randomPhotoIndex}`);
  }

  return photos;
};

// Destination structure - move to separate file
const getDestinationObject = (city) => ({
  city: city,
  description: generateDescription(),
  photos: generatePhotos(),
});


// Offers structure - move to separate file - offers can be null!!!!!!
const getOffersArray = () => ([
  {
    name: 'Add luggage',
    price: 30,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    name: 'Switch to comfort class',
    price: 100,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    name: 'Add meal',
    price: 15,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    name: 'Choose seats',
    price: 5,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
  {
    name: 'Travel by train',
    price: 40,
    isChecked: Boolean(getRandomInteger(0, 1)),
  },
]);

export const generatePoint = () => {

  const city = generateCity();

  return {
    type: generateType(),
    city: city,
    price: 1100,
    dateStart: '2019-07-10T22:55:56.845Z',
    dateFinish: '2019-07-11T11:22:13.375Z',
    destination: getDestinationObject(city),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersArray(),
  };

};
