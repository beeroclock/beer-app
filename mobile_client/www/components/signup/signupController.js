angular.module('app.SignupController', [])
.controller('SignupController', function($scope, $state, $rootScope, $ionicPopup, SignupFactory, AuthFactory){

  $scope.data = {};

  $scope.signup = function(){
    SignupFactory.signup($scope.data.username, $scope.data.password, $scope.data.email)
    .success(function (result) {
      $rootScope.username = result.username;
      $rootScope.userId = result.userId;
      AuthFactory.setTokenAndHttpHeaders(result['beeroclock-token'], $rootScope.userId, function (result) {
          if (result) {
            $state.go('main')
          } else{
            var popup = $ionicPopup.alert({
              title: 'Signup failed!',
              template: 'No token detected'
            });
          };
      })
    })
    .error(function(result){
      var popup = $ionicPopup.alert({
            title: 'Sign up failed!',
            template: 'Please enter a unique username and email'
          });
    })
  }
})
