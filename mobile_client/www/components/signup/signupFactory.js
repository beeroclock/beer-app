angular.module('app.SignupFactory', [])
.factory('SignupFactory', signupFactory);

function signupFactory($http, apiUrl) {

  var signup = function(username, password, email){
    return $http({
      method: 'POST',
      url: apiUrl + '/signup',
      data: {
        username: username,
        password: password,
        email: email
      }
    })
  };

  return {
    signup: signup
  }
}
