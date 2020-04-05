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
      var moreDetails = row.insertCell(4);
      id.innerHTML = array[j][0].innerText;
      location.innerHTML = array[j][1].innerText;
      dateTime.innerHTML = array[j][2].innerText;
      inspectorName.innerHTML = array[j][3].innerText;
      moreDetails.innerHTML = array[j][4].innerHTML;
    }
  }

  function comparatorIDAscending(a, b) {
    if (parseFloat(a[0].innerText) < parseFloat(b[0].innerText)) {
      return -1;
    }
    if (parseFloat(a[0].innerText) > parseFloat(b[0].innerText)) {
      return 1;
    }
    return 0;
  }

  function comparatorIDDescending(a, b) {
    if (parseFloat(a[0].innerText) < parseFloat(b[0].innerText)) {
      return 1;
    }
    if (parseFloat(a[0].innerText) > parseFloat(b[0].innerText)) {
      return -1;
    }
    return 0;
  }

  function comparatorDateAscending(a, b) {
    var dateA = new Date ( a[2].innerText ).toISOString ();
    var dateB = new Date ( b[2].innerText ).toISOString ();

    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  }

  function comparatorLocationAscending(a, b) {
    if (a[1].innerText < b[1].innerText) {
      return -1;
    }
    if (a[1].innerText > b[1].innerText) {
      return 1;
    }
    return 0;
  }

  function comparatorLocationDescending(a, b) {
    if (a[1].innerText < b[1].innerText) {
      return 1;
    }
    if (a[1].innerText > b[1].innerText) {
      return -1;
    }
    return 0;
  }

  function comparatorDateDescending(a, b) {
    var dateA = new Date ( a[2].innerText ).toISOString ();
    var dateB = new Date ( b[2].innerText ).toISOString ();

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  }

  function comparatorNameAscending(a, b) {
    if (a[3].innerText < b[3].innerText) {
      return -1;
    }
    if (a[3].innerText > b[3].innerText) {
      return 1;
    }
    return 0;
  }

  function comparatorNameDescending(a, b) {
    if (a[3].innerText < b[3].innerText) {
      return 1;
    }
    if (a[3].innerText > b[3].innerText) {
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

    $scope.SortBy = function (comparator) {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      switch(comparator) {
        case 'By ID (Ascending)':
          formsArray.sort(comparatorIDAscending);
          break;
        case 'By ID (Descending)':
          formsArray.sort(comparatorIDDescending);
          break;
        case 'By Location (Ascending)':
          formsArray.sort(comparatorLocationAscending);
          break;
        case 'By Location (Descending)':
          formsArray.sort(comparatorLocationDescending);
          break;
        case 'By Date (Ascending)':
          formsArray.sort(comparatorDateAscending);
          break;
        case 'By Date (Descending)':
          formsArray.sort(comparatorDateDescending);
          break;
        case 'By Name (Ascending)':
          formsArray.sort(comparatorNameAscending);
          break;
        case 'By Name (Descending)':
          formsArray.sort(comparatorNameDescending);
          break;
        default:
        // code block
      }
      createTableFromArray(formsArray, 'forms-table-body');
      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerText = comparator;
      $scope.ToggleDropDownMenu();
      $scope.SearchForms();
    };

    $scope.SortByDateDescending = function () {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      formsArray.sort(comparatorDateDescending);
      createTableFromArray(formsArray, 'forms-table-body');

      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerHTML = 'By Date (Descending)';

      $scope.ToggleDropDownMenu();
      $scope.SearchForms();
    };
    $scope.SortByNameAscending = function () {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      formsArray.sort(comparatorNameAscending);
      createTableFromArray(formsArray, 'forms-table-body');

      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerText = 'By Name (Ascending)';

      $scope.ToggleDropDownMenu();
      $scope.SearchForms();
    };
    $scope.SortByNameDescending = function () {
      let formsTable = document.getElementById('forms-table');
      let formsArray = getArrayFromTable(formsTable);
      formsArray.sort(comparatorNameDescending);
      createTableFromArray(formsArray, 'forms-table-body');

      let dropDownMenuText = document.getElementById("dropdown1-span");
      dropDownMenuText.innerText = 'By Name (Descending)';

      $scope.ToggleDropDownMenu();
      $scope.SearchForms();
    };

    $scope.ToggleDropDownMenu = function () {
      let dropDownMenu = document.getElementById("dropdown1");
      dropDownMenu.classList.toggle("is-active");
    };

    $scope.ConvertDate = function ( date ) {
      return new Date ( date ).toLocaleString ();
    }

    $scope.SearchForms = function () {
      let input = document.getElementById("searchString");
      let filter = input.value.toUpperCase();
      let tableBody = document.getElementById("forms-table-body");
      let tr = tableBody.getElementsByTagName("tr");
      let txtValue = null;

      // Loop through all table rows, and hide those who don't match the search query
      for (let i = 0; i < tr.length; i++) {
        if (tr) {
          txtValue = tr[i].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }


  }

}());
