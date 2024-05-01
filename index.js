const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

search.addEventListener('click', () => {
    getWeather();
})

function getWeather() {
    const APIKey = '303b7ad4afd79c0daf56c9c1ebab4512';

    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response=>{
            if(!response.ok && response.status!== 404) { // allow error404 and process it later
                throw new Error("API Issue");
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            const pollution = document.querySelector('.weather-details .pollution span');
            const coords = document.querySelector('.weather-details .coords span');
            const sunrise = document.querySelector('.weather-details .sunrise span');
            const sunset = document.querySelector('.weather-details .sunset span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;
            pollution.innerHTML = `114514`;

            let showCoords = (lat, lon) =>
                `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}
                ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`;
            coords.innerHTML = 
            showCoords(Math.floor(json.coord.lat), Math.floor(json.coord.lon));
            
            let showHourAndMinute = (h, m) => 
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

            sunriseDate = new Date(json.sys.sunrise * 1000);
            sunrise.innerHTML = 
            showHourAndMinute(sunriseDate.getHours(), sunriseDate.getMinutes());

            sunsetDate = new Date(json.sys.sunset * 1000);
            sunset.innerHTML = 
            showHourAndMinute(sunsetDate.getHours(), sunsetDate.getMinutes());

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
}
