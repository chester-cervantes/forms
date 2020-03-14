(function () {
  'use strict';

  angular
    .module('forms')
    .controller('FormsListController', FormsListController);

  FormsListController.$inject = ['FormsService' , '$http'];

  function FormsListController(FormsService , $http) {
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


  }
}());
