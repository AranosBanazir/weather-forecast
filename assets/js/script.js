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

  const $forecastContainer = $("#forecast-display");
  const $currentDayDisplay = $("#info-display");



  


  //set information for upper box
  const $cityInfoDiv = $('<div>')
  const $city = $('<h2>')
  const $cityDate = $('<h2>')
  const $cityIcon = $('<img>')

  const $cityTemp = $('<p>')
  const $cityWind = $('<p>')
  const $cityHumidity = $('<p>')


  $cityInfoDiv.appendTo($currentDayDisplay).addClass('flex-container')
  $city.addClass('temp').text(cityInfo.name).appendTo($cityInfoDiv)
  $cityDate.addClass('temp').text(`(${dayjs(today.date).$M}/${dayjs(today.date).$D}/${dayjs(today.date).$y})`).appendTo($cityInfoDiv)
  $cityIcon.addClass('temp').attr('src', `https://openweathermap.org/img/wn/${(today.icon.replace('n', 'd') || today.icon)}@2x.png`).appendTo($cityInfoDiv)

  $cityTemp.addClass('temp').text("Temp: " + today.temp).appendTo($currentDayDisplay)
  $cityWind.addClass('temp').text("Wind: " + today.wind).appendTo($currentDayDisplay)
  $cityHumidity.addClass('temp').text("Humidity: " + today.humidity).appendTo($currentDayDisplay)



  for (const info in cityInfo.forecast) {
    for (const weather of cityInfo.forecast[info]) {
        if (info == 'day1'){

        }else{

      //make the elements for each day
        const $infoPannel = $("<div>");
        const $date = $("<h2>");
        const $icon = $("<img>");
        const $temp = $("<p>");
        const $wind = $("<p>");
        const $humidity = $("<p>");

        $infoPannel.addClass('forecast-container temp').appendTo($forecastContainer)
        $date.addClass('forecast-header temp').appendTo($infoPannel).text(`${dayjs(weather.date).$M}/${dayjs(weather.date).$D}/${dayjs(weather.date).$y}`)
        $icon.addClass('forecast-icon temp').appendTo($infoPannel).attr('src', `https://openweathermap.org/img/wn/${weather.icon}@2x.png`)
        $temp.addClass('forecast-txt temp').appendTo($infoPannel).text("Temp: " + weather.temp)
        $wind.addClass('forecast-txt temp').appendTo($infoPannel).text("Wind: " + weather.wind)
        $humidity.addClass('forecast-txt temp').appendTo($infoPannel).text("Humidity: " + weather.humidity)

      

    }
    }
  }
}

//Create a search history with functionality to re-display the info
function addSearchHistory(city) {
    const tempHistory = JSON.parse(localStorage.getItem('search-history')) || []

    const $searchHistory = $('#search-history')
    const $newSearch = $('<div>')
    const $newSearchTxt = $('<p>')
    const fixedCity = city.replace(' ', '-')
    
    if (searchHistoryList.includes(city)){

    }else{
        searchHistoryList.push(city)
        $newSearch.appendTo($searchHistory).addClass('search-history').attr('id', `${fixedCity}-history`)
        $newSearchTxt.appendTo($newSearch).text(city.toUpperCase())
    

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
function handleSearchHistory(e){
   clearDisplay()
      
        const city = e.target.textContent.toLowerCase()
        fetchCityInfo(city)
      
  
    
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

$('#search-history').on('click', handleSearchHistory)