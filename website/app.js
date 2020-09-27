/* Global Variables */
const API_ROOT_ZIP = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const API_ROOT_CITY = 'http://api.openweathermap.org/data/2.5/weather?q=';
const API_UNITS = '&units=';
const API_KEY = `&appid=${config.API_KEY}`;

const zipInput = document.getElementById('zip');
const cityInput = document.getElementById('city');
const feelingsInput = document.getElementById('feelings');
const goButton = document.getElementById('generate');

goButton.addEventListener('click', clickRespond);



function clickRespond() {
    const units = document.querySelector('input[name="units"]:checked').value;
    const zip = zipInput.value;
    const city = cityInput.value;
    let url;
    if (zip) {
        url = API_ROOT_ZIP + zip + API_UNITS + units + API_KEY;
    } else if (city) {
        url = API_ROOT_CITY + city + API_UNITS + units + API_KEY;
    }
    getWeather(url)
        .then(function (weatherData) {
            const icon = weatherData.weather[0].icon;
            const date = dateTime(weatherData);
            const temperature = weatherData.main.temp.toFixed(0);
            const feelings = feelingsInput.value;
            postJournal('/add', { icon, date, temperature, feelings });
            updateUI();
        })
}

async function getWeather(url) {
    const response = await fetch(url);
    try {
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log('something went wrong');
        // TODO improve this, add error code check?
    }
}

async function postJournal(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data)
    });
    // TODO: handle errors
    // try {
    //     const projectData = await response.json();
    //     return projectData;
    // } catch (error) {
    //     console.log("error", error);
    // }
}

// TODO handle error case
async function updateUI() {
    const response = await fetch('/retrieve');
    try {
        const latestEntry = await response.json();
        document.getElementById('icon').innerHTML = `<img class="icon" src="http://openweathermap.org/img/wn/${latestEntry.icon}@2x.png" alt="Weather icon">`
        document.getElementById('date').innerHTML = `Date: ${latestEntry.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${latestEntry.temperature} degrees`;
        document.getElementById('content').innerHTML = `Feelings: ${latestEntry.feelings}`;
        if (document.querySelector('.hide')) {
            document.querySelector('.hide').classList.remove('hide');
        }
    } catch (error) {
        console.log("error", error);
    }
}

function dateTime(weatherData) {
    const millisecondTime = (weatherData.dt) * 1000;
    const utc = new Date(millisecondTime);
    const userTimezone = utc.getTimezoneOffset() * 60 * 1000;
    const d = new Date(millisecondTime + (weatherData.timezone * 1000) + userTimezone);
    let minutes = d.getMinutes();
    if (d.getMinutes() <= 9) {
        minutes = `0${minutes}`;
    }
    const date = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} ${d.getHours()}:${minutes}`;
    return date;
}