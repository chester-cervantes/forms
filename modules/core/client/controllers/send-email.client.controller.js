(function() {
  'use strict';

  angular
    .module('core')
    .controller('SendEmailController', SendEmailController);

  SendEmailController.$inject = ['$scope'];

  function SendEmailController($scope) {
    var vm = this;

    // Send email controller logic
    // ...

    init();

    function init() {
    }
  }
})();
