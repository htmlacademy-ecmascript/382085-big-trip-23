import { EVENT_TYPES } from '../../constants';
import { EVENT_TYPE_ICONS } from '../../constants';
import { capitalize } from '../../utils/common';

/**
  * @param {import('../../constants').WaypointType} type
  * @param {string} waypointId
  * @returns {string} разметка
*/
function createEventOptionMarkup(waypointId, type, disabled) {

  const typeCapitalized = capitalize(type);

  return (
    `<div class="event__type-item">
      <input
        id="event-type-${type}-${waypointId}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${disabled ? 'disabled' : ''}/>
      <label
        class="event__type-label event__type-label--${type}"
        for="event-type-${type}-${waypointId}">
        ${typeCapitalized}
      </label>
    </div>`
  );
}


/**
  * @param {string} waypointId
  * @param {import('../../constants').WaypointType} selectedEventType
  * @returns {string} разметка
*/
export function createEventTypeSelectorMarkup(waypointId, selectedEventType, disabled) {

  const eventsMarkup = EVENT_TYPES.map((type) => createEventOptionMarkup(waypointId, type, disabled)).join(' ');
  const selectedEventTypeIcon = EVENT_TYPE_ICONS[selectedEventType];

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${waypointId}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="${selectedEventTypeIcon}" alt="Event type icon" />
      </label>
      <input
        class="event__type-toggle  visually-hidden"
        id="event-type-toggle-${waypointId}"
        type="checkbox"
        ${disabled ? 'disabled' : ''} />

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventsMarkup}
        </fieldset>
      </div>

    </div>`
  );
}
