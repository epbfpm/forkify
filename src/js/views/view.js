import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _bookMarked;

  select = selector => document.querySelector(selector);

  render(data, render = true) {
    // if (!data || data.length == 0) return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._parentEl.innerHTML = markup;
  }

  update(data) {
    // if (!data || data.length == 0) return this.renderError();
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES -
      // I'm not using data attributes to send data in my code -the teacher did
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderError(err, msg = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${msg}</p>
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
      <p>${msg}</p>
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
