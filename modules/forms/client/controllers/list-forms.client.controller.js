(function () {
  'use strict';

  angular
    .module('forms')
    .controller('FormsListController', FormsListController);

  FormsListController.$inject = ['FormsService' , '$http', '$scope'];

  function getArrayFromTable(table) {
    var array = [];
    for (let i = 1; i < table.rows.length; i++) {
      var tr = table.rows[i];
      array.push(tr.cells);
    }
    return array;
  }

  function createTableFromArray(array, tableId) {
    var formsTableBody = document.getElementById(tableId);
    formsTableBody.innerHTML = " ";
    for (let j = 0; j < array.length; j++) {
      var row = formsTableBody.insertRow(j);
      var id = row.insertCell(0);
      var location = row.insertCell(1);
      var dateTime = row.insertCell(2);
      var inspectorName = row.insertCell(3);

      id.innerHTML = array[j][0].innerText;
      location.innerHTML = array[j][1].innerText;
      dateTime.innerHTML = array[j][2].innerText;
      inspectorName.innerHTML = array[j][3].innerText;
    }
  }

  function comparatorIdAscending(a, b) {
    if (parseFloat(a[0].innerText) < parseFloat(b[0].innerText)) {
      return -1;
    }
    if (parseFloat(a[0].innerText) > parseFloat(b[0].innerText)) {
      return 1;
    }
    return 0;
  }

  function comparatorIdDescending(a, b) {
    if (parseFloat(a[0].innerText) < parseFloat(b[0].innerText)) {
      return 1;
    }
    if (parseFloat(a[0].innerText) > parseFloat(b[0].innerText)) {
      return -1;
    }
    return 0;
  }

  function FormsListController(FormsService , $http, $scope) {
    var vm = this;
    vm.forms = {};

    $http.get ( '/api/forms' )
    .success ( function (data, status, headers, config) {
      console.log ( "success status = " + status ); // DEBUG
      vm.forms = data;
    } )
    .error ( function (data, status, headers, config) {
      console.log ( "error status = " + status ); // DEBUG
      console.log ( "error data = " + data.message ); // DEBUG
    } );

    $scope.SortByIdAscending = function () {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      formsArray.sort(comparatorIdAscending);
      createTableFromArray(formsArray, 'forms-table-body');

      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerText = 'By ID (Ascending)';

      $scope.ToggleDropDownMenu();
    };

    $scope.SortByIdDescending = function () {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      formsArray.sort(comparatorIdDescending);
      createTableFromArray(formsArray, 'forms-table-body');

      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerHTML = 'By ID (Descending)';

      $scope.ToggleDropDownMenu();
    };

    $scope.ToggleDropDownMenu = function () {
      let dropDownMenu = document.getElementById("dropdown1");
      dropDownMenu.classList.toggle("is-active");
    };

    $scope.searchKeyWord = null;
    $scope.SearchForms = function () {
      console.log($scope.searchKeyWord);

      $http.get ( '/api/forms' )
        .success ( function (data, status, headers, config) {
          console.log ( "success search status = " + status ); // DEBUG
          vm.forms = data;
        } )
        .error ( function (data, status, headers, config) {
          console.log ( "error search status = " + status ); // DEBUG
          console.log ( "error search data = " + data.message ); // DEBUG
        } );

      for (let i = 0; i < vm.forms.length; i++) {
        console.log( vm.forms[i] );
      }
    }


  }

}());
