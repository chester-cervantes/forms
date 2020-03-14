(function () {
  'use strict';

  // Forms controller
  angular
    .module('forms')
    .controller('FormsController', FormsController);

  FormsController.$inject = [ '$scope', '$state', '$window', 'Authentication', 'formResolve', 'FormsService', '$http' ];

  function FormsController ($scope, $state, $window, Authentication, formResolve, FormsService, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.formResolve = formResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.user = Authentication.user;

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

      $state.go('forms.list', {} );
    }

    // Save Form
    function save (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.fieldInspectionReviewForm');
        return false;
      }

      console.log ( "vm.form = " + JSON.stringify(vm.form) );

      $scope.$broadcast('show-errors-reset', 'vm.form');

      var formsService = new FormsService ( vm.user );
      if (vm.fieldInspectionReviewForm._id) {
        formsService.$update ( successCallback , errorCallback );
      } else {
        //formsService.$create ( successCallback , errorCallback );
        $http.post (
          '/api/forms', 
          vm.form
        )
        .success ( function (data, status, headers, config) {
          console.log ( "success status = " + status ); // DEBUG
          $state.go('forms.list', {} );
        } )
        .error ( function (data, status, headers, config) {
          console.log ( "error status = " + status ); // DEBUG
          console.log ( "error data = " + data.message ); // DEBUG
          //vm.error = res.data.message;
        } );
      }
    }
  }
}());
