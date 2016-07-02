angular.module('app.LoginController', [])
.controller('LoginController', function($scope, $state, $rootScope, $ionicPopup, LoginFactory){

  $scope.data = {};

  $scope.login = function(){
    LoginFactory.login($scope.data.username, $scope.data.password)
    .success(function (result) {
      $rootScope.userId = result.userId;
      LoginFactory.setTokenAndHttpHeaders(result['beeroclock-token'], $rootScope.userId, function (result) {
          if (result) {
            $state.go('main')
          } else{
            var popup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'No token detected'
            });
          };
      })
    })
    .error(function(result){
      var popup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please enter correct username or password'
      });
    })
  };
});
