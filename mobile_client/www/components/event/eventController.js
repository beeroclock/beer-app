angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $compile, EventFactory){
  //All data for current event
  $scope.currentEventInView = $rootScope.currentEvent.event

  console.log("$scope.currentEventInView: ", JSON.stringify($scope.currentEventInView, null, "\t"));

  //Attendees of current event
  $scope.currentEventAttendees = _.orderBy($rootScope.currentEvent.attendees, ['username'],['asc'])
  // $rootScope.currentEvent.attendees
  // $scope.currentEventAttendees = $rootScope.currentEvent.attendees;

  $scope.eventLoading = false;

  $scope.eventLocked = false;

  var isEventLocked = function() {
    console.log("+++ 18 eventController.js Here")
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
    // GeoFactory.getLocation()
    // .then(function (locationResult) {
    //   console.log("+++ 24 eventController.js locationResult: ", locationResult)
    // })
  }
  function drawMap() {
    console.log("+++ 30 eventController.js $scope.currentEventInView.ownerLat, $scope.currentEventInView.ownerLong: ", $scope.currentEventInView.ownerLat, $scope.currentEventInView.ownerLong)
    if($scope.currentEventInView.centerLat === null || $scope.currentEventInView.centerLat === undefined){
      console.log("+++ 50 eventController.js CenterLL defined")
       var myLatlng = new google.maps.LatLng($scope.currentEventInView.ownerLat, $scope.currentEventInView.ownerLong);
    }else{
      console.log("+++ 53 eventController.js centerLL Not defined")
       var myLatlng = new google.maps.LatLng($scope.currentEventInView.centerLat, $scope.currentEventInView.centerLong);
    }

       var mapOptions = {
         center: myLatlng,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };
       var map = new google.maps.Map(document.getElementById("map"),
           mapOptions);

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
         infowindow.open(map,marker);
       });

       $scope.map = map;
     }
     google.maps.event.addDomListener(window, 'load', drawMap);

     $scope.centerOnMe = function() {
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
           console.log("+++ 100 eventController.js pos: ", pos)
           $scope.foundLat= pos.coords.latitude
           $scope.foundLong = pos.coords.longitude
       }, function(error) {
         alert('Unable to get location: ' + error.message);
       });
     };

     $scope.clickLocation = function() {
       alert('Example of infowindow with ng-click')
     };

  //Accept Event
  $scope.acceptEvent = function() {

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      console.log("pos: ", JSON.stringify(pos, null, "\t"));
      $scope.loading = $ionicLoading.hide();
        EventFactory.acceptEvent(eventId, $rootScope.userId, $rootScope.username, pos.coords.latitude, pos.coords.longitude)
        .then(function (result) {
            $scope.userAttending = true;
            console.log("result: ", JSON.stringify(result, null, "\t"));
        })
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
    drawMap();
    userOwner();
    isEventLocked();
    // eventLoading();
  };

  initialize();

})
