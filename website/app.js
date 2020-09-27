/* Global Variables */
const API_ROOT = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const TEMPERATURE_UNITS = '&units=metric';
const API_KEY = `&appid=${config.API_KEY}`;

const zipInput = document.getElementById('zip');
const feelingsInput = document.getElementById('feelings');
const goButton = document.getElementById('generate');

goButton.addEventListener('click', clickRespond);



function clickRespond() {
    const zip = zipInput.value;
    const url = API_ROOT + zip + TEMPERATURE_UNITS + API_KEY;
    getWeather(url)
        .then(function (weatherData) {
            const millisecondTime = (weatherData.dt + weatherData.timezone) * 1000;
            const d = new Date(millisecondTime);
            const date = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
            const feelings = feelingsInput.value;
            const temperature = weatherData.main.temp.toFixed(0);
            console.log('date');
            postJournal('/add', { date, temperature, feelings });
        })
        .then(updateUI());
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
    try {
        const projectData = await response.json();
        console.log('Post returned:');
        console.log(projectData);
        return projectData;
    } catch (error) {
        console.log("error", error);
    }
}

// TODO handle error case
async function updateUI() {
    const request = await fetch('/retrieve');
    try {
        const latestEntry = await request.json();
        document.getElementById('date').innerHTML = latestEntry.date;
        document.getElementById('temp').innerHTML = latestEntry.temperature;
        document.getElementById('content').innerHTML = latestEntry.feelings;
    } catch (error) {
        console.log("error", error);
    }
}