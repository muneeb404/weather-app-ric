// DOM element selections
const cityName = document.querySelector(".weather_city");
const dateTime = document.querySelector(".weather_date_time");
const w_forecast = document.querySelector(".weather_forecast");
const w_icon = document.querySelector(".weather_icon");
const w_temperature = document.querySelector(".weather_temperature");
const w_minTem = document.querySelector(".weather_min");
const w_maxTem = document.querySelector(".weather_max");
const w_feelsLike = document.querySelector(".weather_feelsLike");
const w_humidity = document.querySelector(".weather_humidity");
const w_wind = document.querySelector(".weather_wind");
const citySearch = document.querySelector(".weather_search");
const forecastContainer = document.querySelector(".forecast_container");

// Helper function to get country name from country code
function getCountryName(code) {
    return new Intl.DisplayNames([code], { type: 'region' }).of(code);
}

// Helper function to format date and time
function formatDateTime(dt) {
    const date = new Date(dt * 1000);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Default city
let city = 'lahore';

// Event listener for city search
citySearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityInput = document.querySelector('.city_name');
    city = cityInput.value;
    try {
        await getWeatherData();
        await getForecastData();
    } catch (error) {
        clearWeatherData();
    }
    cityInput.value = "";
});

// Function to fetch and display current weather data
async function getWeatherData() {
    const apiKey = '19582c496fa050d9f1882ac8deaf0445';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        const { main, name, weather, wind, sys, dt, coord } = data;

        // Get air pollution data
        const aqi = await getAirPollutionData(coord.lat, coord.lon);

        // Update DOM elements with weather data
        cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        dateTime.innerHTML = formatDateTime(dt);
        w_temperature.innerHTML = `${main.temp.toFixed(1)}&#176C`;
        w_minTem.innerHTML = `Min: ${main.temp_min.toFixed(1)}&#176C`;
        w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed(1)}&#176C`;
        w_feelsLike.innerHTML = `${main.feels_like.toFixed(1)}&#176C`;
        w_humidity.innerHTML = `${main.humidity}%`;
        w_wind.innerHTML = `${wind.speed.toFixed(1)} m/s`;
        w_forecast.innerHTML = weather[0].main;
        w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="${weather[0].description}" />`;

        // Update air quality and sunrise/sunset information
        document.querySelector('.weather_aqi').innerHTML = `${getAQIDescription(aqi)} (${aqi})`;
        document.querySelector('.weather_sunrise').innerHTML = formatTime(sys.sunrise);
        document.querySelector('.weather_sunset').innerHTML = formatTime(sys.sunset);
    } catch (error) {
        console.error(error);
        showAlert(`Error: ${error.message}. Please check the city name and try again.`);
    }
}

// Function to fetch and display 5-day forecast data
async function getForecastData() {
    const apiKey = '19582c496fa050d9f1882ac8deaf0445';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error('Unable to fetch forecast data');
        }
        const data = await response.json();

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
                <p class="forecast_minmax">Min: ${minTemp}&#176C | Max: ${maxTemp}&#176C</p>
                <p class="forecast_wind">Wind: ${windSpeed} m/s</p>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    } catch (error) {
        console.error(error);
        showAlert(`Error: ${error.message}. Please check the city name and try again.`);
    }
}

// Function to get air pollution data
async function getAirPollutionData(lat, lon) {
    const apiKey = '19582c496fa050d9f1882ac8deaf0445';
    const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(airPollutionUrl);
        const data = await response.json();
        return data.list[0].main.aqi;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to get AQI description
function getAQIDescription(aqi) {
    const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return descriptions[aqi - 1] || 'Unknown';
}

// Function to format time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to show alert
function showAlert(message) {
    alert(message);
}

// Function to clear weather data
function clearWeatherData() {
    const elements = [
        cityName, dateTime, w_temperature, w_minTem, w_maxTem,
        w_feelsLike, w_humidity, w_wind, w_forecast, w_icon
    ];
    elements.forEach(el => el.innerHTML = '');
    document.querySelector('.weather_aqi').innerHTML = '';
    document.querySelector('.weather_sunrise').innerHTML = '';
    document.querySelector('.weather_sunset').innerHTML = '';
    forecastContainer.innerHTML = '';
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
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || getSystemTheme();
    applyTheme(savedTheme);
}

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
});

loadTheme();

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
    }
});

