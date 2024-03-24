const apikey = "607b09751fe2e09adc4ef5a58f66622d";
let lat;
let lon;
let cityInfo;
const searchHistoryList = []
const storedHistory = JSON.parse(localStorage.getItem('search-history')) || []
let selectedCity;
let dayList = []
//TODO process all functions

//TODO function to convert city name to coords and then call
// fetchWeather for infomation
async function fetchCityInfo(city) {
    clearDisplay()
    selectedCity = city
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${apikey}`
    );

    const data = await response.json();
    fetchWeather(data[0].lat, data[0].lon);
  } catch {
    throw new Error("That place does not exist");
  }
  //takes converted city and pulls weather based on the coords
}

//TODO function to get lat/lon data from inputted city

//TODO Fetch data on requested city
async function fetchWeather(lat, lon) {
    
  
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`
    );
    // const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=43.4704014&lon=-89.7437844&appid=607b09751fe2e09adc4ef5a58f66622d')
    const data = await response.json();
        
    

    const currentCity = {
      name: data.city.name,
      country: data.city.country,
      forecast: [],
      humidity: data.list[0].main.humidity + " %",
      temp: Math.floor((data.list[0].main.temp - 273.15) * 1.8 + 32) + "°F",
      wind: data.list[0].wind.speed + " MPH",
    };

    let confirmedDay = 1;
  
    for (let i = 0; i < data.list.length; i++) {
        
        //making sure we track each new day the forecast gives us
        if (!dayList.includes(data.list[i].dt_txt.replace(/\s\d+:\d+:\d+/g, ''))){
        currentCity.forecast[`day${confirmedDay}`] = [
          {
            temp: Math.floor((data.list[i].main.temp - 273.15) * 1.8 + 32) + "°F",
            humidity: data.list[i].main.humidity + " %",
            wind: data.list[i].wind.speed + " MPH",
            icon: data.list[i].weather[0].icon,
            date: data.list[i].dt_txt.replace(/\s\d+:\d+:\d+/g, ''),
          },
        ];
       
        dayList.push(data.list[i].dt_txt.replace(/\s\d+:\d+:\d+/g, ''))
       
        confirmedDay++;
      }

    }
   //clearing the list of tracked days
    dayList = []
    cityInfo = currentCity;
    displayForecast();
}


//TODO Function to display information over the 5 days

function displayForecast() {
  const today = cityInfo.forecast.day1[0];
  const forecastContainer = document.querySelector("#forecast-display");
  const currentDayDisplay = document.querySelector("#info-display");

  //set information for upper box
  const cityInfoDiv = document.createElement("div");
  const city = document.createElement("h2");
  const cityDate = document.createElement("h2");
  const cityIcon = document.createElement("img");

  const cityTemp = document.createElement("p");
  const cityWind = document.createElement("p");
  const cityHumidity = document.createElement("p");

  currentDayDisplay.appendChild(cityInfoDiv);
  cityInfoDiv.appendChild(city);
  cityInfoDiv.appendChild(cityDate);
  cityInfoDiv.appendChild(cityIcon);

  currentDayDisplay.appendChild(cityTemp);
  currentDayDisplay.appendChild(cityWind);
  currentDayDisplay.appendChild(cityHumidity);

  cityInfoDiv.classList.add("flex-container", 'temp');
  city.classList.add('temp')
  cityDate.classList.add('temp')
  cityIcon.classList.add('temp')
  cityWind.classList.add('temp')
  cityHumidity.classList.add('temp')
  cityTemp.classList.add('temp')
  //setting data
  cityDate.textContent = `(${dayjs(today.date).$M}/${dayjs(today.date).$D}/${
    dayjs(today.date).$y
  })`;
  cityIcon.src = `https://openweathermap.org/img/wn/${today.icon}@2x.png`;
  cityTemp.textContent = "Temp: " + today.temp;
  cityWind.textContent = "Wind: " + today.wind;
  cityHumidity.textContent = "Humidity: " + today.humidity;
  city.textContent = cityInfo.name;

  for (const info in cityInfo.forecast) {
    for (const weather of cityInfo.forecast[info]) {
        if (info == 'day1'){

        }else{
      //make the elements for each day
      const infoPannel = document.createElement("div");
      const date = document.createElement("h2");
      const icon = document.createElement("img");
      const temp = document.createElement("p");
      const wind = document.createElement("p");
      const humidity = document.createElement("p");

      infoPannel.classList.add("forecast-container", 'temp');
      date.classList.add("forecast-header", 'temp');
      icon.classList.add("forecast-icon", 'temp');
      temp.classList.add("forecast-txt", 'temp');
      wind.classList.add("forecast-txt", 'temp');
      humidity.classList.add("forecast-txt", 'temp');

      //append new elements to container
      forecastContainer.appendChild(infoPannel);
      infoPannel.appendChild(date);
      infoPannel.appendChild(icon);
      infoPannel.appendChild(temp);
      infoPannel.appendChild(wind);
      infoPannel.appendChild(humidity);

      //set the values of the new elements

      date.textContent = `${dayjs(weather.date).$M}/${dayjs(weather.date).$D}/${
        dayjs(weather.date).$y
      }`;
      icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
      temp.textContent = "Temp: " + weather.temp;
      wind.textContent = "Wind: " + weather.wind;
      humidity.textContent = "Humidity: " + weather.humidity;
    }
    }
  }
}

//Create a search history with functionality to re-display the info
function addSearchHistory(city) {
    const tempHistory = JSON.parse(localStorage.getItem('search-history')) || []
    const searchHistory = document.querySelector('#search-div')
    const newSearch = document.createElement('div')
    const newSearchTxt = document.createElement('p')
    const fixedCity = city.replace(' ', '-')
    
    if (searchHistoryList.includes(city)){

    }else{
        searchHistoryList.push(city)
        searchHistory.appendChild(newSearch)
        newSearch.appendChild(newSearchTxt)
        newSearch.classList.add('search-history')
        newSearch.id = `${fixedCity}-history`
        newSearchTxt.textContent = city.toUpperCase()
        addListenerForSeachHistory(newSearch)

    }
    

    
    if (!tempHistory.includes(city)){
        tempHistory.push(city)
    }

    localStorage.setItem('search-history', JSON.stringify(tempHistory))

}

    //loops through localStorage to create search history
function renderSearchHistory() {
    const tempHistory = JSON.parse(localStorage.getItem('search-history')) || []

    for (const history in tempHistory){
        addSearchHistory(tempHistory[history])
      
    }
}




//add a click listner for each search history box
function addListenerForSeachHistory(btn){
    
    btn.addEventListener('click', function(e){
        const city = e.target.firstChild.textContent.toLowerCase()
        fetchCityInfo(city)
      
    })
    
}


const btn = document.querySelector('#search-btn')
btn.addEventListener('click', function(e){
    const city = document.querySelector("input").value;

    if (city === ''){
        alert('You must fill out the search, or select from history')
    }else{
    
    e.preventDefault()
    fetchCityInfo(city)
    addSearchHistory(city)
    document.querySelector('input').textContent = ''
    }
})


function clearDisplay(){
    const items = document.querySelectorAll('.temp')

    for (const item of items){
        item.remove()
    }
}



fetchCityInfo((storedHistory[0]|| 'milwaukee'))
renderSearchHistory()