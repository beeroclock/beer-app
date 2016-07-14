angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http, $rootScope) {

  url = 'http://localhost:8000';

  var acceptEvent = function(eventId, userId, username, acceptedLat, acceptedLong){
    console.log("+++ 9 eventFactory.js eventId, userId, username: ", eventId, userId, username)
    return $http({
      method: 'POST',
      url: url + '/acceptEvent/' + eventId,
      data: {
      userId: userId,
      username: username,
      acceptedLat: acceptedLat,
      acceptedLong: acceptedLong
      }
    })
  }

  var lockEvent = function (eventId){
    return $http.put(url + '/lockEvent/' + eventId)
  }

  return {
    acceptEvent: acceptEvent,
    lockEvent: lockEvent
  };
}
