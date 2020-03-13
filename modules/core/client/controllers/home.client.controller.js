(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$http'];

  // Acknowledged from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  function timeConverter(UNIX_timestamp){
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

  function addWeather(weather_data) {

    var tbody = document.getElementById('weather_tbody');
    var row = tbody.insertRow(tbody.rows.length);

    var location_name = row.insertCell(0);
    var date_time = row.insertCell(1)
    var weather = row.insertCell(2);
    var temperature = row.insertCell(3);

    location_name.innerHTML = weather_data['name'];
    date_time.innerHTML = timeConverter(weather_data['dt']);
    weather.innerHTML = weather_data['weather']['0']['main'];
    temperature.innerHTML = weather_data['main']['temp'];
  }


  function HomeController($scope, $http) {
    var vm = this;

    // Weather API stuff
    $scope.getWeatherInfo = function(location) {
      var appid = "6a918a2e7455032b8e29775f764b46df";

      $http.post('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.weather_location + '&appid=' + appid).
        success(function(data, status, headers, config) {
          console.log(data);
          addWeather(data);
        }).
        error(function(data, status, headers, config) {

        });
    }

    // Google Map API Stuff:
    // load google maps api upon element loads
    $scope.loadScript = function () {
      let googleAPIKey = "AIzaSyDzJ-hVPlMpfSgk_VNIQJ0HYikoN1z5Dnk";

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleAPIKey + '&libraries=places';
      document.body.appendChild(script);
      setTimeout(function () {
        $scope.initMap();
      }, 100);
    }


    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    var map, infoWindow, mapOptions;

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
    $scope.initMap = function () {
      //the object has all the settings we can define for google maps
      mapOptions = {
        zoom: 12, // the zoom level of the map, the higher the further zoomed in., 1 is the world map.
        mapTypeControl: false, //disables the controls for satelite or different map terran settings
        streetViewControl: false, //disables the controls for street view control
        mapTypeId: 'roadmap' //Sets the map to default road map
      }

      // under google maps object, after document.getElementById, can set settings
      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      //set info window
      infoWindow = new google.maps.InfoWindow;

      if (navigator.geolocation) {

        let googleMapsLoadedPromise = new Promise((resolve, reject) => {

          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);

            // set map location marker
            map.setCenter(pos);

            // set the marker of the map
            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: 'I am here!'
            });
            marker.setMap(map);

            // console out current location name with reverse geo look up from lat long. Is async
            $scope.getLocationNameFromGeocode(pos.lat, pos.lng, (locationName) => {
              console.log("I am currently at: " + locationName)
            });

            // to remove marker:
            //marker.setMap(null);

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
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
              searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function () {
              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }
              // Clear out the old markers.
              markers.forEach(function (marker) {
                marker.setMap(null);
              });
              markers = [];

              // For each place, get the icon, name and location.
              var bounds = new google.maps.LatLngBounds();
              places.forEach(function (place) {
                if (!place.geometry) {
                  console.log("Returned place contains no geometry");
                  return;
                }
                var icon = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                  map: map,
                  icon: icon,
                  title: place.name,
                  position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }

                let placePos = place.geometry.location

                // console out current location name with reverse geo look up from lat long. Is async
                $scope.getLocationNameFromGeocode(placePos.lat, placePos.lng, (locationName) => {
                  console.log("Searched Location is at: " + locationName)
                })
              });
              map.fitBounds(bounds);
            });
          }
        })
      } else {
        // Browser doesn't support Geolocation
        $scope.handleLocationError(false, infoWindow, map.getCenter());
      }
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

        callBack(locationName)
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
