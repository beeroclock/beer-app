angular.module('app.MainController', [])
.controller('MainController', function($scope, $state, $rootScope, $ionicPopup, MainFactory){

  $scope.friendsEvents = {};

  $scope.ActiveFriendsEvents = function(){
    console.log("+++ 7 mainController.js $rootScope.userId: ", $rootScope.userId)
    MainFactory.ActiveFriendsEvents($rootScope.userId)
    .success(function (result) {
      $scope.friendsEvents = result
      console.log("+++ 11 mainController.js $scope.friendsEvents: ", $scope.friendsEvents)
    })
  }

  $scope.ActiveFriendsEvents();
})
