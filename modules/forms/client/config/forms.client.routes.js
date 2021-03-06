(function () {
  'use strict';

  angular
    .module('forms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('forms', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('forms.list', {
        url: '/viewForms',
        templateUrl: 'modules/forms/client/views/list-forms.client.view.html',
        controller: 'FormsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Forms List'
        }
      })
      .state('forms.search', {
        url: '/viewForms/search',
        templateUrl: 'modules/forms/client/views/list-forms.client.view.html',
        controller: 'FormsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Forms List Search {{ formResolve.name }}'
        }
      })
      .state('forms.create', {
        url: '/create',
        templateUrl: 'modules/forms/client/views/field-inspection-review-form.client.view.html',
        controller: 'FormsController',
        controllerAs: 'vm',
        resolve: {
          formResolve: newForm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Forms Create'
        }
      })
      .state('forms.edit', {
        url: '/:formId/edit',
        templateUrl: 'modules/forms/client/views/field-inspection-review-form.client.view.html',
        controller: 'FormsController',
        controllerAs: 'vm',
        resolve: {
          formResolve: getForm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Form {{ formResolve.name }}'
        }
      })
      .state('forms.view', {
        url: '/:formId',
        templateUrl: 'modules/forms/client/views/view-form.client.view.html',
        controller: 'FormsController',
        controllerAs: 'vm',
        resolve: {
          formResolve: getForm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Form {{ formResolve.name }}'
        }
      });
  }

  getForm.$inject = ['$stateParams', 'FormsService'];

  function getForm($stateParams, FormsService) {
    return FormsService.get({
      formId: $stateParams.formId
    }).$promise;
  }

  newForm.$inject = ['FormsService'];

  function newForm(FormsService) {
    return new FormsService();
  }
}());
