// Forms service used to communicate Forms REST endpoints
(function () {
  'use strict';

  angular
    .module('forms')
    .factory('FormsService', FormsService);

  FormsService.$inject = ['$resource'];

  function FormsService ( $resource ) {
    return $resource (
      'api/forms/:formId',
      {
        formId: '@_id'
      },
      {
        update: {
          method: 'PUT',
          url: '/api/forms/:formId'
        },
        create: {
          method: 'POST',
          url: '/api/forms'
        },
        remove: {
          method: 'DELETE',
          url: '/api/forms/:formId'
        }
      }
    );
  }
}());
