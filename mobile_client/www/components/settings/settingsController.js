angular.module('app.SettingsController', [])
.controller('SettingsController', function($scope, $state, $rootScope, $ionicPopup, SettingsFactory){

  $scope.data = {};

  $scope.changePassword = function(){
    SettingsFactory.changePassword($scope.data.password, $scope.data.newPassword)
    .then(function (result) {
      console.log("+++ 9 settingsController.js result: ", result)
      if (result.status === 202) {
        var popup = $ionicPopup.alert({
          title: 'Password updated',
          template: result.statusText
        });
      } else{

      };
    })

  }
})
