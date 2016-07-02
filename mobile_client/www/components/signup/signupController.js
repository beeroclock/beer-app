angular.module('app.SignupController', [])
.controller('SignupController', function($scope, $state, $rootScope, SignupFactory){

  $scope.data = {};

  $scope.signup = function(){
    SignupFactory.signup($scope.data.username, $scope.data.password, $scope.data.email)
    .success(function (result) {
      $rootScope.userId = result.userId;
      SignupFactory.setTokenAndHttpHeaders(result['beeroclock-token'])
    })
    .error(function(result){
      console.log("+++ 10 loginController.js result: ", result)
    })
  }
})
