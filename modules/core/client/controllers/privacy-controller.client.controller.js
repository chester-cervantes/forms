(function() {
  'use strict';

  angular
    .module('core')
    .controller('PrivacyControllerController', PrivacyControllerController);

  PrivacyControllerController.$inject = ['$scope'];

  function PrivacyControllerController($scope) {
    var vm = this;

    // Privacy controller controller logic
    // ...

    init();

    function init() {
    }
  }
})();
