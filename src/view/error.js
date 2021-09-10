import AbstractView from './abstract.js';

const createErrorTemplate = () => (`<div class="error-message" style="position:fixed; background: #961515; padding: 20px; border-radius: 4px;
left: 20px;bottom: 20px; color: #fff">
    <h4 style="margin:0 0 10px" >Oops! Something going wrong.</h4>
    <p style="margin:0">Looks like data hasn't been loaded.</p>
  </div>
`);


export default class ErrorTemplate extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createErrorTemplate();
  }
}
