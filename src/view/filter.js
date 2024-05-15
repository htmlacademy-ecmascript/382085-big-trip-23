function filterItem(filterName) {
  const filterNameLowerCase = filterName.toLowerCase();
  return `
    <div class="trip-filters__filter">
      <input id="filter-${filterNameLowerCase}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filterNameLowerCase}">
      <label class="trip-filters__filter-label" for="filter-${filterNameLowerCase}">${filterName}</label>
    </div>
  `;
}

export function filter() {

  const itemsMarkupArray = [];
  for (const filterName of ['Everything', 'Future', 'Present', 'Past']) {
    itemsMarkupArray.push(filterItem(filterName));
  }

  const filtersMarkup = itemsMarkupArray.join(' ');

  return `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
  `;

}
