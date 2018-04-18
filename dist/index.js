let latitude = "0";
let longitude = "0";
let stopArray = [];
let stopid = 0;

const hide = function(selector) {
  document.querySelector(selector).style.display = 'none';
}
const show = (selector, displayType = 'block') => {
  document.querySelector(selector).style.display = displayType;
}

//Map data

function initMap(){
  let stopsToDisplay = [];
  let options = {
    zoom:17,
    center:{lat: parseFloat(latitude), lng: parseFloat(longitude)}
  }
  const map = new google.maps.Map(document.getElementById('map'), options);
  //Create Markers for Bus Stops
  addMarker = (data) => {
    //Build Content String.
    let contentString = `
    <div class="content">
      <h5>${data.name}</h5>`
    for (var i = 0; i < data.routes.length; i++) {
      contentString += `<span>${data.routes[i]}</span>`
    }
    contentString += "</div>"
    //Create InfoWindow that shows bus stop info.
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    //Create the marker and add a listener to display info when clicked.
    const marker = new google.maps.Marker({
      position:{lat: data.lat, lng: data.lng},
      map:map,
      icon: "http://maps.google.com/mapfiles/ms/micons/bus.png"
    });
    marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
  }
  //Display User Current Location
  const userLocation = new google.maps.Marker({
    position: {lat:parseFloat(latitude), lng: parseFloat(longitude)},
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


//Fetch metro bus stop data and pass data on to the INITMAP function.

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
      //Send data to MAP
      for (i=0 ; i<response.Stops.length ; i++){
        stopArray.push({
          lat:response.Stops[i].Lat,
          lng:response.Stops[i].Lon,
          name:response.Stops[i].Name,
          routes:response.Stops[i].Routes
        });
        console.log(stopArray);
      }
      //Render the list of stops.
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
`;

  document.querySelector("#stopList").innerHTML = html;

  let stops = document.querySelectorAll(".busStop");
  console.log(stops);

  for(i=0 ; i<stops.length ; i++){
    stops[i].addEventListener("click", function() {
    //  fetchBusTimeInfo();
      stopId = this.dataset.stopid;
      console.log(this.dataset.stopid);
      hide('#stopList');
      show('#predictions');
      hide('#restart');
      show('#refresh');
      fetchBusTimeInfo(stopId);
    });
  }
  initMap();
}

renderMetroInfo = (data) => {
  let html = `
    <h3>${data.StopName}</h3>
    <ul class="predictions">`;

  for(i=0 ; i<data.Predictions.length ; i++){
    html += `
    <li>
      <h4>
      ${data.Predictions[i].DirectionText}
      </h4>
      <h5>${data.Predictions[i].Minutes} Minutes</h5>
    </li>`;
  }

  html += `
  </ul>`;
  console.log(html);
  document.querySelector("#predictions").innerHTML = html;
  show("#back");
}


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

hide("#back");
hide('#refresh');

document.querySelector("#back").addEventListener("click", function() {
  hide("#back");
  hide("#predictions");
  show("#stopList");
  show('#restart');
  hide('#refresh');
});

document.querySelector("#restart").addEventListener("click", function() {
  hide("#back");
  hide("#refresh");
  getLocation();
});

document.querySelector("#refresh").addEventListener("click", function() {
  fetchBusTimeInfo(stopId);
});
