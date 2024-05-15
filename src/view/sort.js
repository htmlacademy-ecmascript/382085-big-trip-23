function sortItem(sortName) {
  const sortByLowerCase = sortName.toLowerCase();
  return `
    <div class="trip-sort__item  trip-sort__item--${sortByLowerCase}">
      <input id="sort-${sortByLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortByLowerCase}">
      <label class="trip-sort__btn" for="sort-${sortByLowerCase}">${sortName}</label>
    </div>
  `;
}

export function sort() {

  const itemsMarkupArray = [];
  for (const sortColumnName of ['Day', 'Event', 'Time', 'Price', 'Offer']) {
    itemsMarkupArray.push(sortItem(sortColumnName));
  }

  const innerMarkup = itemsMarkupArray.join(' ');
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get"> ${innerMarkup} </form>`;
}
