angular.module('app.LoginFactory', [])
.factory('LoginFactory', loginFactory);

function loginFactory($http) {

  url = 'http://localhost:8000';

  var setTokenAndHttpHeaders = function (token, userId, callback) {
    $http.defaults.headers.common['beeroclock-token'] = token;
    $http.defaults.headers.common.userId = userId;
    if($http.defaults.headers.common['beeroclock-token'] && $http.defaults.headers.common.userId){
      callback(true)
    }else{
      callback(false)
    };
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
