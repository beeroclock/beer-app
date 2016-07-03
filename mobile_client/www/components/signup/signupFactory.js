angular.module('app.SignupFactory', [])
.factory('SignupFactory', signupFactory);

function signupFactory($http) {

  url = 'http://localhost:8000';

  var signup = function(username, password, email){
    return $http({
      method: 'POST',
      url: url + '/signup',
      data: {
        username: username,
        password: password,
        email: email
      }
    })
  }

  return {
    signup: signup
  }
}
