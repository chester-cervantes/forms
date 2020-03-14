(function() {
  'use strict';

  angular
    .module('core')
    .controller('WeatherApiController', WeatherApiController);

  WeatherApiController.$inject = ['$scope', '$http'];


  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  // Acknowledge from https://scottontechnology.com/temperature/kelvin-to-celsius-javascript-code/
  function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
      return 'below absolute zero (0 K)';
    } else {
      return (kelvin - 273.15);
    }
  }

  // Acknowledged from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  function timeConverter(UNIX_timestamp) {
    let date = new Date(UNIX_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  function addWeather(weather_data) {

    var tbody = document.getElementById('weather_tbody');
    var row = tbody.insertRow(tbody.rows.length);

    var location_name = row.insertCell(0);
    var date_time = row.insertCell(1);
    var weather = row.insertCell(2);
    var temperature = row.insertCell(3);

    location_name.innerHTML = weather_data['name'];
    date_time.innerHTML = timeConverter(weather_data['dt']);
    weather.innerHTML = weather_data['weather']['0']['main'];
    temperature.innerHTML = round(convertKelvinToCelsius(weather_data['main']['temp']), 2);
  }


  function WeatherApiController($scope, $http) {
    var vm = this;

    // Weather api controller logic
    // ...
    $scope.getWeatherInfo = function (location) {
      var appid = "6a918a2e7455032b8e29775f764b46df";

      $http.post('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.weather_location + '&appid=' + appid).
        success(function (data, status, headers, config) {
          console.log(data);
          addWeather(data);
        }).
        error(function (data, status, headers, config) {

        });
    }
  }
})();
