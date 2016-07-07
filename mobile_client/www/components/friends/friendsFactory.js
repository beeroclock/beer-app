angular.module('app.FriendsFactory', [])
.factory('FriendsFactory', friendsFactory);

function friendsFactory($http) {

  url = 'http://localhost:8000';

  var allUsers = function(){
    return $http.get(url + '/allUsers')
  }

  return{
    allUsers: allUsers
  }
}
