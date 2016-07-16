angular.module('app.MainFactory', [])
.factory('MainFactory', mainFactory);

function mainFactory($http, apiUrl) {


  var getMyEvent = function(){
    return $http.get(apiUrl + '/getMyEvent')
  }

  var createNewEvent = function(lat, long){
    return $http({
      method: 'POST',
      url: apiUrl + '/events',
      data: {
        ownerLat: lat,
        ownerLong: long
      }
    })
  }

  var myEvent = function(activeEventId) {
    return $http.get(apiUrl + /events/ + activeEventId)
  }

  var ActiveFriendsEvents = function () {
    return $http.get(apiUrl + '/events')
  }

  var getEvent = function(eventId){
    return $http.get(apiUrl + '/events/' + eventId)
  };

  return {
    getMyEvent: getMyEvent,
    createNewEvent: createNewEvent,
    myEvent: myEvent,
    ActiveFriendsEvents: ActiveFriendsEvents,
    getEvent: getEvent
  }
}
