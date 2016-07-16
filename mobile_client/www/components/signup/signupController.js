angular.module('app.SignupController', [])
.controller('SignupController', function($scope, $state, $rootScope, $ionicPopup, SignupFactory, AuthFactory){

  $scope.data = {};
  $rootScope.isAuthenticated = false;

  $scope.signup = function(){
    SignupFactory.signup($scope.data.username, $scope.data.password, $scope.data.email)
    .success(function (result) {
      $rootScope.userId = result.userId;
      $rootScope.username = result.username;
      AuthFactory.setTokenAndHttpHeaders(result['beeroclock-token'], result.userId, function (authResult) {
          if (authResult) {
            $rootScope.isAuthenticated = true;
            $state.go('main')
          } else{
            var popup = $ionicPopup.alert({
              title: 'Sign up failed!',
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
