import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  args;
  select = selector => document.querySelector(selector);

  render(data, args) {
    this._data = data;
    this.args = args;

    this._parentEl.innerHTML = this._generateMarkup();
  }

  renderError(err, msg = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>Error: ${String(err).split(':')[1]}. <br>  ${msg} </p>
    </div>`;
    this._parentEl.innerHTML = markup;
  }

  renderMessage(msg = this._message) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p> ${msg} </p>
    </div>`;
    this._parentEl.innerHTML = markup;
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    if (this._parentEl.innerHTML) this._parentEl.innerHTML = markup;
  }
}
