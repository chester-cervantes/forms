// Forms service used to communicate Forms REST endpoints
(function () {
  'use strict';

  angular
    .module('forms')
    .factory('FormsService', FormsService);

  FormsService.$inject = ['$resource'];

  function FormsService($resource) {
    return $resource (
      'api/forms/:formId',
      {},
      {
        update: {
          method: 'PUT',
          params: {
            formId: '@_id'
          }
        },
        create: {
          method: 'PUT',
          url: '/api/forms'
        }
      }
    );
  }
}());
