angular.module('app.GeoFactory', [])
.factory('GeoFactory', geoFactory);

function geoFactory() {

  //Currently not implemented anywhere
  var currentLocation = function(callback) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        return pos
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  var getCentralPoints = function (userLat, userLong, locationLat, locationLong) {

    centerPoints = {};

    centerPoints.centerLat = (userLat + locationLat) / 2;
    centerPoints.centerLong = (userLong + locationLong) / 2;

    return centerPoints;
  }

  var distance = function (lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (1=="K") { dist = dist * 1.609344; }
    if (1=="N") { dist = dist * 0.8684; }
    return dist;
  }

  return {
    currentLocation: currentLocation,
    getCentralPoints: getCentralPoints,
    distance: distance
  }

}
