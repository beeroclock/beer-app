angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $compile, EventFactory, GeoFactory){
  //All data for current event
  $scope.currentEventInView = $rootScope.currentEvent.event
  //Attendees of current event
  $scope.currentEventAttendees = _.orderBy($rootScope.currentEvent.attendees, ['username'],['asc'])
  //On load, check if the event is locked. Check if the event belongs to the signed in user, if so draw the map
  $scope.eventLocked = false;
  $scope.isUserOwner = true;
  $scope.userAttending = false;
  $scope.uber = false;
  $scope.uberMessageDisplay = false;
  $scope.usersMessage = 'Friends going:'
  //Location data for user and location
  var locationData = {
    userLocationLat: null,
    userLocationLong: null,
    locationLat: null,
    locationLong: null
  }
  //Check status of event on load. This is trigger by init function below
  var eventStatus = function() {
    if($scope.currentEventInView.active === false){
      $scope.eventLocked = true;
    }
    //If no users are going at this time
    if($scope.currentEventAttendees.length === 0){
      $scope.usersMessage = 'No other friends.'
    }
    //Check if the logged in user is going to this event
    _.forEach($scope.currentEventAttendees, function (attendee, index) {
      if(attendee.userId === $rootScope.userId){
        $scope.userAttending = true;
        //to draw map if user is owner
        locationData = {
          userLocationLat: attendee.attendeeLat,
          userLocationLong: attendee.attendeeLong,
          locationLat: $rootScope.currentEvent.event.locationLat,
          locationLong: $rootScope.currentEvent.event.locationLong
        }
      }
    })
    //Draw map depending on whether user is currently signed in or if user is attending
    if($scope.currentEventInView.userId === $rootScope.userId){
      $scope.isUserOwner = false;
      $scope.userAttending = true;
      drawMap($scope.currentEventInView, $scope.currentEventInView.ownerLat, $scope.currentEventInView.ownerLong)
    }else if ($scope.userAttending) {
      drawMap($scope.currentEventInView, locationData.userLocationLat, locationData.userLocationLong)
    }
  }
  //get data from uber for ride from user's location to central location
  var getUberData = function (userLat, userLong, locationLat, locationLong) {
    if(userLat && userLong && locationLat && locationLong){
      EventFactory.getUberData(userLat, userLong, locationLat, locationLong)
      .success(function (uberData) {
        if(uberData.statusCode === 422){
          $scope.uberMessage = uberData.body.message
          $scope.uberMessageDisplay = true;
        } else {
          $scope.uberData = uberData.prices[1];
          $scope.locationPhone = $scope.currentEventInView.locationPhone;
          $scope.uber = true;

        }
      })
      .error(function (err) {
        console.log("+++ 61 eventController.js UberAPI error: ", err)
      })
    }
  }
  //Draws map. This function used by Accept Event and on controller load. EventData is in $scope.currentEventInView
  function drawMap(eventData, userLat, userLong) {
    //if no location has been selected do not draw the map
    if(eventData.locationLat === null){
      return;
    }
    getUberData(userLat, userLong, eventData.locationLat, eventData.locationLong);

    google.maps.event.addDomListener(window, 'load', drawMap);

    var map

    map = null;
    //get the central points between the bar and the user
    var centralPoints = GeoFactory.getCentralPoints(userLat, userLong, eventData.locationLat, eventData.locationLong)

    //create gMaps objects for the map
    var locationLatlng = new google.maps.LatLng(eventData.locationLat, eventData.locationLong);
    var userLatLng = new google.maps.LatLng(userLat, userLong);
    var centralLatlng = new google.maps.LatLng(centralPoints.centerLat, centralPoints.centerLong);

    //determine distance between both location and user lat/longs.
    var mapDist =  GeoFactory.distance(userLat, userLong, eventData.locationLat, eventData.locationLong);

    //set mapZoom to display both location and user on map
    var mapZoom;
    if(mapDist > 0 && mapDist < 0.75){
      mapZoom = 15;
    } else if(mapDist > 0.75 && mapDist < 1.5){
      mapZoom = 14;
    } else if(mapDist > 1.5 && mapDist < 3){
      mapZoom = 13;
    } else if (mapDist > 3 && mapDist < 6){
      mapZoom = 12;
    } else if (mapDist > 6 && mapDist < 12){
      mapZoom = 11;
    } else if (mapDist > 12 && mapDist < 24){
      mapZoom = 10;
    } else if (mapDist > 24 && mapDist < 48){
      mapZoom = 9;
    } else if (mapDist > 48 && mapDist < 96){
      mapZoom = 8;
    } else if (mapDist > 96 && mapDist < 192){
      mapZoom = 7;
    } else if (mapDist > 192 && mapDist < 384){
      mapZoom = 6;
    } else if (mapDist > 384 && mapDist < 768){
      mapZoom = 5;
    } else if (mapDist > 768 && mapDist < 1536){
      mapZoom = 4;
    } else if (mapDist > 1536 && mapDist < 3072){
      mapZoom = 3;
    } else if (mapDist > 3072 && mapDist < 6144){
      mapZoom = 2;
    } else if (mapDist > 6144){
      mapZoom = 1;
    }

    //Map's central and zoom start options
    var mapOptions = {
      disableDefaultUI: true,
      center: centralLatlng,
      zoom: mapZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //to draw map and pins
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var locationPinColor = "00b200";
    var locationPin = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=L|" + locationPinColor + "|000000");

    var userPinColor = "FE7569";
    var userPin = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=U|" + userPinColor + "|000000");

    //Marker + infowindow + angularjs compiled ng-click
    var locationMarker = new google.maps.Marker({
      position: locationLatlng,
      map: map,
      icon: locationPin,
      title: 'Location\'s pin'
    });

    var userMarker = new google.maps.Marker({
      position: userLatLng,
      map: map,
      icon: userPin,
      title: 'User\'s pin'
    });

    google.maps.event.addListener(locationMarker, 'click', function() {
      var contentString = "<div><a ng-click='clickLocation()'>Central Bar!</a></div>";
      var compiled = $compile(contentString)($scope);
      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });
      infowindow.open(map, locationMarker);
    });

    google.maps.event.addListener(userMarker, 'click', function() {
      var contentString = "<div><a ng-click='clickLocation()'>You are here!</a></div>";
      var compiled = $compile(contentString)($scope);
      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });
      infowindow.open(map, userMarker);
    });

    //Set line between locations
    var path = new google.maps.Polyline({
      path: [
        locationLatlng,
        userLatLng
      ],
      geodesic: true,
      strokeColor: '#4d4dff',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    path.setMap(map);

    //Adds map to template
    $scope.map = map;

  }

  //Accept Event
  $scope.acceptEvent = function() {
    $scope.buttonDisabled = true;
    currentLocation(function (currentPosition){
      var eventId = $scope.currentEventInView.id
      var currentLat = currentPosition.coords.latitude;
      var currentLong = currentPosition.coords.longitude;
      EventFactory.acceptEvent(eventId, $rootScope.userId, $rootScope.username, currentLat, currentLong)
      .success(function (acceptedEvent) {
        $scope.currentEventInView = acceptedEvent;
        drawMap($scope.currentEventInView, currentLat, currentLong);
        var popup = $ionicPopup.alert({
          title: 'you\'re going!',
          template: 'You have accepted this event successfully'
        });
        $scope.userAttending = true;
        $scope.buttonDisabled = false;
      })
      .error(function(err) {
        var popup = $ionicPopup.alert({
          title: 'Something went wrong',
          template: err
        });
        $scope.buttonDisabled = false;
      })
    })
  };

  //Get user's current location
  var currentLocation = function(callback) {
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    })
    .then(function() {
      $scope.showBeer = true;
    });
    navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.loading = $ionicLoading.hide().then(function () {
          $scope.showBeer = false;
        });
        callback(pos)
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.lockEvent = function(eventId) {
    EventFactory.lockEvent(eventId)
    .then(function () {
      $scope.eventLocked = true;
      var popup = $ionicPopup.alert({
        title: 'Event Locked',
        template: 'This event\'s location is now locked'
      });
    })
  }

  var init = function () {
    eventStatus();
  };

  init();

})
