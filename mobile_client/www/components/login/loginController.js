angular.module('app.LoginController', [])
.controller('LoginController', function($scope, $state, $rootScope, $ionicPopup, LoginFactory){

  $scope.data = {};

  $scope.login = function(){
    LoginFactory.login($scope.data.username, $scope.data.password)
    .success(function (result) {
      $rootScope.userId = result.userId;
      LoginFactory.setTokenAndHttpHeaders(result['beeroclock-token'])
    })
    .error(function(result){
      var popup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please enter correct username or password'
      });
    })
  };
});
