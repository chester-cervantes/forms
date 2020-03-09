(function() {
  'use strict';

  angular
    .module('core')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$scope', '$http'];

  function WeatherController($scope, $http) {
    var vm = this;

    $scope.getWeather = function(weather) {
      console.log("getWeather called");
      var appid = "6a918a2e7455032b8e29775f764b46df";

      $http.post('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.weather_location + '&appid=' + appid).
        success(function(data, status, headers, config) {
          console.log("success");
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          console.log("failed");
        });

      $http.post('/api/weather', {location = $scope.weather_location}).
        success(function(data, status, headers, config) {
          console.log("success");

        }).
        error(function(data, status, headers, config) {
          console.log("failed");
        });
    }

    // Weather controller logic
    // ...

    init();

    function init() {
    }
  }
})();
