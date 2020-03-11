(function () {
  'use strict';

  // Forms controller
  angular
    .module('forms')
    .controller('FormsController', FormsController);

  FormsController.$inject = [ '$scope', '$state', '$window', 'Authentication', 'formResolve', 'FormsService' ];

  function FormsController ($scope, $state, $window, Authentication, form, FormsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.form = form;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;

    // Remove existing Form
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.form.$remove($state.go('forms.list'));
      }
    }

    function cancel () {
      if ( !$window.confirm('Are you sure you want to cancel (all unsaved progress will be lost)?') ) {
        return;
      }

      $state.go('home', {});
    }

    // Save Form
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.formForm');
        return false;
      }

      var formsService = new FormsService ( vm.form );
      if (vm.form._id) {
        formsService.$update ( successCallback , errorCallback );
      } else {
        formsService.$create ( successCallback , errorCallback );
      }

      function successCallback(res) {
        $state.go('forms.view', {
          formId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
