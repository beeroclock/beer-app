var _ = require('lodash');

/// Following logic from this site http://www.geomidpoint.com/example.html

exports.getCentralPoints = function(attendeesList, eventOwnerLat, eventOwnerLong, callback){
  var points = [], radianPoints = [], cartesianPoints = [], weightedCartesianPoints = [], weightedCartesianOrdered = {}, midpointRadians = {}, centerPoints = {}, weightedCartesianTemp = [], tempObjx = [], tempObjy = [], tempObjz = [], radians = Math.PI/180;

  points.push({
    lat: eventOwnerLat,
    long: eventOwnerLong
  })

  _.forEach(attendeesList, function (attendee) {
    points.push({
      lat: attendee.attendeeLat,
      long: attendee.attendeeLong
    })
  })

  var numberOflocations = points.length;
  // var numberOflocations = 2191.5;

  // var points = [{lat: 40.7143528, long: -74.0059731}, {lat: 41.8781136, long: -87.6297982}, {lat: 33.7489954, long: -84.3879824}];

  _.forEach(points, function (point) {
    radianPoints.push({
      lat: point.lat * radians,
      long: point.long * radians
    })
  })

  // Convert lat/long to cartesian (x,y,z) coordinates
  _.forEach(radianPoints, function(radianPoint) {
    weightedCartesianPoints.push({
      x: Math.cos(radianPoint.lat) * Math.cos(radianPoint.long),
      y: Math.cos(radianPoint.lat) * Math.sin(radianPoint.long),
      z: Math.sin(radianPoint.lat)
    });
  })

  _.forEach(weightedCartesianPoints, function (weightedCartesianPoint) {
    tempObjx.push(weightedCartesianPoint.x);
    tempObjy.push(weightedCartesianPoint.y);
    tempObjz.push(weightedCartesianPoint.z);
  })

  weightedCartesianTemp.push(tempObjx);
  weightedCartesianTemp.push(tempObjy);
  weightedCartesianTemp.push(tempObjz);

  //Compute combined weighted cartesian coordinate
  _.forEach(weightedCartesianTemp, function  (weightedCartesian, index) {
    var subtotal = _.reduce(weightedCartesian, function(sum, n) {
      return sum + n;
    }, 0)
    if (index === 0){
      // weightedCartesianOrdered.x = (subtotal/numberOflocations);
      weightedCartesianOrdered.x = ((0.20884915*1095.75 + 0.03079231*730.5 + 0.08131173*365.25)/2191.5)
      // weightedCartesianOrdered.x = ((0.20884915*1 + 0.03079231*1 + 0.08131173*1)/3)
    }
    if (index === 1){
      // weightedCartesianOrdered.y = (subtotal/numberOflocations);
      weightedCartesianOrdered.y = (((-0.728630226)*1095.75 + (-0.74392960)*730.5 + (-0.82749399)*365.25)/2191.5)
      // weightedCartesianOrdered.y = (((-0.728630226)*1 + (-0.74392960)*1 + (-0.82749399)*1)/3)
    }
    if (index === 2){
      // weightedCartesianOrdered.z = (subtotal/numberOflocations);
      weightedCartesianOrdered.z = ((0.65228829*1095.75 + 0.66754818*730.5 + 0.55555565*365.25)/2191.5)
      // weightedCartesianOrdered.z = ((0.65228829*1 + 0.66754818*1 + 0.55555565*1)/3)
    }
  })
  console.log("weightedCartesianOrdered: ", JSON.stringify(weightedCartesianOrdered, null, "\t"));
  //   34.15,-118.132
  // 34.15,-117.121
  // 33.35,-117.121
  // 33.83614949074748,-120.13561755601279
  //Convert cartesian coordinate to latitude and longitude for the midpoint
  midpointRadians.long = Math.atan2(weightedCartesianOrdered.y, weightedCartesianOrdered.x)
  var hyp = Math.sqrt(weightedCartesianOrdered.x * weightedCartesianOrdered.x + weightedCartesianOrdered.y * weightedCartesianOrdered.y)
  midpointRadians.lat = Math.atan2(weightedCartesianOrdered.z, hyp)

  //Convert midpoint lat and lon from radians to degrees
  centerPoints.centerLat = midpointRadians.lat * (180/Math.PI)
  centerPoints.centerLong = midpointRadians.long * (180/Math.PI)
  callback(centerPoints);
}






















