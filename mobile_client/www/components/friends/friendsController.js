angular.module('app.FriendsController', [])
.controller('FriendsController', FriendsController);

function FriendsController($scope, FriendsFactory) {
  $scope.friendList = []; //will get data from db
  $scope.allUsers;

  $scope.allUsers = function(){
    FriendsFactory.allUsers()
    .success(function (result) {
      console.log("+++ 11 friendsController.js result: ", result)
    })
    .error(function (err) {
      console.log("+++ 14 friendsController.js err: ", err)
    })
  }

  $scope.allUsers();
}
