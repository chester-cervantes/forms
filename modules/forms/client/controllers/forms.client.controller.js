(function () {
  'use strict';

  // Forms controller
  angular
    .module('forms')
    .controller('FormsController', FormsController);

  FormsController.$inject = [ '$scope', '$state', '$window', 'Authentication', 'formResolve', 'FormsService', '$http' , 'Notification'];

  function FormsController ( $scope, $state, $window, Authentication, form, FormsService, $http , Notification ) {
    var vm = this;

    var googleMapAPIInit = false;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = form;
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.updateFormOnProjectID = updateFormOnProjectID;
    vm.user = Authentication.user;

    function remove () {
      if ( vm.form._id === null ) {
        return;
      }

      if ( $window.confirm('Are you sure you want to delete this form?' ) ) {
        if ( form ) {
          form.$remove (  );
          Notification.success ( 'User deleted successfully!' );
          console.log("if")
          setTimeout(() => { $state.go ( 'forms.list' ); }, 1000);

        }
        else {
          vm.user.$remove ( function () {
            console.log("else")

            $state.go ( 'forms.list' );
            Notification.success ( { message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function cancel () {
      if ( !$window.confirm ( 'Are you sure you want to cancel (all unsaved progress will be lost)?' ) ) {
        return;
      }
      $state.go('forms.list', {} );
    }

    function successCallback () {
      console.log ( "SUCCESS HERE CALLED" );
      setTimeout(() => { $state.go ( 'forms.list' ); }, 1000);
      Notification.success ( { message: '<i class="glyphicon glyphicon-ok"></i> Form saved successfully!' });
    }

    function errorCallback ( res ) {
      vm.error = res.data.message;
      Notification.error ( { message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form save error!' });
    }

    // Save Form
    function save ( isValid ) {
      if ( !isValid ) {
        $scope.$broadcast ( 'show-errors-check-validity' , 'vm.fieldInspectionReviewForm' );
        return false;
      }

      if ( vm.form._id ) {
        vm.form.$update ( successCallback (), function ( err ) {});
      }
      else {
        vm.form.$create ( successCallback (), function ( err ) {} );
      }
    }

    function updateFormOnProjectID () {
      if ( form.project_id == null ) {
        return;
      }

      var recentForm = FormsService.$GetLatestFormWithID ( form.project_id );
      if ( recentForm == null ) {
        return;
      }

      vm.form.locationName = recentForm.locationName;
      vm.form.dev_company_name = recentForm.dev_company_name;
      vm.form.contractor_company = recentForm.contractor_company;
      // need to get the latest posted form with the same project ID
      // update modal
    }














    vm.openGoogleMapModal = openGoogleMapModal;
    vm.selectLocation = selectLocation;

    function selectLocation() {
      //set the updated location
      let projectLocationInput = document.getElementById("project_location");
      let selectionMapInput = document.getElementById("selectedMapLocation")
      projectLocationInput.value = selectionMapInput.value;

      //close modal
      closeGoogleMapModal();
    }

    function openGoogleMapModal() {
      //load previously set value
      let projectLocationInput = document.getElementById("project_location");
      let selectionMapInput = document.getElementById("selectedMapLocation");
      selectionMapInput.value = projectLocationInput.value;

      //load script for google map, load google maps scripts
      $scope.loadScript(() => {
        let googleMapModal = document.getElementById("googleMapModal");
        googleMapModal.classList.add("is-active", "is-clipped");
      });
    }

    vm.closeGoogleMapModal = closeGoogleMapModal;

    function closeGoogleMapModal() {
      let googleMapModal = document.getElementById("googleMapModal");
      if (googleMapModal.classList.contains("is-active")) {
        googleMapModal.classList.remove("is-active");
      }
      if (googleMapModal.classList.contains("is-clipped")) {
        googleMapModal.classList.remove("is-clipped");
      }

      //clear modal
      let selectedLocation = document.getElementById("selectedMapLocation");
      selectedLocation.value = "";
    }


    $scope.initGoogleMapApi = function (callback) {
      if (!googleMapAPIInit) {
        let googleAPIKey = "AIzaSyDzJ-hVPlMpfSgk_VNIQJ0HYikoN1z5Dnk";
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleAPIKey + '&libraries=places';
        document.body.appendChild(script);
        googleMapAPIInit = true;
        setTimeout(function () {
          callback();
        }, 200);
      }
      else {
        callback();
      }
    }


    //function for getting "current location"; TODO add to auto load data
    $scope.getCurrentLocation = function (callback) {
      $scope.initGoogleMapApi(() => {
        //permission granted
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            //re center map to new current location and get reverse look up for location name
            $scope.getLocationNameFromGeocode(pos.lat, pos.lng, (locationName) => {
              console.log("Re-centering to: " + locationName) //this is the location name that we will be added to the input later TODO
            })
          });
        }
        //location permission was not added
        else {
          alert("Permission for Google Maps was not granted, please enable it to get current location");
        }
      });
    }

    // load google maps view api
    $scope.loadScript = function (callback) {
      $scope.initGoogleMapApi(() => {
        $scope.initMap(callback);
      });
    }

    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    var map, infoWindow, mapOptions, searchBox;

    // Go to my location button
    var currLocationBtn = document.getElementById("curr-location-btn");
    currLocationBtn.addEventListener('click', function () {
      $scope.goToMyLocation();
    });

    // function to handle recentering of map to current location
    $scope.goToMyLocation = function () {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        //re center map to new current location and get reverse look up for location name
        map.setCenter(pos);
        $scope.getLocationNameFromGeocode(pos.lat, pos.lng, (locationName) => {
          console.log("Re-centering to: " + locationName)
        })
      });
    }

    //initialize map
    $scope.initMap = function (callback) {
      //the object has all the settings we can define for google maps
      mapOptions = {
        zoom: 12, // the zoom level of the map, the higher the further zoomed in., 1 is the world map.
        mapTypeControl: false, //disables the controls for satelite or different map terran settings
        streetViewControl: false, //disables the controls for street view control
        mapTypeId: 'roadmap' //Sets the map to default road map
      }

      // under google maps object, after document.getElementById, can set settings
      if(!map) {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }

      //set info window
      infoWindow = new google.maps.InfoWindow;

      var markers = [];

      if (navigator.geolocation) {

        let googleMapsLoadedPromise = new Promise((resolve, reject) => {

          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // set map location marker
            map.setCenter(pos);

            // set the marker of the map
            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: 'I am here!'
            });
            marker.setMap(map);
            markers.push(marker);

            // console out current location name with reverse geo look up from lat long. Is async
            // $scope.getLocationNameFromGeocode(pos.lat, pos.lng, (locationName) => {
            //   console.log("I am currently at: " + locationName)
            // });

            resolve(true)
          }, function () {
            $scope.handleLocationError(true, infoWindow, map.getCenter());
            resolve(false)
          });
        })

        //add google map search box on promise finished only if it sucessfully loads
        googleMapsLoadedPromise.then((googleMapsLoaded) => {
          if (googleMapsLoaded) {
            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            if (!searchBox) {
              searchBox = new google.maps.places.SearchBox(input);
            }
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
              searchBox.setBounds(map.getBounds());
            });

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function () {
              var places = searchBox.getPlaces();
              let selectedLocation = document.getElementById("selectedMapLocation");

              if (places.length == 0) {
                selectedLocation.value = "";
                return;
              }
              else {
                let currLocation = places[0];
                let formattedAddress = currLocation.formatted_address;
                console.log(currLocation);
                let lat = currLocation.geometry.location.lat();
                let lng = currLocation.geometry.location.lng();

                var pos = {
                  lat: lat,
                  lng: lng
                };

                //set selected location
                selectedLocation.value = formattedAddress;

                // Clear out the old markers.
                markers.forEach(function (marker) {
                  marker.setMap(null);
                });
                markers = [];

                //add new marker
                // set the marker of the map
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  title: 'I am here!'
                });
                marker.setMap(map);
                markers.push(marker);

                // set map location marker center
                map.setCenter(pos);
              }
            });
          }
        })
      } else {
        // Browser doesn't support Geolocation
        $scope.handleLocationError(false, infoWindow, map.getCenter());
      }

      callback();
    }

    // function for getting the location name of a geolocation
    $scope.getLocationNameFromGeocode = function (latitude, longitude, callBack) {
      if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        return false;
      }

      var locationName;
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(latitude, longitude)

      // Reverse Geocoding using google maps api.
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            locationName = results[1].formatted_address;
            console.log("Reverse long lat look up for location name: ", results[1]);
          }
          else {
            locationName = "Unknown";
          }
        }
        else {
          locationName = "Couldn't find location. Error code: " + status;
        }
        callBack(locationName);
      });
    }

    //the user did not allow for location for browser
    $scope.handleLocationError = function (browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

  }
}());
