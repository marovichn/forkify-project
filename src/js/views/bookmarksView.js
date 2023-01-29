import View from './View';
import previewView from './previewView';
import { PAGE_NUM } from '../config';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return `${this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('')}`;
  }
}

export default new BookmarksView();
