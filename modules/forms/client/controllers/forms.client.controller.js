(function () {
  'use strict';

  // Forms controller
  angular
    .module('forms')
    .controller('FormsController', FormsController);

  FormsController.$inject = [ '$scope', '$state', '$window', 'Authentication', 'formResolve', 'FormsService', '$http' , 'Notification'];



  function FormsController ( $scope, $state, $window, Authentication, form, FormsService, $http , Notification ) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = form;
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.user = Authentication.user;

    function remove () {
      if ( vm.form._id === null ) {
        return;
      }

      if ( $window.confirm('Are you sure you want to delete this form?' ) ) {
        if ( form ) {
          form.$remove ( $state.go ( 'forms.list' ) );
          Notification.success ( 'User deleted successfully!' );
        }
        else {
          vm.user.$remove ( function () {
            $state.go ( 'forms.list' );
            Notification.success ( { message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function cancel () {
      if ( !$window.confirm ( 'Are you sure you want to cancel (all unsaved progress will be lost)?' ) ) {
        return;
      }
      $state.go('forms.list', {} );
    }

    function successCallback () {
      console.log ( "SUCCESS HERE CALLED" );
      $state.go('forms.list', {} );

      Notification.success ( { message: '<i class="glyphicon glyphicon-ok"></i> Form saved successfully!' });
    }

    function errorCallback ( res ) {
      vm.error = res.data.message;
      Notification.error ( { message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form save error!' });
    }

    // Save Form
    function save ( isValid ) {
      if ( !isValid ) {
        $scope.$broadcast ( 'show-errors-check-validity' , 'vm.fieldInspectionReviewForm' );
        return false;
      }

      if ( vm.form._id ) {
        vm.form.$update ( successCallback (), function ( err ) {});
      }
      else {
        vm.form.$create ( successCallback (), function ( err ) {} );
      }
    }
  }

    // // Save Form
    // function save(isValid) {


    //   // TODO: move create/update logic to service
    //   if (vm.form._id) {
    //     vm.form.$update(successCallback, errorCallback);
    //   } else {
    //     vm.form.$save(successCallback, errorCallback);
    //   }

    //   function successCallback(res) {
    //     $state.go('forms.view', {
    //       formId: res._id
    //     });
    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }


  //on click of other checkbox
  // let otherCheckbox = document.getElementById("other");
  // console.log(otherCheckbox);

  // otherCheckbox.addEventListener("click", () => {
  //   if (this.classList.contains("display_none")) {
  //     otherCheckbox.classList.remove("display_none");
  //     otherCheckbox.disabled = false;
  //   }
  //   else {
  //     otherCheckbox.classList.add("display_none");
  //     otherCheckbox.disabled = true;
  //   }

  // });
}());
