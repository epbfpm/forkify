import View from './view.js';

class AddRecipeView extends View {
  _parentEl = this.select('.upload');

  _overlay = this.select('.overlay');
  _modal = this.select('.add-recipe-window');

  _btnOpen = this.select('.nav__btn--add-recipe');
  _btnClose = this.select('.btn--close-modal');

  _uploadFields = this.select('.upload__column');
  _addIngredient = this.select('.btn--ing');
  _numberOfIng = 1;

  constructor() {
    super();
    this._modalBehaviour();
  }

  _modalBehaviour() {
    /* ==== open modal Event listener === */
    this._btnOpen.addEventListener('click', this.toggleModal);

    /* === close modal event listeners == */
    this._overlay.addEventListener('click', this.toggleModal);
    this._btnClose.addEventListener('click', this.toggleModal);
    window.addEventListener(
      'keydown',
      ev => ev.key === 'Escape' && this.toggleModal()
    );
  }

  addNewRecipeHandler(handler) {
    /* === submit form event listener === */
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      const data = document.querySelectorAll('.upload__column input');
      this.toggleModal();

      handler(data);
    });
  }

  addAddIngredientHandler(handler) {
    this._addIngredient.addEventListener('click', ev => {
      ev.preventDefault();
      handler();
    });
  }

  addIngredient() {
    const markup = `<label>Ingredient ${++this._numberOfIng}</label>
          <input
            type="text"
            name="ingredient-${this._numberOfIng}"
            placeholder="Format: 'Quantity,Unit,Description'"
          />`;

    document
      .querySelector('.ingredients__column')
      .insertAdjacentHTML('beforeend', markup);
  }

  toggleModal = () => {
    this._overlay.classList.toggle('hidden');
    this._modal.classList.toggle('hidden');
  };

  _generateMarkup() {}
}

export default new AddRecipeView();
