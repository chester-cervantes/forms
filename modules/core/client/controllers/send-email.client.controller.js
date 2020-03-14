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

    $scope.showModal = function (visible, elem) {
      if (!elem)
          elem = element;

      if (visible)
          $(elem).modal("show");                     
      else
          $(elem).modal("hide");
        }

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
          angular.element(document.getElementById('email-success')).css('display', '');
          var delay = 2000;
          setTimeout(function(){
            angular.element(document.getElementById('email-success')).css('display', 'none');
          }, delay);
          
          console.log("success");

        }).
        error(function(data, status, headers, config) {
          console.log("email error");
          setDisplayLoad(false);
          alert("Unable to send email");
          
        });
    }

    init();

    function init() {
      setDisplayLoad(true)
      angular.element(document.getElementById('load')).css('display', 'none')
      angular.element(document.getElementById('email-success')).css('display', 'none')
    
    }
  }
})();
