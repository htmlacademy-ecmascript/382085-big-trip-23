import Observable from '../framework/observable';
import { FilterType } from '../utils/filter';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
