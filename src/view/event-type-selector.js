import { createElement } from '../render';
import { EVENT_TYPES } from '../mock/destinations';
import { EVENT_TYPE_ICONS } from '../../constants';

/**
*/
function createEventOption(type) {

  const typeCapitalized = `${type[0].toUpperCase()}${type.slice(1)}`;
  return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" />
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeCapitalized}</label>
    </div>`;
}


/**
*/
function eventTypeSelector(selectedEventType) {

  const eventsMarkup = EVENT_TYPES.map((type) => createEventOption(type)).join(' ');
  const selectedEventTypeIcon = EVENT_TYPE_ICONS[selectedEventType];

  return `
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="${selectedEventTypeIcon}" alt="Event type icon" />
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" />

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventsMarkup}
        </fieldset>
      </div>

    </div>`;
}

export default class EventTypeSelectorView {

  constructor(selectedEventType) {
    this.selectedEventType = selectedEventType;
  }

  getTemplate() {
    return eventTypeSelector(this.selectedEventType);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
