
const apiKey = '88fe6d684ad0472db54164026240912';


document.addEventListener('DOMContentLoaded', () => {
  getWeatherByLocation();
});


async function getWeatherManual() {
  const locationInput = document.getElementById("location-input");
  const city = locationInput.value.trim();

  if (!city) {
    Swal.fire("Missing City", "Please enter a city name.", "warning");
    return;
  }

  await fetchWeatherData(city);
  locationInput.value = "";
}

function getWeatherByLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherData(`${latitude},${longitude}`);
      },
      () => {
        Swal.fire("Location Disabled", "Please allow location or search manually.", "warning");
      }
    );
  } else {
    Swal.fire("Unsupported", "Browser doesn't support geolocation.", "info");
  }
}


async function fetchWeatherData(query) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=3`;

  try {
    const res = await fetch(apiUrl);
    const text = await res.text();
    const data = JSON.parse(text);

    if (data.error) {
      return Swal.fire("Weather Error", data.error.message, "error");
    }

    displayWeather(data);
  } catch (err) {
    Swal.fire("Error", "Could not retrieve weather data.", "error");
  }
}


function displayWeather(data) {
  const container = document.getElementById('weather-container');
  container.innerHTML = '';

  const forecast = data?.forecast?.forecastday;
  if (!forecast) {
    container.innerHTML = '<p>No data available.</p>';
    return;
  }

  forecast.forEach(day => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4 text-center weather-card';
    card.innerHTML = `
      <h2>${new Date(day.date).toDateString()}</h2>
      <h3>${data.location.name}</h3>
      <p>${day.day.condition.text}</p>
      <p>🌡️ ${day.day.avgtemp_c}°C</p>
      <p>💧 ${day.day.avghumidity}% Humidity</p>
    `;
    container.appendChild(card);
  });
}