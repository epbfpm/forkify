import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  args;
  select = selector => document.querySelector(selector);

  render(data, args) {
    this._data = data;
    this.args = args;

    /* ========== insert recipe ========= */
    this._parentEl.innerHTML = this._generateMarkup();
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
