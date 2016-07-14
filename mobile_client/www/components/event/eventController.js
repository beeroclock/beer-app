angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $compile, EventFactory){
  //All data for current event
  $scope.currentEventInView = $rootScope.currentEvent.event

  console.log("+++ 6 eventController.js $scope.currentEventInView: ", JSON.stringify($scope.currentEventInView, null, "\t"));

  //Attendees of current event
  $scope.currentEventAttendees = _.orderBy($rootScope.currentEvent.attendees, ['username'],['asc'])
  // $rootScope.currentEvent.attendees
  // $scope.currentEventAttendees = $rootScope.currentEvent.attendees;

  $scope.eventLoading = false;

  $scope.eventLocked = false;

  var isEventLocked = function() {
    if($scope.currentEventInView.active === false){
      $scope.eventLocked = true;
    }
  }

  $scope.isUserOwner = true;

  var userOwner = function (){
    if($scope.currentEventInView.userId === $rootScope.userId){
      $scope.isUserOwner = false;
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

  $scope.latOnMap;
  $scope.longOnMap;

  function drawMap(eventData) {
    var map
    map = null;
    if(eventData.centerLat === null || eventData.centerLat === undefined){
      var myLatlng = new google.maps.LatLng(eventData.centerLat, eventData.centerLong);
    }else{
      var myLatlng = new google.maps.LatLng(eventData.centerLat, eventData.centerLong);
    };
    $scope.latOnMap = eventData.centerLat;
    $scope.longOnMap = eventData.centerLong;
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickLocation()'>Central Bar!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    $scope.map = map;
  }

  google.maps.event.addDomListener(window, 'load', drawMap);

  $scope.currentLocation = function(callback) {
    console.log("+++ 81 eventController.js CurrentLocation")
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading = $ionicLoading.hide();
        $scope.foundLat = pos.coords.latitude
        $scope.foundLong = pos.coords.longitude
        callback(pos)
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

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
        $scope.userAttending = true;
        drawMap(acceptedEvent)
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
    userOwner();
    isEventLocked();
    drawMap($scope.currentEventInView);
    // eventLoading();
  };

  initialize();

})
