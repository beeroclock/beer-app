angular.module('app.SettingsFactory', [])
.factory('SettingsFactory', settingsFactory);

function settingsFactory($http, apiUrl) {

  var services = {};

  services.changePassword = function(password, newPassword){
    return $http({
      method: 'PATCH',
      url: apiUrl + '/changePassword',
      data: {
        password: password,
        newPassword: newPassword
      }
    })
  }

  services.logout = function() {
    return $http.get(apiUrl + '/logout')
  }

  return services;
}
