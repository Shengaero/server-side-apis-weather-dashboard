let apiKey = 'a0eace9ccff525be4601e59c9d29c184';
let apiBase = 'http://api.openweathermap.org/';

let directGeoRoute = 'geo/1.0/direct';
let currentWeatherRoute = 'data/2.5/weather';

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
        iconClass: 'fa-cloud-rain'
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

let convertKToF = (kelvin) => (1.8 * (kelvin - 273)) + 32;
let formatURL = (route) => apiBase + route;
let appendAppID = (requestUrl) => requestUrl + `&appid=${apiKey}`;
let convertPromiseToJSON = (response) => response.json();
let verifyGood = (json) => {
    // if the json is a good request or it's a JSON array
    if((json.cod >= 200 && json.cod < 400) || Array.isArray(json)) {
        return json;
    }

    throw {reason: 'error with request', payload: json};
};

function directGeocode(geoInfo) {
    let requestUrl = formatURL(directGeoRoute);

    requestUrl += `?q=${geoInfo.name}`;
    if(geoInfo.state) {
        requestUrl += `,${geoInfo.state}`;
    }
    if(geoInfo.country) {
        requestUrl += `,${geoInfo.country}`;
    }

    requestUrl += '&limit=1';
    requestUrl = appendAppID(requestUrl);

    return fetch(requestUrl)
        .then(convertPromiseToJSON)
        .then(verifyGood)
        .then((json) => {
            if(json.length < 1) {
                throw {reason: 'not found', payload: json};
            }
            return json;
        });
}

function currentWeather(lat, lon, city) {
    let requestUrl = formatURL(currentWeatherRoute);
    requestUrl += `?lat=${lat}&lon=${lon}&units=standard`;
    requestUrl = appendAppID(requestUrl);
    return fetch(requestUrl)
        .then(convertPromiseToJSON)
        .then(verifyGood)
        .then((json) => {
            let apiJson = {
                loc: {lat: lat, lon: lon, city: city},
                weather: json.weather,
                temp: convertKToF(json.main.temp),
                wind: json.wind.speed,
                humidity: json.main.humidity
            };
            return apiJson; // rewrap this with all the info we need
        });
}

function fetchWeather(city) {
    return directGeocode({name: city})
        .then((json) => currentWeather(json[0].lat, json[0].lon, json[0].name));
}
