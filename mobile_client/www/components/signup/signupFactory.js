angular.module('app.SignupFactory', [])
.factory('SignupFactory', signupFactory);

function signupFactory($http) {

  url = 'http://localhost:8000';

  var setTokenAndHttpHeaders = function (token) {
    $http.defaults.headers.common['beeroclock-token'] = token;
    $http.get(url + '/app')
  }

  var signup = function(username, password){
    console.log("+++ 14 signupFactory.js HERE")
  }

  return {
    setTokenAndHttpHeaders: setTokenAndHttpHeaders
  }
}
