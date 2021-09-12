const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');

toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message) => {

  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');
  toastContainer.append(toastItem);


  // toastContainer.style.position = 'fixed';
  // toastContainer.style.left = '50%';
  // toastContainer.style.top = '50%';
  // toastContainer.style.transform = 'translate(-50%, -50%)';
  // toastContainer.style.backgroundColor = '#248DEB';
  // toastContainer.style.color = 'white';
  // toastContainer.style.fontSize = '20px';
  // toastContainer.style.fontWeight = '600';
  // toastContainer.style.padding = '30px 50px';
  // toastContainer.style.borderRadius = '15px';

  setTimeout(() => {
    toastItem.remove();
    toastContainer.remove();
  }, SHOW_TIME);
};

export { toast };
