let searchCitiesList = $('#search-cities-list');

let createPopularCityButton = (name) => $('<button>').addClass(['btn', 'btn-accent-color', 'flex-fill', 'mb-3']).text(name); 

for(let i = 0; i < popularCities.length; i++) {
    let popularCity = popularCities[i];
    searchCitiesList.append(createPopularCityButton(popularCity));
}
