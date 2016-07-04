angular.module('app.MainFactory', [])
.factory('MainFactory', mainFactory);

function mainFactory($http) {

  url = 'http://localhost:8000';

  var ActiveFriendsEvents = function () {
    return $http.get(url + '/events')
  }

  var getEvent = function(eventId){
    return $http.get(url + '/events/' + eventId)
  };

  return {
    ActiveFriendsEvents: ActiveFriendsEvents,
    getEvent: getEvent
  }
}
