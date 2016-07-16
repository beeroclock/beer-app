angular.module('app.GeoFactory', [])
.factory('GeoFactory', geoFactory);

function geoFactory() {

  var getLocation = function(){
    console.log("+++ 7 geoFactory.js here")
    // var posOptions = {timeout: 10000, enableHighAccuracy: false};
    navigator.geolocation.getCurrentPosition(function(pos) {
      //  {
      //   // currentLat: pos.coords.latitude,
      //   // currentLong: pos.coords.longitude
      // }
    })
  }

  return {
    getLocation: getLocation
  }

}
