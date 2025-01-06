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


function getCountryName(code){
    return new Intl.DisplayNames([code], { type: 'region' }).of(code);
}
function toGetDate(dt){
    let currDate = new Date(dt*1000);
        // console.log(currDate);

        const options = {
            weekday : "long",
            year : "numeric",
            month : "long",
            day : "numeric",
            hour : "numeric",
            minute : "numeric", 
        }
        const formatter = new Intl.DateTimeFormat('en-US', options).format(currDate); 
        
        console.log(formatter);
        return formatter;
}

let city = 'lahore';

citySearch.addEventListener('submit', (e)=>{
    e.preventDefault();

    let cityName = document.querySelector('.city_name');
    console.log(cityName.value);
    city = cityName.value ;

    getWeatherData();

    cityName.value = "";
});

async function  getWeatherData(){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=19582c496fa050d9f1882ac8deaf0445`;
    try {

        let result = await fetch(weatherUrl);
        let data = await result.json();

        console.log(data);
        const {main, name, weather, wind, sys, dt} = data;

        cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        
        dateTime.innerHTML = toGetDate(dt);
        w_temperature.innerHTML = `${main.temp.toFixed(2)}&#176C`;
        w_minTem.innerHTML = `Min : ${main.temp_min.toFixed(2)}&#176C`;
        w_maxTem.innerHTML = `Max : ${main.temp_max.toFixed(1)}&#176C`;
        w_feelsLike.innerHTML = `${main.feels_like.toFixed(2)}&#176C`;
        w_humidity.innerHTML = `${main.humidity}%`;
        w_wind.innerHTML = `${wind.speed} m/s`;
        w_pressure.innerHTML = `${main.pressure} hPa`;
        w_forecast.innerHTML = `${weather[0].main}`;
        w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;
        


    } catch (error) {
        console.log(error);
    }
}

document.body.addEventListener('load', getWeatherData());

const themeToggleBtn = document.getElementById("themeToggleBtn");

// Function to apply the theme
function applyTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
}

// Detect system theme
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Load the preferred theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const theme = savedTheme || getSystemTheme();
  applyTheme(theme);
}

// Toggle theme and save preference
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-theme")
    ? "dark"
    : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});

// Apply theme on page load
loadTheme();

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  