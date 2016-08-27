angular.module('app.AuthFactory', [])
.factory('AuthFactory', authFactory);

function authFactory($http) {

  var services = {};

  services.setTokenAndHttpHeaders = function (token, userId, callback) {
    $http.defaults.headers.common['beeroclock-token'] = token;
    $http.defaults.headers.common.userId = userId;
    if($http.defaults.headers.common['beeroclock-token'] && $http.defaults.headers.common.userId){
      callback(true)
    }else{
      callback(false)
    };
  }

  services.removeTokenAndHttpHeaders = function (callback) {
    $http.defaults.headers.common['beeroclock-token'] = null;
    $http.defaults.headers.common.userId = null;
    if($http.defaults.headers.common['beeroclock-token'] === null && $http.defaults.headers.common.userId === null){
      callback(true)
    }else{
      callback(false)
    };
  }

  return services;
}
