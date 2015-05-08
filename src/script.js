function getJSON(url, cb) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', url);
  xhr.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      cb(JSON.parse(this.response));
    };
  };
  xhr.send();
};

function weather(currentURL, tenDayURL) {
  getJSON(currentURL, function(data) {
    if (!data.current_observation) {
      document.querySelector(".temp").innerHTML = "Please try your search again.";
      document.querySelector(".fiveday").innerHTML = "";
    } else {
    document.querySelector(".temp").innerHTML = "The current temperature in " + data.current_observation.display_location.full + " is " + data.current_observation.temp_f + "º";
    }
  });
  getJSON(tenDayURL, function(data) {
    data.forecast.simpleforecast.forecastday.forEach(function(day, i){
      var dayDiv = document.querySelector('.day' + i);
      dayDiv.innerHTML = "<div>" + data.forecast.simpleforecast.forecastday[i].date.weekday + "</div>";
      dayDiv.innerHTML += "<div>" + data.forecast.simpleforecast.forecastday[i].high.fahrenheit + "º</div>";
      dayDiv.innerHTML += "<img src='" + data.forecast.simpleforecast.forecastday[i].icon_url + "'>";
      dayDiv.innerHTML += "<div>" + data.forecast.simpleforecast.forecastday[i].low.fahrenheit + "º</div>";
    });
  });
};

function autoPop() {
  getJSON('http://api.wunderground.com/api/3d07c1309ca1fe36/forcast10day/geolookup/q/autoip.json', function(data) {
    var lat = data.location.lat;
    var long = data.location.lon;
    var tenDayAutoURL = 'http://api.wunderground.com/api/3d07c1309ca1fe36/forecast10day/q/' + lat + ',' + long + '.json';
    weather('http://api.wunderground.com/api/3d07c1309ca1fe36/conditions/geolookup/q/autoip.json', tenDayAutoURL);
  });
};
autoPop();

document.querySelector('.zip').onclick = function() {
  var zipCurrentURL = 'http://api.wunderground.com/api/3d07c1309ca1fe36/conditions/q/' + document.querySelector("input").value + '.json';
  var zipURL = 'http://api.wunderground.com/api/3d07c1309ca1fe36/forecast10day/q/' + document.querySelector("input").value + '.json';
  weather(zipCurrentURL, zipURL);
};

document.querySelector('.location').onclick = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var locationCurrentURL = 'http://api.wunderground.com/api/3d07c1309ca1fe36/conditions/q/' + lat + ',' + long + '.json';
    var locationURL = 'http://api.wunderground.com/api/3d07c1309ca1fe36/forecast10day/q/' + lat + ',' + long + '.json';
    weather(locationCurrentURL, locationURL);
  });
};
