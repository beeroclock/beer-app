angular.module('app.SignupController', [])
.controller('SignupController', function($scope, $state, $rootScope, $ionicPopup, SignupFactory){

  $scope.data = {};

  $scope.signup = function(){
    SignupFactory.signup($scope.data.username, $scope.data.password, $scope.data.email)
    .success(function (result) {
      $rootScope.userId = result.userId;
      SignupFactory.setTokenAndHttpHeaders(result['beeroclock-token'])
    })
    .error(function(result){
      var popup = $ionicPopup.alert({
            title: 'Sign up failed!',
            template: 'Please enter a unique username and email'
          });
    })
  }
})
