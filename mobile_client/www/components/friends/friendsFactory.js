angular.module('app.FriendsFactory', [])
  .factory('FriendsFactory', friendsFactory);

function friendsFactory($http, apiUrl) {

  function getFriends() {
    return $http.get(apiUrl + '/friends')
      .then(function(friends) {
        return friends.data;
      });
  }

  return {
    getFriends: getFriends
  };
}
