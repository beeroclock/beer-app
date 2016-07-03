angular.module('app.SettingsFactory', [])
.factory('SettingsFactory', settingsFactory);

function settingsFactory($http) {

  url = 'http://localhost:8000';

  var changePassword = function(password, newPassword, callback){
    return $http({
      method: 'PATCH',
      url: url + '/changePassword',
      data: {
        password: password,
        newPassword: newPassword
      }
    })

  }
  return {
    changePassword: changePassword
  }
}
