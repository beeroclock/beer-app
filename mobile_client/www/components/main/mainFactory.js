angular.module('app.MainFactory', [])
.factory('MainFactory', mainFactory);

function mainFactory($http, apiUrl) {
   var services = {};

   services.getMyEvent = function(){
    return $http.get(apiUrl + '/getMyEvent')
  }

   services.createNewEvent = function(lat, long){
    return $http({
      method: 'POST',
      url: apiUrl + '/events',
      data: {
        ownerLat: lat,
        ownerLong: long
      }
    })
  }

   services.myEvent = function(activeEventId) {
    return $http.get(apiUrl + /events/ + activeEventId)
  }

   services.ActiveFriendsEvents = function () {
    return $http.get(apiUrl + '/events')
  }

   services.getEvent = function(eventId){
    return $http.get(apiUrl + '/events/' + eventId)
  };

  return services;
}
