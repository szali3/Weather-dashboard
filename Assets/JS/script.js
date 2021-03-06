var prVal;
var cityArray = [];
var cityArrayL = 8;
var cityVal;
var cityName;
var key = "01641ced755a62d708af8737698735eb";
var lat;
var lon;

// Get localStorage items, if localstorage is empty do nothing else parse data
cityLS = window.localStorage.getItem('city');
if (!cityLS) {
  cityArray = [];
} else {
  cityArray = JSON.parse(cityLS);
  historyBtn();
}

$(document).ready(function(){
  //when document loads it waits for user click search button
  $("#searchBtn1").click(function(){
    cityVal = $("#searchWeather").val().toLowerCase().trim();
    //check to see if input text is blank or same value as previous text.
    if(prVal === cityVal || !cityVal) {
      return;
    } else {
      getData();
      getFiveDay();
      storeVal();
      prVal = $("#searchWeather").val().toLowerCase().trim();;
      historyBtn();
    }
  });
    //when document loads it waits for user click search history button
  $(document).on("click",'.btn-secondary',function(event){
      cityVal = event.target.value;
      getData();
      getFiveDay();
  })
});

//Makes history button
function historyBtn() { 
  $("#searchHistory").empty();
  for (i = 0;i<cityArray.length;i++) {
    var r= $('<input type="button"/>');
    r.addClass("btn btn-secondary searchBtn");
    r.attr("value",cityArray[i]);
    $("#searchHistory").append(r);
  }
}

function storeVal () {
  cityVal = $("#searchWeather").val().toLowerCase().trim();;
 // check to see if city inputed already, if blank nothing happens
 if (!cityVal){
  return
 } else if (cityArray.includes(cityVal)) { //if already in array it will remove from array and put in top
     indx = cityArray.indexOf(cityVal);
     cityArray.splice(indx, 1);
     cityArray.unshift(cityVal);
  } else {
      if(cityArray.length < 8){ //Only 8 buttons will populate. last one will be remove and new entry will be in top
        cityArray.unshift(cityVal);
      } else {
        cityArray.pop();
        cityArray.unshift(cityVal);
      }
    }
  window.localStorage.setItem("city",JSON.stringify(cityArray));
};

// Get lat and long from one API and used it for another to get current weather.
function getData () {
   fetch("https://api.openweathermap.org/geo/1.0/direct?q="+
      cityVal+
      "&appid="+
      key)
  .then(response => response.json())
  .then(data => {
      lat = data[0].lat;
      lon = data[0].lon;
      cityName = data[0].name;
      return (
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+
        lat+
        "&lon="+lon+"&exclude=minutely,hourly,daily,alerts&units=metric&appid="
        +key)
      )
        }).then(response => response.json())
  .then(data =>{
    //Populate the current Temp div
    $("#currntCity").text(moment.unix(data.current.dt).format('M/D/YYYY'))
    iconVal = data.current.weather[0].icon;
    $("#currentWeatherIcon").html('<img id="curImgIcon" src = "https://openweathermap.org/img/wn/' +
      iconVal +
      '@2x.png" />')
    $("#ctyName").text(cityName);
    $("#currentTemp").text(data.current.temp);
    $("#currentWind").text(data.current.wind_speed);
    $("#currentHum").text(data.current.humidity);
    $("#currentUv").text(data.current.uvi);

  //favorable 0-5, moderate 6-10, or severe 11+ );
  if(data.current.uvi<=5){
    $("#currentUv").css("background-color","green");
  }else if (data.current.uvi<=10) {
    $("#currentUv").css("background-color","orange");
  } else {
    $("#currentUv").css("background-color","red");
  }
  })
}

//get 5 day API and populate it
function getFiveDay() {
  fetch("https://api.openweathermap.org/data/2.5/forecast?q="+
    cityVal+
    "&units=metric"+
    "&appid="+key)
  .then(response => response.json())
  .then(data => {
  i=1
  //since it is every 3 hrs need to get every 8th item of array 8*3=24
  //populate the 5 day divs
  for (j=8;j<=40;j=j+8) {
      $("#fiveDate"+(i)).text(moment.unix(data.list[j-1].dt).format('M/D/YYYY'))
      fiveDayIcon = data.list[j-1].weather[0].icon;
      $("#fiveIcon"+(i)).html('<img src = "https://openweathermap.org/img/wn/' + 
        fiveDayIcon + 
        '@2x.png" />');
      $("#fiveTemp"+(i)).text("Temp: "+ data.list[j-1].main.temp);
      $("#fiveWind"+(i)).text("Wind: "+ data.list[j-1].wind.speed);
      $("#fiveHum"+(i)).text("Humidity: "+ data.list[j-1].main.humidity);
      i++;
    }
  });
}

// var cityResult = {
// "lat": 43.7001,
// "lon": -79.4163,
// "timezone": "America/Toronto",
// "timezone_offset": -14400,
// "current": {
//   "dt": 1622378516,
//   "sunrise": 1622367600,
//   "sunset": 1622422251,
//   "temp": 11.76,
//   "feels_like": 10.38,
//   "pressure": 1025,
//   "humidity": 53,
//   "dew_point": 2.5,
//   "uvi": 1.9,
//   "clouds": 1,
//   "visibility": 10000,
//   "wind_speed": 0.45,
//   "wind_deg": 103,
//   "wind_gust": 1.34,
//   "weather": [
//       {
//     "id": 800,
//     "main": "Clear",
//     "description": "clear sky",
//     "icon": "01d"
//       }
//     ]
//   }
//}