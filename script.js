// DOM element selections
let cityName = document.querySelector(".weather_city");
let dateTime = document.querySelector(".weather_date_time");
let w_forecast = document.querySelector(".weather_forecast");
let w_icon = document.querySelector(".weather_icon");
let w_temperature = document.querySelector(".weather_temperature");
let w_minTem = document.querySelector(".weather_min");
let w_maxTem = document.querySelector(".weather_max");
let w_feelsLike = document.querySelector(".weather_feelsLike");
let w_humidity = document.querySelector(".weather_humidity");
let w_wind = document.querySelector(".weather_wind");
let w_pressure = document.querySelector(".weather_pressure");
let citySearch = document.querySelector(".weather_search");
let forecastContainer = document.querySelector(".forecast_container");

// Helper function to get country name from country code
function getCountryName(code) {
    return new Intl.DisplayNames([code], { type: 'region' }).of(code);
}

// Helper function to format date and time
function formatDateTime(dt) {
    let currDate = new Date(dt * 1000);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }
    return new Intl.DateTimeFormat('en-US', options).format(currDate);
}

// Default city
let city = 'berlin';

// Event listener for city search
citySearch.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityInput = document.querySelector('.city_name');
    city = cityInput.value;
    getWeatherData();
    getForecastData();
    cityInput.value = "";
});

// Function to fetch and display current weather data
async function getWeatherData() {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=19582c496fa050d9f1882ac8deaf0445`;
    try {
        let result = await fetch(weatherUrl);
        let data = await result.json();
        const { main, name, weather, wind, sys, dt } = data;

        // Update DOM elements with weather data
        cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        dateTime.innerHTML = formatDateTime(dt);
        w_temperature.innerHTML = `${main.temp.toFixed(2)}&#176C`;
        w_minTem.innerHTML = `Min: ${main.temp_min.toFixed(2)}&#176C`;
        w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed(1)}&#176C`;
        w_feelsLike.innerHTML = `${main.feels_like.toFixed(2)}&#176C`;
        w_humidity.innerHTML = `${main.humidity}%`;
        w_wind.innerHTML = `${wind.speed} m/s`;
        w_pressure.innerHTML = `${main.pressure} hPa`;
        w_forecast.innerHTML = `${weather[0].main}`;
        w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" />`;
    } catch (error) {
        console.log(error);
    }
}

// Function to fetch and display 5-day forecast data
async function getForecastData() {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=19582c496fa050d9f1882ac8deaf0445`;
    try {
        let result = await fetch(forecastUrl);
        let data = await result.json();

        // Clear previous forecast
        forecastContainer.innerHTML = '';

        // Get one forecast per day (every 8th item in the list)
        const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);

        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = forecast.main.temp.toFixed(1);
            const minTemp = forecast.main.temp_min.toFixed(1);
            const maxTemp = forecast.main.temp_max.toFixed(1);
            const icon = forecast.weather[0].icon;
            const description = forecast.weather[0].main;
            const windSpeed = forecast.wind.speed.toFixed(1);

            // Create forecast item
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast_item');
            forecastItem.innerHTML = `
                <p class="forecast_day">${dayName}</p>
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                <p class="forecast_temp">${temp}&#176C</p>
                <p class="forecast_description">${description}</p>
                <p class="forecast_minmax">Min: ${minTemp}&#176C</p>
                <p class="forecast_minmax">Max: ${maxTemp}&#176C</p>
                <p class="forecast_wind">Wind: ${windSpeed} m/s</p>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    } catch (error) {
        console.log(error);
    }
}

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData();
    getForecastData();
});

// Theme toggle functionality
const themeToggleBtn = document.getElementById("themeToggleBtn");

function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
}

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || getSystemTheme();
    applyTheme(theme);
}

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

loadTheme();

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });

