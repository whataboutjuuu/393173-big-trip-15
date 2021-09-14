const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');

toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

const toast = (message) => {

  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');
  toastContainer.append(toastItem);
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: #961515;
    padding: 20px;
    border-radius: 4px;
    color: #fff;
  `;
  setTimeout(() => {
    toastItem.remove();
    toastContainer.remove();
  }, SHOW_TIME);
};

export { toast };
