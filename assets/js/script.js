let now = moment();
let searchCitiesList = $('#search-cities-list');
let cityAndDate = $('#city-and-date');
let tempInfo = $('#temp-info');
let windInfo = $('#wind-info');
let humidityInfo = $('#humidity-info');
let searchBox = $('#search-box');
let searchButton = $('#search-button');

// this query object will help manage the page info
// by default, it will show us the first city in the popular cities list
let query = {city: popularCities[0], coords: savedCity};

let createPopularCityButton = (name) => $('<button>').addClass(['btn', 'btn-accent-color', 'flex-fill', 'mb-3']).text(name);
let determineWeather = (json) => weatherTypes[json.weather[0].main.toLowerCase()];
let createLoadingSpinner = () => $('<div>').addClass('spinner-border').append($('<span>').addClass('sr-only'));

function queryCity(city) {
    // clear the saved city before we push the search value to the query string
    clearSavedCity();
    // add the query param, this reloads the page
    location.search = `?city=${city}`;
}

function launchSearch() {
    // get the value in the search box
    let searchValue = searchBox.val().trim();
    // if the value has no content
    if(searchValue.length === 0) {
        // tell the user
        window.alert('Enter a city to search!');
        // return
        return;
    }
    queryCity(searchValue);
}

function searchFunctionality() {
    // on search button click, launch a search
    searchButton.on('click', launchSearch);
    // on search box keypress
    searchBox.on('keypress', (event) => {
        // if the key is 'Enter'
        if(event.key === 'Enter') {
            // launch a search
            launchSearch();
        }
    })
}

function populatePopularCities() {
    // for each popular city
    for(let i = 0; i < popularCities.length; i++) {
        let popularCity = popularCities[i];
        // create a button
        let popularCityButton = createPopularCityButton(popularCity);
        // on click
        popularCityButton.on('click', () => {
            // query the popular city
            queryCity(popularCity);
        });
        // append the button to the list of popular cities
        searchCitiesList.append(popularCityButton);
    }
}

function solveQuery() {
    // get the query string
    let queryString = location.search;
    // if it's not empty, shave the leading '?' off
    if(queryString.length > 0) {
        queryString = queryString.substring(1, queryString.length);
    }
    // split each parameter
    let queryParts = queryString.split('&');
    for(let i = 0; i < queryParts.length; i++) {
        // for each, split the param name and valye
        let queryPart = queryParts[i].split('=');
        // if there's not 2 parts, skip this one
        if(queryPart.length != 2) {
            continue;
        }
        // set the param name to the value in the query object
        query[queryPart[0]] = queryPart[1].replace('%20', ' ');
    }
}

function populateSearchInfo() {
    // setup the weather icon and city name before the request to make sure it's displayed immediately when the page loads with no lag
    let weatherIcon = $('<i>').addClass('fas');
    // we don't need the request to know the city and date, so this goes first
    // append a loading spinner to each info category for the user to see we are still fetching the information
    cityAndDate.append(createLoadingSpinner());
    tempInfo.append(createLoadingSpinner().addClass('info-loading'));
    windInfo.append(createLoadingSpinner().addClass('info-loading'));
    humidityInfo.append(createLoadingSpinner().addClass('info-loading'));
    // make the request
    fetchWeather(query.city, savedCity).then((json) => {
        cityAndDate.text(`${json.loc.city} (${now.format('M/D/yyyy')}) `).append(weatherIcon);
        // determine what type of weather it is
        let weatherType = determineWeather(json);
        // append the weather icon type to signify what the weather is like
        weatherIcon.addClass(weatherType.iconClass);
        // temperature info
        tempInfo.text(`${json.temp}\u00B0F`);
        // wind info
        windInfo.text(`${json.wind} MPH`);
        // humidity info
        humidityInfo.text(`${json.humidity}%`);
        // save the city fetched
        saveCity(json.loc.lat, json.loc.lon);
    }).catch(() => window.alert('An unexpected error occurred!'));
}

searchFunctionality();
solveQuery();
populateSearchInfo();
populatePopularCities();
