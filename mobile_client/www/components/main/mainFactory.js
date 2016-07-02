angular.module('app.MainFactory', [])
.factory('MainFactory', mainFactory);

function mainFactory($http) {

  url = 'http://localhost:8000';

  var ActiveFriendsEvents = function () {
    return $http.get(url + '/events')
  }

  return {
    ActiveFriendsEvents: ActiveFriendsEvents
  }
}
