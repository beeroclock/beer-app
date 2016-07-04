angular.module('app.EventController', [])
.controller('EventController', function($scope, $state, $rootScope, $ionicPopup, EventFactory){

  $scope.currentEventInView = $rootScope.currentEvent.event
  $scope.currentEventAttendees = $rootScope.currentEvent.attendees;

  console.log("+++ 7 eventController.js $scope.currentEventInView: ", $scope.currentEventInView)

  //Accept Event
  $scope.acceptEvent = function(eventId) {
    EventFactory.acceptEvent(eventId)
    .then(function(result) {
      console.log("+++ 13 eventController.js result: ", result)
    })
  }

})
