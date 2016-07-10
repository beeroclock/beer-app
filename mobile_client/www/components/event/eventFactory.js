angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http, $rootScope) {

  url = 'http://localhost:8000';

  var acceptEvent = function(eventId, userId, username){
    console.log("+++ 9 eventFactory.js eventId, userId, username: ", eventId, userId, username)
    return $http({
      method: 'POST',
      url: url + '/acceptEvent/' + eventId,
      data: {
      userId: userId,
      username: username,
      acceptedLat: 30.30,
      acceptedLong: 118.1
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
