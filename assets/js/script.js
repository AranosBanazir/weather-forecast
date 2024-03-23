const apikey = '607b09751fe2e09adc4ef5a58f66622d'
let lat;
let lon;

let cityInfo;



//TODO process all functions



//TODO function to convert city name to coords and then call
// fetchWeather for infomation
async function fetchCityInfo(){
    const city = document.querySelector('input').value
    try{
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apikey}`)

    const data = await response.json()
    console.log(data[0].lat, data[0].lon)
    fetchWeather(data[0].lat, data[0].lon)
    }
    catch{
        throw new Error('That place does not exist');
    }
    //takes converted city and pulls weather based on the coords
   
}

//TODO function to get lat/lon data from inputted city

//TODO Fetch data on requested city
async function fetchWeather(lat, lon){
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`)
    // const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=43.4704014&lon=-89.7437844&appid=607b09751fe2e09adc4ef5a58f66622d')
    const data = await response.json()

    let count = 0

    const currentCity = {
        name: data.city.name,
        country: data.city.country,
        forecast: [],
        humidity: data.list[0].main.humidity + ' %',
        temp: Math.floor((data.list[0].main.temp -273.15) * 1.8 + 32) + '°F',
        wind: data.list[0].wind.speed + ' MPH',
        
    }
    let confirmedDay = 1
    for (let i = 0; i< data.list.length; i++){
        if (data.list[i].dt_txt.match('00:00:00')){
            currentCity.forecast[`day${confirmedDay}`] = [
                {
                    temp: Math.floor((data.list[i].main.temp -273.15) * 1.8 + 32) + '°F',
                    humidity: data.list[i].main.humidity + ' %',
                    wind: data.list[i].wind.speed + ' MPH',
                    icon: data.list[i].weather[0].icon,
                    date: data.list[i].dt_txt.replace(' 00:00:00', '')
                }
            ]
          
            confirmedDay++
        }
        
    }
    cityInfo = currentCity
    console.log(currentCity)
    console.log(data)
    displayForecast()
  }
  catch{
    // throw new Error(`Unable to fetch information for: CITY NAME`)
  }
}

//TODO Function to display information over the 5 days 

function displayForecast(){
    const forecastContainer = document.querySelector('#forecast-display')

    for (const info in cityInfo.forecast){



        for (const weather of cityInfo.forecast[info]){
            //make the elements for each day
            const infoPannel = document.createElement('div')
            const date = document.createElement('h2')
            const icon = document.createElement('img')
            const temp = document.createElement('p')
            const wind = document.createElement('p')
            const humidity = document.createElement('p')

            infoPannel.classList.add('forecast-container')
            date.classList.add('forecast-header')
            icon.classList.add('forecast-icon')
            temp.classList.add('forecast-txt')
            wind.classList.add('forecast-txt')
            humidity.classList.add('forecast-txt')

            //append new elements to container
            forecastContainer.appendChild(infoPannel)
            infoPannel.appendChild(date)
            infoPannel.appendChild(icon)
            infoPannel.appendChild(temp)
            infoPannel.appendChild(wind)
            infoPannel.appendChild(humidity)

            //set the values of the new elements

            date.textContent = weather.date

            console.log(weather)
        }
    }
    // console.log(cityInfo.forecast)
}

//TODO Create a search history with functionality to re-display the info
function addSearchHistory(){

}