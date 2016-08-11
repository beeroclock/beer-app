angular.module('app.FriendsFactory', [])
  .factory('friendsFactory', friendsFactory);

function friendsFactory($http, apiUrl) {
  var services = {};

  services.getFriends = function() {
    return $http.get(apiUrl + '/friends')
      .then(sendData);
  }

  services.getUsers = function() {
    return $http.get(apiUrl + '/allUsers')
      .then(sendData);
  }


  services.friendshipUpdate = function(id, userResponse) {
    return $http({
      method: 'PUT',
      url: apiUrl + '/friendship',
      data: { friendId: id, userResponse: userResponse}
    });
  }

  function sendData(result) {
    return result.data;
  }

  return services;
}
