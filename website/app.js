/* Global Variables */

// The URL root if user searches by zip code
const API_ROOT_ZIP = 'http://api.openweathermap.org/data/2.5/weather?zip=';

// The URL root if user searches by city
const API_ROOT_CITY = 'http://api.openweathermap.org/data/2.5/weather?q=';

// The URL for units parameter
const API_UNITS = '&units=';

// The URL for api key parameter
const API_KEY = `&appid=${config.API_KEY}`;

// Find the Generate button and add the listener
const goButton = document.getElementById('generate');
goButton.addEventListener('click', clickRespond);

// Main function of the program
// Grabs the user's input, then forms URL, calls API, POSTS and updates UI
function clickRespond() {

    // Grab user's input
    const zipInput = document.getElementById('zip');
    const cityInput = document.getElementById('city');
    const unitsInput = document.querySelector('input[name="units"]:checked')
    const feelingsInput = document.getElementById('feelings');
    let units;
    let degreeSystem;
    if (unitsInput) {
        units = unitsInput.value;
    } else {
        units = "metric";
    }
    if (units == "metric") {
        degreeSystem = "C";
    } else {
        degreeSystem = "F";
    }

    // Read values of zip and city
    const zip = zipInput.value;
    const city = cityInput.value;

    // Form URL based on zip or city search
    // (zip takes precendence if both were entered)
    let url;
    if (zip) {
        url = API_ROOT_ZIP + zip + API_UNITS + units + API_KEY;
    } else if (city) {
        url = API_ROOT_CITY + city + API_UNITS + units + API_KEY;
    }

    // Call the API
    getWeather(url)

        // Prepares data for POST, calls the POST
        .then(function (weatherData) {
            const errorMessage = document.getElementById('error');
            if (weatherData.cod == "200") {
                errorMessage.classList.add('hide');
                const icon = weatherData.weather[0].icon;
                const date = dateTime();
                const temperature = weatherData.main.temp.toFixed(0);
                const feelings = feelingsInput.value;
                postJournal('/add', { icon, date, temperature, feelings });

                // Calls to update the site with latest entry
                updateUI(degreeSystem);

            } else {
                console.log('Bad data entered');
                errorMessage.classList.remove('hide');
                return;
            }
        })
}

// Calls the API, converts response to JSON
// returns weatherData JSON object
async function getWeather(url) {
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}

// POSTs the journal data (icon, date/time, temperature, feelings)
async function postJournal(url, data) {
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data)
    });
}


// Updates the website's latest entry card
// Includes weather icon, date, temperature, feelings
// Shows the card if it's hidden
async function updateUI(degreeSystem) {
    const response = await fetch('/retrieve');
    const latestEntry = await response.json();
    document.getElementById('icon').innerHTML = `<img class="icon" src="http://openweathermap.org/img/wn/${latestEntry.icon}@2x.png" alt="Weather icon">`
    document.getElementById('date').innerHTML = `Date: ${latestEntry.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${latestEntry.temperature}\xB0${degreeSystem}`;
    document.getElementById('content').innerHTML = `Feelings: ${latestEntry.feelings}`;
    document.getElementById('journal').classList.remove('hide');
}

// Calculate the user's date and time
// returns date and time in string
function dateTime() {
    const d = new Date();
    let minutes = d.getMinutes();
    if (d.getMinutes() <= 9) {
        minutes = `0${minutes}`;
    }
    const date = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} at time ${d.getHours()}:${minutes}`;
    return date;
}