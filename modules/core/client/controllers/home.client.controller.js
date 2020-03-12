(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$http'];

  function HomeController($scope, $http) {
    var vm = this;

    $scope.getWeatherInfo = function(location) {
      var appid = "6a918a2e7455032b8e29775f764b46df";

      $http.post('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.weather_location + '&appid=' + appid).
        success(function(data, status, headers, config) {
          console.log(data);
        }).
        error(function(data, status, headers, config) {

        });
    }
  }
}());
