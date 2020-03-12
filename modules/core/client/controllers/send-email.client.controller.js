(function() {
  'use strict';

  angular
    .module('core')
    .controller('SendEmailController', SendEmailController);


  SendEmailController.$inject = ['$scope', '$http'];

  function setDisplayLoad(isDisplay){
    angular.element(document.getElementById('load')).css('display', isDisplay? '' : 'none');
  }


  
  function SendEmailController($scope, $http) {

    // Send email controller logic
    // ...

    $scope.postEmail = function(){
      setDisplayLoad(true);
      angular.element(document.getElementById('load')).css('display', '');

      var data = {
        "to": $scope.to,
        "cc": $scope.Cc,
        "bcc": $scope.Bcc,
        "subject": $scope.subject,
        "message": $scope.message,
      }

      $http.post('/api/send-email', data).
        success(function(data, status, headers, config) {
          setDisplayLoad(false);
          console.log("email sent");
          angular.element(document.getElementById('email-success')).css('display', '')
          console.log("success");

        }).
        error(function(data, status, headers, config) {
          console.log("email error");
          setDisplayLoad(false);
          console.log("failed");
          
        });
    }

    init();

    function init() {
      // setDisplayLoad(false)
      angular.element(document.getElementById('load')).css('display', 'none')
      angular.element(document.getElementById('email-success')).css('display', 'none')
      var elementText = angular.element(document.getElementById('#email_error_modal'));
      elementText.modal('show')


    }
  }
})();
