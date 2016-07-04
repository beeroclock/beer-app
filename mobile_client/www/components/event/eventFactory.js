angular.module('app.EventFactory', [])
.factory('EventFactory', eventFactory);

function eventFactory($http) {

  url = 'http://localhost:8000';

  var acceptEvent = function(eventId){
    return $http.post(url + '/acceptEvent/' + eventId)
  };

  return {
    acceptEvent: acceptEvent
  };
}
