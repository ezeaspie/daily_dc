let latitude = "0";
let longitude = "0";
let stopArray = [];

const currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&APPID=da9fb1fcf9653ff66cdd239db52b238d";
const forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&APPID=da9fb1fcf9653ff66cdd239db52b238d";

//Map data

function initMap(){
  let stopsToDisplay = [];
  let options = {
    zoom:17,
    center:{lat: latitude, lng: longitude}
  }
  const map = new google.maps.Map(document.getElementById('map'), options);

  addMarker = (coords) => {
    const marker = new google.maps.Marker({
      position:coords,
      map:map,
      icon: "http://maps.google.com/mapfiles/ms/micons/bus.png"
    });
  }
  const userLocation = new google.maps.Marker({
    position: {lat:latitude, lng: longitude},
    map:map,
    icon: "http://maps.google.com/mapfiles/ms/micons/orange-dot.png"
  });

  if(stopArray.length != 0){
    console.log('There is info here');
    for (i = 0; i < stopArray.length; i++) {
      addMarker(stopArray[i]);
    }
  }
}


//Fetch metro bus stop data

fetchStopInfo = () => {
  let metroStopUrl = `https://api.wmata.com/Bus.svc/json/jStops?Lat= ${latitude}&Lon=${longitude}&Radius=500`;
  fetch(metroStopUrl, {
    mode: "cors",
    headers: {
      "api_key" : "15727b36f8c84812a2d97d64a4b65b69"
    },
    method : "get"
  })
    .then((response) => {return response.json()})
    .then((response) => {
      console.log(response);
      for (i=0 ; i<response.Stops.length ; i++){
        stopArray.push({
          lat:response.Stops[i].Lat,
          lng:response.Stops[i].Lon
        });
        console.log(stopArray);
      }
      renderMetroBusInfo(response);
    });
}

//Fetch metro bus prediction data.

fetchBusTimeInfo = (stop) => {
  let metroUrl = `https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=${stop}`;

  fetch(metroUrl, {
    mode:"cors",
    headers: {
      "api_key" : "15727b36f8c84812a2d97d64a4b65b69"
    },
    method:'get'
    })
    .then((response) => {return response.json()})
    .then((response) => {
      console.log(response);
      renderMetroInfo(response);
    });
}

renderMetroBusInfo = (data) => {
  let html =`
  <div class='metrobusInfo'>
  <h3>Stops near Me</h3>
  <ul class="stops">`;

  for(i=0 ; i<data.Stops.length ; i++){
    html += `
      <li class="busStop" data-stopId="${data.Stops[i].StopID}">
        <h4>
        ${data.Stops[i].Name}
        </h4>
      </li>`
  }
  html += `
  </ul>
  </div>`;

  document.querySelector("#container").innerHTML = html;
  let stops = document.querySelectorAll(".busStop");
  console.log(stops);

  for(i=0 ; i<stops.length ; i++){
    stops[i].addEventListener("click", function() {
    //  fetchBusTimeInfo();
      let stopId = this.dataset.stopid;
      console.log(this.dataset.stopid);
      fetchBusTimeInfo(stopId);
    });
  }
  initMap();
}

renderMetroInfo = (data) => {
  let html = `
  <div class='metroInfo'>
    <h3>${data.StopName}</h3>
    <ul class="predictions">`;

  for(i=0 ; i<data.Predictions.length ; i++){
    html += `
    <li>
      <h4>
      ${data.Predictions[i].DirectionText}
      </h4>
      <h5>${data.Predictions[i].Minutes}</h5>
    </li>`;
  }

  html += `
  </ul>
  </div>`;

  document.querySelector("#container").innerHTML = html;
}

//Fetch current weather data
/*
fetch(currentWeatherUrl, {
  mode: "cors",
  method: 'get'
})
  .then((response)=> {return response.json()})
  .then((response) => {console.log(response)});

//Fetch forecasts

fetch(forecastUrl, {
  mode: "cors",
  method: 'get'
})
  .then((response)=> {return response.json()})
  .then((response) => {console.log(response)});
  */

//Geolocation

//Get the user's location coordinates.
getLocation = () => {
    if (navigator.geolocation) {
      //updatePosition
        navigator.geolocation.getCurrentPosition(handlefetchStopInfo);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
}

handlefetchStopInfo = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude,longitude);
    //Get and Render the information on the bus stops within 500 feet.
    fetchStopInfo();
}

getLocation();
