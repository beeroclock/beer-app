angular.module('app.FriendsController', [])
.controller('FriendsController', FriendsController);

function FriendsController($scope) {
  $scope.friendList = []; //will get data from db
}
