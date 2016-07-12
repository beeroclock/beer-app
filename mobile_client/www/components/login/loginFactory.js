angular.module('app.LoginFactory', [])
.factory('LoginFactory', loginFactory);

function loginFactory($http, apiUrl) {

  var login = function(username, password){
    return $http({
      method: 'POST',
      url: apiUrl + '/login',
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
