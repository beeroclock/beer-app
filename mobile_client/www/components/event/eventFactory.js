angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http, $rootScope, apiUrl) {

  var acceptEvent = function(eventId, userId, username, acceptedLat, acceptedLong){
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

  var getUberData = function (userLat, userLong, locationLat, locationLong) {
    return $http({
      method: 'POST',
      url: apiUrl + '/uber',
      data: {
        userLat: userLat,
        userLong: userLong,
        locationLat: locationLat,
        locationLong: locationLong
      }
    })
  }

  return {
    acceptEvent: acceptEvent,
    lockEvent: lockEvent,
    getUberData: getUberData
  };
}
