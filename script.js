function getDayWidget(name, icon, temperature) {
    const container = document.createElement("div");
    container.className = "day"

    const dayNameDiv = document.createElement("div");
    dayNameDiv.className = "day-name"
    dayNameDiv.textContent = name


    const weatherIconContainer = document.createElement("div");
    weatherIconContainer.className = "weather-icon"

    const image = document.createElement("img");
    image.src = "https://openweathermap.org/img/wn/"+icon+ "@2x.png"
    weatherIconContainer.appendChild(image)

    const tempDiv = document.createElement("div");
    tempDiv.className = "temperature"
    tempDiv.innerHTML = temperature + " &deg; C"

    container.appendChild(dayNameDiv)
    container.appendChild(weatherIconContainer)
    container.appendChild(tempDiv)
    return container
}

async function getWeatherData() {
    try {
        const response = await fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=Rostov-on-Don&units=metric&appid=fbcb5765a111d4cdb4958477e415e19c"
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error occurred while fetching weather data:', error);
        throw error;
    }
}

function calculateAvgTemperature(weatherData) {
    try {
        const temperatures = weatherData.map((item) => item.main.temp);
        const avgTemperature =
            temperatures.reduce((acc, curr) => acc + curr) / temperatures.length;
        return Math.round(avgTemperature);
    } catch (error) {
        console.error('Error occurred while calculating average temperature:', error);
        throw error;
    }
}

async function displayWeatherData() {
    try {
        const weatherData = await getWeatherData();
        const currentTemperature = Math.round(weatherData.list[0].main.temp);
        const currentWeatherDescription = weatherData.list[0].weather[0].description;
        const currentWeatherIcon = "https://openweathermap.org/img/w/" + weatherData.list[0].weather[0].icon + ".png";
        document.getElementById(
            "current-temperature"
        ).textContent = `${currentTemperature} °C`;
        document.getElementById("current-weather-description").textContent =
            currentWeatherDescription;
        document
            .getElementById("current-weather-icon")
            .setAttribute("src", currentWeatherIcon);

        const avgTemperature1 = calculateAvgTemperature(weatherData.list.slice(0, 8));
        const avgTemperature2 = calculateAvgTemperature(weatherData.list.slice(8, 16));
        const avgTemperature3 = calculateAvgTemperature(weatherData.list.slice(16, 24));

        const futureDaysContainer = document.getElementById("future-days")
        futureDaysContainer.appendChild(getDayWidget("Завтра", "icon", avgTemperature1))
        futureDaysContainer.appendChild(getDayWidget("Через 1 день", "icon", avgTemperature2))
        futureDaysContainer.appendChild(getDayWidget("Через 2 дня", "icon", avgTemperature3))
    } catch (error) {
        console.error('Error occurred while displaying weather data:', error);
        throw error;
    }
}

displayWeatherData();