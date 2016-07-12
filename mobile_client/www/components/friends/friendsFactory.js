angular.module('app.FriendsFactory', [])
  .factory('FriendsFactory', friendsFactory);

function friendsFactory($http, apiUrl) {

  function getFriends() {
    return $http.get(apiUrl + '/friends')
      .then(function(friends) {
        return friends.data;
      });
  }

  function getUsers() {
    return $http.get(apiUrl + '/allUsers')
      .then(function(users) {
        return users.data;
      });
  }

  return {
    getFriends: getFriends,
    getUsers: getUsers
  };
}
