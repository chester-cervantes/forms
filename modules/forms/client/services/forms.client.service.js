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

  function GetLatestFormWithID ( form_id ) {
    if ( form_id == null ) {
      return null;
    }

    return {
      project_location: "Test Location",
      dev_company_name: "Test Dev",
      contractor_company: "Test Contractor", 
    }
  }
}());
