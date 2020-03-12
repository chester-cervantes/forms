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

      $scope.isDisplay = true;

      $http.post('/api/send-email', data).
        success(function(data, status, headers, config) {
          setDisplayLoad(false);
          angular.element(document.getElementById('email-success')).css('display', '')
          console.log("success");

        }).
        error(function(data, status, headers, config) {
          setDisplayLoad(false);
          console.log("failed");
          angular.element(document.getElementById('email-success')).css('display', '')
        });
    }

    init();

    function init() {
      // setDisplayLoad(false)
      angular.element(document.getElementById('load')).css('display', 'none')
      angular.element(document.getElementById('email-success')).css('display', 'none')
    }
  }
})();
