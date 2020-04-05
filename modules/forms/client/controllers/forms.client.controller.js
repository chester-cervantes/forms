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
    vm.user = Authentication.user;
    vm.showEmailModal = false;

    $scope.pdfUrl = window.location.origin + '/api/forms/pdf/' + vm.form.project_id;

    function remove () {
      if ( vm.form._id === null ) {
        return;
      }

      if ( $window.confirm('Are you sure you want to delete this form?' ) ) {
        if ( form ) {
          form.$remove (  );
          Notification.success ( 'User deleted successfully!' );
          setTimeout(() => { $state.go ( 'forms.list' ); }, 1000);

        }
        else {
          vm.user.$remove ( function () {
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

    /* ================= Email API  STUFF =============== */

    vm.openEmailModal = openEmailModal;
    vm.closeEmailModal = closeEmailModal;
    function openEmailModal() {
      vm.showEmailModal = true;
    }

    function closeEmailModal() {
      vm.showEmailModal = false;
    }

    $scope.postEmail = function(){

      closeEmailModal();

      const data = {
        "to": $scope.email,
        "message": $scope.message,
        "id": vm.form.project_id,
      };

      console.log(data);

      $http.post('/api/send-email', data).
      success(function(data, status, headers, config) {
        console.log("email sent");

        const delay = 1000;
        setTimeout(function(){
        }, delay);
        Notification.success ( { message: '<i class="glyphicon glyphicon-ok"></i> Email sent!' });
      }).
      error(function(data, status, headers, config) {
        Notification.error ( { message: '<i class="glyphicon glyphicon-remove"></i> Unable to send email!' });
      });
    };





    //modal
    vm.showGoogleMapModal = false;

    vm.pac_input = "";
    vm.selectedWeather = "";
    vm.selectedTemp = "";
    vm.selectedLocation = "";

  /* ================= Weather API  STUFF =============== */


    // we will be using lat, lng for weather location
    $scope.getWeatherInfo = function (location, callback) {
      var appid = "6a918a2e7455032b8e29775f764b46df";
      // $http.post('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.weather_location + '&appid=' + appid).
      $http.post('http://api.openweathermap.org/data/2.5/weather?lat=' + location.lat + '&lon=' + location.lng + '&appid=' + appid).
        success(function (data, status, headers, config) {
          //add the weather information
          let weather = data.weather[0].description;
          let temp = round(convertKelvinToCelsius(data.main.temp), 2);
          callback(weather, temp);
        }).
        error(function (data, status, headers, config) {
          alert("Error: failed to retrieve weather api data!");
        });
    };


    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    // Acknowledge from https://scottontechnology.com/temperature/kelvin-to-celsius-javascript-code/
    function convertKelvinToCelsius(kelvin) {
      if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
      } else {
        return (kelvin - 273.15);
      }
    }


    // Acknowledged from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    function timeConverter(UNIX_timestamp) {
      let date = new Date(UNIX_timestamp * 1000);
      // Hours part from the timestamp
      let hours = date.getHours();
      // Minutes part from the timestamp
      let minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      let seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    /* ================= GOOGLE MAPS STUFF =============== */
    function updateSelectedWeatherTempInput(weather, temp) {
      vm.selectedWeather = weather;
      vm.selectedTemp = temp;
    }

    vm.openGoogleMapModal = openGoogleMapModal;
    vm.selectLocation = selectLocation;

    function selectLocation() {
      vm.form.project_location = vm.selectedLocation;
      vm.form.temperature = vm.selectedWeather;
      vm.form.weather = vm.selectedTemp;

      //close modal
      closeGoogleMapModal();
    }

    function openGoogleMapModal() {
      vm.selectedLocation = vm.form.project_location;

      //load script for google map, load google maps scripts
      $scope.loadScript((pos, locationName) => {
        $scope.getWeatherInfo(pos, (weather, temp) => {
          updateSelectedWeatherTempInput(weather, temp);
        });

        vm.selectedLocation = locationName;
        vm.showGoogleMapModal = true;
      });
    }

    vm.closeGoogleMapModal = closeGoogleMapModal;

    function closeGoogleMapModal() {
      vm.showGoogleMapModal = false;

      //clear modal data
      vm.pac_input = "";
      vm.selectedWeather = "";
      vm.selectedTemp = "";
      vm.selectedLocation = "";
    }

    vm.recenterLocation = recenterLocation;
    function recenterLocation() {
      $scope.goToMyLocation();
    }


    $scope.initGoogleMapApi = function (callback) {
      if (!googleMapAPIInit && typeof google === 'undefined') {
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

    //function for getting "current location"; add to auto load data
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
              //set input of
              callback(pos, locationName);
            })
          });
        }
        //location permission was not added
        else {
          alert("Permission for Google Maps was not granted, please enable it to get current location");
          callback(null);
        }
      });
    }

    // load google maps view api
    $scope.loadScript = function (callback) {
      $scope.initGoogleMapApi(() => {
        $scope.initMap((location, locationName) => {
          callback(location, locationName);
        });
      });
    }

    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    var map, mapOptions, searchBox, geocoder, latlng;

    // function to handle recentering of map to current location
    $scope.goToMyLocation = function () {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        //re center map to new current location and get reverse look up for location name
        map.setCenter(pos);
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
        // map = new google.maps.Map(document.getElementById('map'), mapOptions);
        map = new google.maps.Map()
      }

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

            //current location name with reverse geo look up from lat long. Is async
            $scope.getLocationNameFromGeocode(pos.lat, pos.lng, (locationName) => {
              callback(pos, locationName);
              resolve(true);
            });
          }, function () {
            $scope.handleLocationError(true, map.getCenter());
              callback(null);
            resolve(false);

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

              if (places.length == 0) {
                vm.selectedLocation = "";
                return;
              }
              else {
                let currLocation = places[0];
                let formattedAddress = currLocation.formatted_address;
                let lat = currLocation.geometry.location.lat();
                let lng = currLocation.geometry.location.lng();

                var pos = {
                  lat: lat,
                  lng: lng
                };

                //set selected location
                vm.selectedLocation = formattedAddress;

                //update weather infomration
                $scope.getWeatherInfo(pos, (weather, temp) => {
                  updateSelectedWeatherTempInput(weather, temp);
                });c

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
        $scope.handleLocationError(false, map.getCenter());
      }
    }

    // function for getting the location name of a geolocation
    $scope.getLocationNameFromGeocode = function (latitude, longitude, callBack) {
      if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
        return false;
      }

      var locationName;
      if (!geocoder) {
        geocoder = new google.maps.Geocoder();
      }

      if (!latlng) {
        latlng = new google.maps.LatLng(latitude, longitude)
      }

      // Reverse Geocoding using google maps api.
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            locationName = results[1].formatted_address;
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
    $scope.handleLocationError = function (browserHasGeolocation, pos) {
      // infoWindow.setPosition(pos);
      // infoWindow.setContent(browserHasGeolocation ?
      //   'Error: The Geolocation service failed.' :
      //   'Error: Your browser doesn\'t support geolocation.');
      // infoWindow.open(map);
    }


    /* ================= Init  map and weather details on page load for create form only =============== */
    vm.initMapWeatherTempInfo = initMapWeatherTempInfo;


    function initMapWeatherTempInfo() {
      //only update information for "create forms"
      if (!vm.form._id) {
        //get current location data
        $scope.getCurrentLocation((pos, locationName) => {
          vm.form.project_location = locationName;
          //get weather data
          $scope.getWeatherInfo(pos, (weather, temp) => {
            //set location, weather, temp
            vm.form.weather = weather;
            vm.form.temperature = temp;
          });
        });
      }
    }
    initMapWeatherTempInfo();
  }
}());
