angular.module('app.FriendsController', [])
.controller('FriendsController', FriendsController);

function FriendsController($scope, FriendsFactory) {
  $scope.friends = {};

  //on init
  activate();

  //////////
  function activate() {
    return FriendsFactory.getFriends()
      .then(function(data) {
        $scope.friends.list = data;
        console.log('$scope.friends.list', $scope.friends.list);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
