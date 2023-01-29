import View from './View';
import previewView from './previewView';
import { PAGE_NUM } from '../config';

import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    return `${this._data.map(res => previewView.render(res, false)).join('')}`;
  }
}

export default new ResultsView();
