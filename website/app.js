/* Global Variables */
const API_ROOT = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const API_UNITS = '&units=';
const API_KEY = `&appid=${config.API_KEY}`;

const zipInput = document.getElementById('zip');
const feelingsInput = document.getElementById('feelings');
const goButton = document.getElementById('generate');

goButton.addEventListener('click', clickRespond);



function clickRespond() {
    const zip = zipInput.value;
    const units = document.querySelector('input[name="units"]:checked').value;
    const url = API_ROOT + zip + API_UNITS + units + API_KEY;
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
    const millisecondTime = (weatherData.dt + weatherData.timezone) * 1000;
    const d = new Date(millisecondTime);
    const date = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return date;
}