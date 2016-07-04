angular.module('app.MainController', [])
.controller('MainController', function($scope, $state, $rootScope, $ionicPopup, MainFactory){

  //List of events that friends have created and are active
  $scope.friendsEvents = {};
  //Single event. Clears data when user reaches Main state.
  $rootScope.currentEvent = null;

  //Get active friend's events
  $scope.ActiveFriendsEvents = function(){
    MainFactory.ActiveFriendsEvents($rootScope.userId)
    .success(function (result) {
      $scope.friendsEvents = result;
    })
    .error(function(err) {
      var popup = $ionicPopup.alert({
        title: 'Error',
        template: 'Something went wrong with the API'
      });
    })
  }

  // Get individual event for Event State
  $scope.getEvent = function(eventId){
    MainFactory.getEvent(eventId)
    .success(function (event) {
      $rootScope.currentEvent = event;
      $state.go('event')
    })
    .error(function(err) {
      var popup = $ionicPopup.alert({
        title: 'Error',
        template: 'Something went wrong with the API'
      });
    })
  }

  $scope.ActiveFriendsEvents();
})
