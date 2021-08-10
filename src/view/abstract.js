import { createElement } from '../render.js';

export default class Abstract{
  constructor() {
    if (new.target === Abstract) {
      throw new Error('You cannot use abstract class!');
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error('Abstract method dows not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
