(function () {
  'use strict';

  angular
    .module('forms')
    .controller('FormsListController', FormsListController);

  FormsListController.$inject = ['FormsService' , '$http', '$scope'];

  function FormsListController(FormsService , $http, $scope) {
    var vm = this;
    vm.forms = {};

    $http.get ( '/api/forms' )
    .success ( function (data, status, headers, config) {
      console.log ( "success status = " + status ); // DEBUG
      vm.forms = data;
    } )
    .error ( function (data, status, headers, config) {
      console.log ( "error status = " + status ); // DEBUG
      console.log ( "error data = " + data.message ); // DEBUG
    } );

    $scope.Sort1 = function () {
      console.log('asdasdasds');
      var forms = document.getElementById('forms');

      function getArrayFromTable(table) {
        return 'test';
      }

      var array = getArrayFromTable(forms);
      forms.innerHTML = array;

      // var row = tbody.insertRow(tbody.rows.length);

      // var location_name = row.insertCell(0);
      // var date_time = row.insertCell(1);
      // var weather = row.insertCell(2);
      // var temperature = row.insertCell(3);
      //
      // location_name.innerHTML = weather_data['name'];
      // date_time.innerHTML = timeConverter(weather_data['dt']);
      // weather.innerHTML = weather_data['weather']['0']['main'];
      // temperature.innerHTML = round(convertKelvinToCelsius(weather_data['main']['temp']), 2);
    }
  }

}());
