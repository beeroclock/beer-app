var _ = require('lodash');

exports.getCentralPoints = function (attendeesList, eventOwnerLat, eventOwnerLong, callback) {

  var points = [];

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
  var usersLats = [];
  var usersLongs = [];

  _.forEach(points, function (pointsSet) {
    usersLats.push(pointsSet.lat)
    usersLongs.push(pointsSet.long)
  })

  var latsSum = _.reduce(usersLats, function(sum, n) {
      return sum + n;
    }, 0)

  var longsSum = _.reduce(usersLongs, function(sum, n) {
      return sum + n;
    }, 0)

  centerPoints = {};

  centerPoints.centerLat = latsSum/numberOflocations;
  centerPoints.centerLong = longsSum/numberOflocations;

  callback(centerPoints);
}
