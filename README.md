# Weather-Journal App Project

## Description
This project creates an asynchronous web app that uses a web API and user data to dynamically update the UI. Local server running on *Node* and *Express* is used.

## Prerequisite
This project runs on a local server. It uses Node. If you don't have Node already installed on your machine, you can download it [**here**](https://nodejs.org/en/download/).

You also must have an API key for [OpenWeatherMap.org](https://openweathermap.org/). The sign-up page is [**here**](https://home.openweathermap.org/users/sign_up).

After you get your API key, go to the file *config-sample.js* in the *website* folder. Here you should replace the dummy API key with your own. Then rename the file to *config.js*.

## Installation
If Node is installed, then you can use the Node Package Manager to install the packages needed to run this program, which are listed in the package.json file. In the terminal, use this command:

```
npm install
```
When those packages have installed, start the server with the following command.

```
node server.js
```

## Instructions for Use
Enter a US zip code or a world city name (not case-sensitive). If both zip code and city are entered, the zip code will take precedence. Choose units, either metric (Celsius) or imperial (Fahrenheit). Enter your feelings in the *How are you feeling today?* space. Press the **Generate** button to make your entry.

## Author
The code was written by Jeff, based on starter code given for the project by Udacity.

