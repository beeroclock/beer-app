angular.module('app.SettingsFactory', [])
.factory('SettingsFactory', settingsFactory);

function settingsFactory($http, apiUrl) {

  var changePassword = function(password, newPassword){
    return $http({
      method: 'PATCH',
      url: apiUrl + '/changePassword',
      data: {
        password: password,
        newPassword: newPassword
      }
    })
  }

  var logout = function() {
    return $http.get(apiUrl + '/logout')
  }


  return {
    changePassword: changePassword,
    logout: logout
  }
}
