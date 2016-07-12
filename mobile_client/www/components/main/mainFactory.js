angular.module('app.MainFactory', [])
.factory('MainFactory', mainFactory);

function mainFactory($http, apiUrl) {

  var ActiveFriendsEvents = function () {
    return $http.get(apiUrl + '/events')
  }

  var getEvent = function(eventId){
    return $http.get(apiUrl + '/events/' + eventId)
  };

  return {
    ActiveFriendsEvents: ActiveFriendsEvents,
    getEvent: getEvent
  }
}
