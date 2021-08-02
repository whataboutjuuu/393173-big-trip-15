export const createRouteTemplate = (points) => {
  // console.log(points);
// посчитать кол-во уникальных городов в массиве, - Если городов больше 3-х, то в наименовании маршрута отображается первый и последний город, разделённые многоточием: «Amsterdam —... — Chamonix».

  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${points[0].city}&mdash; ${points.length >= 3 ? '...' : points[0].city} &mdash; ${points[points.length-1].city}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>
  `;
};
