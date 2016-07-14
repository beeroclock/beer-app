angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http, $rootScope, apiUrl) {

  var acceptEvent = function(eventId, userId, username){
    console.log("+++ 9 eventFactory.js eventId, userId, username: ", eventId, userId, username)
    return $http({
      method: 'POST',
      url: apiUrl + '/acceptEvent/' + eventId,
      data: {
      userId: userId,
      username: username,
      acceptedLat: 30.30,
      acceptedLong: 118.1
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
