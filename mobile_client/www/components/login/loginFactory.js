angular.module('app.LoginFactory', [])
.factory('LoginFactory', loginFactory);

function loginFactory($http) {

  url = 'http://localhost:8000';

  var setTokenAndHttpHeaders = function (token) {
    $http.defaults.headers.common['beeroclock-token'] = token;
    $http.get(url + '/app')
  }

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
    login: login,
    setTokenAndHttpHeaders: setTokenAndHttpHeaders
  };
}
