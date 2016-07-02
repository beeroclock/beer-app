angular.module('app.LoginController', [])
.controller('LoginController', function($scope, $state, $rootScope, LoginFactory){

  $scope.data = {};

  $scope.login = function(){
    LoginFactory.login($scope.data.username, $scope.data.password)
    .success(function (result) {
      $rootScope.userId = result.userId;
      LoginFactory.setTokenAndHttpHeaders(result['beeroclock-token'])
    })
    .error(function(result){
      console.log("+++ 10 loginController.js result: ", result)
    })
  };
});
