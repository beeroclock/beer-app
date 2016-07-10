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
       var myLatlng = new google.maps.LatLng($scope.currentEventInView.ownerLat, $scope.currentEventInView.ownerLong);
    }else{
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
       var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
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
         $scope.loading.hide();
       }, function(error) {
         alert('Unable to get location: ' + error.message);
       });
     };

     $scope.clickTest = function() {
       alert('Example of infowindow with ng-click')
     };

  //Accept Event
  $scope.acceptEvent = function(eventId) {
    // GeoFactory.getLocation()
    // .then(function (locationResult) {
      EventFactory.acceptEvent(eventId, $rootScope.userId, $rootScope.username)
      .then(function(result) {
        $scope.userAttending = true;
        console.log("+++ 13 eventController.js result: ", result)
      })

    // })
  }
  var initialize = function () {
    isUserGoing();
    drawMap();
    // eventLoading();
  };

  initialize();

})
