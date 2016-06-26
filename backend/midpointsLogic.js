var points = [
  {lat: 40.7143528, long: -74.0059731},
  {lat: 41.8781136, long: -87.6297982},
  {lat: 33.7489954, long: -84.3879824}
]

var numberOflocations = points.length

var radianPoints = []
var cartesianPoints = [];
var weightedCartesianPoints = [];
var weightedCartesianOrdered = {};
var midpointRadians = {};
var finalPoints = {};

var toRadians = function(points){
  for(var i = 0; i < numberOflocations; i++){
    var temp = {}
    var radians = Math.PI/180
    temp.lat = (points[i].lat * radians)
    temp.long = (points[i].long * radians)
    radianPoints.push(temp)
  }
}

var cartesian = function (cartesianPoints){
  for(var i = 0; i < numberOflocations; i++){
    var tempObj = {};
    tempObj.x = Math.cos(radianPoints[i].lat) * Math.cos(radianPoints[i].long);
    tempObj.y = Math.cos(radianPoints[i].lat) * Math.sin(radianPoints[i].long);
    tempObj.z = Math.sin(radianPoints[i].lat);
    weightedCartesianPoints.push(tempObj);
  }
}

var weightedCartesian = function(weightedCartesianPoints){
  var weightedCartesianTemp = [];
  var tempObjx = [];
  var tempObjy = [];
  var tempObjz = [];
  for(var i = 0; i < numberOflocations; i++){
    tempObjx.push(weightedCartesianPoints[i].x);
    tempObjy.push(weightedCartesianPoints[i].y);
    tempObjz.push(weightedCartesianPoints[i].z);
  }
  weightedCartesianTemp.push(tempObjx);
  weightedCartesianTemp.push(tempObjy);
  weightedCartesianTemp.push(tempObjz);

  for(var i = 0; i < numberOflocations; i++){
    var subtotal = weightedCartesianTemp[i].reduce(function(a,b){
      return a*b;
    })
    if (i === 0){
      weightedCartesianOrdered.x = (subtotal/numberOflocations);
    }
    if (i === 1){
      weightedCartesianOrdered.y = (subtotal/numberOflocations);
    }
    if (i === 2){
      weightedCartesianOrdered.z = (subtotal/numberOflocations);
    }
  }
}

var convertToMidpoints = function (weightedCartesianOrdered){
  midpointRadians.long = Math.atan2(weightedCartesianOrdered.y, weightedCartesianOrdered.x)
  var hyp = Math.sqrt((weightedCartesianOrdered.x * weightedCartesianOrdered.x) + (weightedCartesianOrdered.y * weightedCartesianOrdered.y))
  midpointRadians.lat = Math.atan2(weightedCartesianOrdered.z, hyp)
}

var radiansToPoints = function(midpointRadians){
  finalPoints.lat = midpointRadians.lat * (180/Math.PI)
  finalPoints.long = midpointRadians.long * (180/Math.PI)
}

toRadians(points);
cartesian(radianPoints);
weightedCartesian(weightedCartesianPoints);
convertToMidpoints(weightedCartesianOrdered)
radiansToPoints(midpointRadians)
console.log(finalPoints)
