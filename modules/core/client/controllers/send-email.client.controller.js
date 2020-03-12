(function() {
  'use strict';

  angular
    .module('core')
    .controller('SendEmailController', SendEmailController);


  SendEmailController.$inject = ['$scope', '$http'];

  function SendEmailController($scope, $http) {

    // Send email controller logic
    // ...

    $scope.postEmail = function(){
      console.log("email: " + $scope.message);

      var data = {
        "to": $scope.to,
        "cc": $scope.Cc,
        "bcc": $scope.Bcc,
        "subject": $scope.subject,
        "message": $scope.message,
        "file": $scope.file
      }

      console.log("file: ", $scope.file)
      // $http.post('/api/send-email', data).
      //   success(function(data, status, headers, config) {
      //     console.log("success");

      //   }).
      //   error(function(data, status, headers, config) {
      //     console.log("failed");
      //   });
    }

    init();

    function init() {
    }
  }
})();
