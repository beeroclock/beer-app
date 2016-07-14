angular.module('app.FriendsFactory', [])
  .factory('friendsFactory', friendsFactory);

function friendsFactory($http, apiUrl) {

  function getFriends() {
    return $http.get(apiUrl + '/friends')
      .then(sendData);
  }

  function getUsers() {
    return $http.get(apiUrl + '/allUsers')
      .then(sendData);
  }

  function sendData(result) {
    return result.data;
  }

  return {
    getFriends: getFriends,
    getUsers: getUsers
  };
}
