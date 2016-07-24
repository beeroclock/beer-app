angular.module('app.MainController', [])
.controller('MainController', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, GeoFactory, MainFactory){

  //List of events that friends have created and are active
  $scope.friendsEvents = {};
  //Single event. Clears data when user reaches Main state.
  $rootScope.currentEvent = null;
  $rootScope.myActiveEvent = null;
  $scope.activeEvent = false;
  //Get current active event, if any (does not need to use eventId)
  $scope.getMyEvent = function() {
    MainFactory.getMyEvent()
    .success(function (result) {
      if (!result) {
        $scope.activeEvent = true;
      }
      else{
        $scope.activeEvent = false;
        $rootScope.myActiveEvent = result;
      }
    })
  }
  //Create a new event
  $scope.createNewEvent = function() {
    var lat;
    var long;
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    })
    navigator.geolocation.getCurrentPosition(function(pos) {
      var lat = pos.coords.latitude;
      var long = pos.coords.longitude;
      MainFactory.createNewEvent(lat, long)
      .success(function (result) {
        $scope.loading = $ionicLoading.hide()
        $rootScope.myActiveEvent = result;
        $scope.activeEvent = false;
        var popup = $ionicPopup.alert({
          title: 'Event created',
          template: 'You have created an event! See your event by going to My Current Event'
        });
      })
      .error(function (err) {
        $scope.loading = $ionicLoading.hide()
        console.log("+++ 30 mainController.js err: ", err)
      })
    })
  }
  //Get user event using eventId for My Event button
  $scope.myEvent = function() {
    var activeEventId = $rootScope.myActiveEvent.id
    MainFactory.myEvent(activeEventId)
    .success(function(result) {
      $rootScope.currentEvent = result;
      $state.go('event')
    })
    .error(function(err) {
      console.log("+++ 53 mainController.js err: ", err)
    })
  }

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

  var initialize = function () {
    $scope.getMyEvent();
    $scope.ActiveFriendsEvents();
  }

  initialize();

})
