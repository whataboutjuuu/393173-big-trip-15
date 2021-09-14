import AbstractView from './abstract.js';

const createErrorTemplate = (errorMessage) => (`<div class="error-message" style="position:fixed; background: #961515; padding: 20px; border-radius: 4px;
left: 20px;bottom: 20px; color: #fff">
    <h4 style="margin:0 0 10px" >Oops! Something going wrong.</h4>
    <p style="margin:0">${errorMessage}</p>
  </div>
`);


export default class ErrorTemplate extends AbstractView {
  constructor(errorMessage) {
    super();

    this._errorMessage = errorMessage;
  }

  getTemplate() {
    return createErrorTemplate(this._errorMessage);
  }
}
