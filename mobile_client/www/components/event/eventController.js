angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, EventFactory){

  //All data for current event
  $scope.currentEventInView = $rootScope.currentEvent.event

  //Attendees of current event
  $scope.currentEventAttendees = $rootScope.currentEvent.attendees;

  //User is attending this event
  $scope.userAttending = false;

  console.log("+++ 7 eventController.js $scope.currentEventInView: ", $scope.currentEventInView)

  var isUserGoing = function () {
    _.forEach($scope.currentEventAttendees, function (attendee) {
      console.log("+++ 11 eventController.js attendee: ", attendee)
      if(attendee.userId === $rootScope.userId){
        $scope.userAttending = true;
      }
    })
    // GeoFactory.getLocation()
    // .then(function (locationResult) {
    //   console.log("+++ 24 eventController.js locationResult: ", locationResult)
    // })
  }


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

  isUserGoing();

})
