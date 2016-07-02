angular.module('app.LoginFactory', [])
.factory('LoginFactory', loginFactory);

function loginFactory($http) {

  url = 'http://localhost:8000';

  var login = function(username, password){
    return $http({
      method: 'POST',
      url: url + '/login',
      data: {
        username: username,
        password: password
      }
    })
  };

  return {
    login: login
  };
}
