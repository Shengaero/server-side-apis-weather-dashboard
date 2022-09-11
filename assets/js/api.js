let apiKey = 'a0eace9ccff525be4601e59c9d29c184';
let apiBase = 'http://api.openweathermap.org/';
let directGeoRoute = 'geo/1.0/direct';
let currentWeatherRoute = 'data/2.5/weather';

let formatURL = (route) => apiBase + route;
let appendAppID = (requestUrl) => requestUrl + `&appid=${apiKey}`;
let autoConvertPromiseToJSON = (response) => response.json();
let verifyGood = (json) => {
    if((json.cod >= 200 && json.cod < 400) || Array.isArray(json)) {
        return json;
    }

    throw { reason: 'error with request', payload: json };
}

function __testDG() {
    directGeocode({name: 'Buffalo Grove'})
        .then((json) => {
            if(json.length < 1) {
                return;
            }
            let val = json[0];
            currentWeather(val.lat, val.lon)
                .then((json) => {
                    console.log(json);
                })
        });
}

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

    return fetch(requestUrl).then(autoConvertPromiseToJSON).then(verifyGood);
}

function currentWeather(lat, lon) {
    let requestUrl = formatURL(currentWeatherRoute);
    requestUrl += `?lat=${lat}&lon=${lon}&units=standard`;
    requestUrl = appendAppID(requestUrl);
    return fetch(requestUrl).then(autoConvertPromiseToJSON).then(verifyGood);
}
