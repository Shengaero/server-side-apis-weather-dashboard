let savedCityStorageKey = 'saved_city';

let popularCities = ['Chicago', 'Austin', 'New York', 'Orlando', 'San Francisco', 'Seattle', 'Denver', 'Atlanta'];

let weatherTypes = {
    clear: {
        name: 'Clear Skies',
        iconClass: 'fa-sun'
    },
    clouds: {
        name: 'Clouds',
        iconClass: 'fa-cloud'
    },
    rain: {
        name: 'Rain',
        iconClass: 'fa-cloud-showers-heavy'
    },
    snow: {
        name: 'Snow',
        iconClass: 'fa-snowflake'
    },
    fog: {
        name: "Fog",
        iconClass: 'fa-smog'
    }
};

let savedCity = {lat: undefined, lon: undefined};

function saveCity(lat, lon) {
    savedCity.lat = lat;
    savedCity.lon = lon;
    localStorage.setItem(savedCityStorageKey, JSON.stringify(savedCity));
}

function loadSavedCity() {
    let savedCityString = localStorage.getItem(savedCityStorageKey);
    if(savedCityString) {
        savedCity = JSON.parse(savedCityString);
    }
}

function clearSavedCity() {
    localStorage.removeItem(savedCityStorageKey);
}

loadSavedCity();
