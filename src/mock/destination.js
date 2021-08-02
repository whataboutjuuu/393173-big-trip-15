import { getRandomInteger } from '../utils.js';
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


export const generateDestination = (city) => {

  return {
    city: city,
    description: generateDescription(),
    photos: generatePhotos(),
  };

};
