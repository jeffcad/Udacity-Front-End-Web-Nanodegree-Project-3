/* Global Variables */

// Create a new date instance dynamically with JS
// TODO: change this to use new DATE((time returned by weather + timezone) 
// * 1000) to get a time in the location returned
// need to wait until after data fetch to do this
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

const API_ROOT = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const TEMPERATURE_UNITS = '&units=metric';
const API_KEY = `&appid=${config.API_KEY}`;

const zipInput = document.getElementById('zip');
const goButton = document.getElementById('generate');

goButton.addEventListener('click', clickRespond);



function clickRespond() {
    zip = zipInput.value;
    const url = API_ROOT + zip + TEMPERATURE_UNITS + API_KEY;
    getWeather(url);
}

async function getWeather(url) {
    const response = await fetch(url);
    try {
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.log('something went wrong');
        // TODO improve this, add error code check?
    }
}
