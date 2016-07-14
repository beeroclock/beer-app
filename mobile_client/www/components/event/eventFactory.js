angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http, $rootScope, apiUrl) {

  var acceptEvent = function(eventId, userId, username, acceptedLat, acceptedLong){
    console.log("+++ 9 eventFactory.js eventId, userId, username: ", eventId, userId, username)
    return $http({
      method: 'POST',
      url: apiUrl + '/acceptEvent/' + eventId,
      data: {
      userId: userId,
      username: username,
      acceptedLat: acceptedLat,
      acceptedLong: acceptedLong
      }
    })
  }

  var lockEvent = function (eventId){
    return $http.put(apiUrl + '/lockEvent/' + eventId)
  }

  return {
    acceptEvent: acceptEvent,
    lockEvent: lockEvent
  };
}
