angular.module('app.FriendsFactory', [])
  .factory('FriendsFactory', friendsFactory);

function friendsFactory($http) {
  url = 'http://localhost:8000'; //needs to come from config

  function getFriends() {
    return $http.get(url + '/friends')
      .then(function(friends) {
        return friends.data;
      });
  }

  return {
    getFriends: getFriends
  };
}
