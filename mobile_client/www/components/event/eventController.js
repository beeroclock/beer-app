angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $compile, EventFactory){
  //All data for current event
  $scope.currentEventInView = $rootScope.currentEvent.event

  //Attendees of current event
  $scope.currentEventAttendees = _.orderBy($rootScope.currentEvent.attendees, ['username'],['asc'])
  console.log("+++ 8 eventController.js $scope.currentEventAttendees: ", $scope.currentEventAttendees)

  //Map will be drawn in this scope
  $scope.map

  $scope.eventLoading = false;

  //On load, check if the event is locked and if the event belongs to the signed in user
  $scope.eventLocked = false;
  $scope.isUserOwner = true;

  var eventStatus = function() {
    if($scope.currentEventInView.active === false){
      $scope.eventLocked = true;
    if($scope.currentEventInView.userId === $rootScope.userId){
      $scope.isUserOwner = false;
    }
    }
  }

  //User is attending this event
  $scope.userAttending = false;

  var isUserGoing = function () {
    _.forEach($scope.currentEventAttendees, function (attendee) {
      if(attendee.userId === $rootScope.userId){
        $scope.userAttending = true;
      }
    })
    if ($scope.userAttending) {
      drawMap($scope.currentEventInView)
    }
  }

  function drawMap(eventData) {

    google.maps.event.addDomListener(window, 'load', drawMap);

    var map
    map = null;

    var myLatlng = new google.maps.LatLng(eventData.ownerLat, eventData.ownerLong);

    // $scope.locationName = eventData.yelpData[0].name
    // $scope.locationAddress = eventData.yelpData[0].location.display_address

    var mapOptions = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickLocation()'>Central Bar!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var myMarker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Owner\'s location'
    });

    google.maps.event.addListener(myMarker, 'click', function() {
      infowindow.open(map, myMarker);
    });

    $scope.map = map;
  }

  $scope.clickLocation = function() {
    alert('Example of infowindow with ng-click')
  };

  //Accept Event
  $scope.acceptEvent = function() {
    $scope.currentLocation(function (currentPosition){
      var eventId = $scope.currentEventInView.id
      var currentLat = currentPosition.coords.latitude;
      var currentLong = currentPosition.coords.longitude;

      EventFactory.acceptEvent(eventId, $rootScope.userId, $rootScope.username, currentLat, currentLong)
      .success(function (acceptedEvent) {
        $scope.currentEventInView = acceptedEvent;
        $scope.userAttending = true;
        drawMap($scope.currentEventInView);
        var popup = $ionicPopup.alert({
          title: 'you\'re going!',
          template: 'You have accepted this event successfully'
        });
      })
      .error(function(err) {
        var popup = $ionicPopup.alert({
          title: 'Something went wrong',
          template: err
        });
      })
    })
  };

  $scope.currentLocation = function(callback) {

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    }).then(function() {
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
      console.log("+++ 108 eventController.js Event Locked")
      var popup = $ionicPopup.alert({
        title: 'Event Locked',
        template: 'This event\'s location is now locked'
      });
    })
  }

  var initialize = function () {
    isUserGoing();
    eventStatus();
    // drawMap($scope.currentEventInView);
    // eventLoading();
  };

  initialize();

})
