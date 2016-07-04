angular.module('app.GeoFactory', [])
.factory('GeoFactory', geoFactory);

function geoFactory($http, $window, $q, $location, $ionicPlatform, $cordovaGeolocation) {

  url = 'http://localhost:8000';

  var getLocation = function(){
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  console.log("+++ 10 geoFactory.js $cordovaGeolocation: ", $cordovaGeolocation)
  $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
         console.log("+++ 13 geoFactory.js position: ", position)
         var lat  = position.coords.latitude
         var long = position.coords.longitude
      })
  }



  // $scope.getLocation = function(){
  //   var deferred = $q.defer();

  //   if (!$window.navigator.geolocation) {
  //     deferred.reject("Geolocation not supported");
  //   } else {
  //     $window.navigator.geolocation.getCurrentPosition(function(position){
  //       deferred.resolve(position);
  //     }, function(err){
  //       deferred.reject(err);
  //     });
  //   }
  //   console.log("+++ 20 geoFactory.js deferred.promise: ", deferred.promise)
  //   return deferred.promise;
  // };

  return {
    getLocation: getLocation
  }

}
