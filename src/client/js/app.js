
let tripInfo = {};

async function performAction(e){
    e.preventDefault();

    //get city and date
    tripInfo.city = document.getElementById('city').value;
    tripInfo.startDate = getTripStartDate();
    if (!tripInfo.city || !tripInfo.startDate) {
      alert("Please Enter City and Start Date!");
      return;
    }
    //get countdown using start date
    tripInfo.countdown = getCountdown(tripInfo.startDate);
    //get the city informaion
    tripInfo.location = await getLocation(tripInfo.city);
    if (tripInfo.location === null) {
      alert("Error getting location");
      return;
    }
    //get the weather forcast
    tripInfo.weatherForecast = await getWeatherForecast(tripInfo.location.latitude, tripInfo.location.longitude);
    //get the city photo or country if non exist
    tripInfo.photo = await getPhoto(tripInfo.city, tripInfo.location.countryName);
    // show the info to the user
    updateUI(tripInfo);
}

function updateUI(tripInfo) {
    //get html elements
    let tripCity = document.getElementById("trip-city");
    let weather = document.getElementById("weather");
    let temp = document.getElementById("temp");
    let countdown = document.getElementById("trip-countdown");
    let image = document.getElementById("trip-image");
    let container = document.getElementById("search-result");
    //modify html elements
    tripCity.innerHTML = `Your trip to ${tripInfo.city}, ${tripInfo.location.countryName}`
    weather.innerHTML = `${tripInfo.weatherForecast.weather.description}`;
    temp.innerHTML = `${tripInfo.weatherForecast.temperature} &deg; C `;
    countdown.innerHTML = `Trip is ${tripInfo.countdown} days away`;
    image.setAttribute("src", tripInfo.photo);
    //set the container to be visible
    container.style.display = 'block';
}

function getTripStartDate() {
    //get the start trip date
    let date = document.getElementById('trip-date').value.split('-');
    return date.join('/');
}

function getCountdown (tripStartDate) {
    //get days until trip 
    let currentDate = new Date();
    let tripDate = new Date(tripStartDate);
    let dif = Math.abs(tripDate - currentDate);
    let days = Math.ceil(dif / (1000 * 60 * 60 * 24));
    return days;
}

// API Calls //

async function getLocation(city) {
    const geonamesApi = {
        "baseUrl" : "http://api.geonames.org/searchJSON?formatted=true",
        "username" : "mohammad_khaled"
    }
    const endpointUrl = `${geonamesApi.baseUrl}&q=${city}&username=${geonamesApi.username}&style=full`;
    
    try {
        const tripCity = {};
        const apiResponse = await fetch(endpointUrl);
        const responseBody = await apiResponse.json();
        tripCity.latitude = responseBody.geonames[0].lat;
        tripCity.longitude = responseBody.geonames[0].lng;
        tripCity.countryName = responseBody.geonames[0].countryName;

        return tripCity;
    } 
    catch (error) {
        console.log("Error" + error);
    };
}

// to determine the time of the trip
const FORECAST = {
    "FUTURE": "future",
    "CURRENT": "current"
    
};

async function getWeatherForecast(latitude, longitude, forecast = FORECAST.CURRENT) {

    const weatherbitApi = {
        "key": "24a5169de8394568b05721c5e36a00a4",
        "current": {
            "baseUrl" : "https://api.weatherbit.io/v2.0/current?"
        },
        "future": {
            "baseUrl": "https://api.weatherbit.io/v2.0/forecast/daily?"
        }
    }
    
    const baseUrl = (forecast === FORECAST.CURRENT) ? `${weatherbitApi.current.baseUrl}` : `${weatherbitApi.future.baseUrl}`;
    const endpointUrl = `${baseUrl}&lat=${latitude}&lon=${longitude}&key=${weatherbitApi.key}`;
    
    try {
        const forecast = {};
        const apiResponse = await fetch(endpointUrl);
        const responseBody = await apiResponse.json();
        
        forecast.temperature = responseBody.data[0].temp;
        forecast.weather = responseBody.data[0].weather;

        return forecast;
    } 
    catch (error) {
        console.log("Error: " + error);
    };
}

async function getPhoto(city, country) {

    const pixabayApi = {
        "baseUrl" : "https://pixabay.com/api/?",
        "apiKey": "17814522-ff40ce7195656ed13b58cfaaa",
        "image_type": "photo"
    }
    
    const endpointUrl = `${pixabayApi.baseUrl}&q=${city}&key=${pixabayApi.apiKey}&image_type=photo`;
    
    try {
        const apiResponse = await fetch(endpointUrl);
        const responseBody = await apiResponse.json();

        if (responseBody.hits !== 0) {
            return responseBody.hits[0].largeImageURL;
        }

        // get country if no city photo found
        endpointUrl = `${pixabayApi.baseUrl}&q=${country}&key=${pixabayApi.apiKey}&image_type=photo`;
        const countryImageResponse = await fetch(endpointUrl);
        const countryImageResponseBody = await countryImageResponse.json();

        return countryImageResponseBody.hits[0].largeImageURL;
        
    } 
    catch (error) {
        console.log("Error: " + error);
    };
}




export { performAction }


