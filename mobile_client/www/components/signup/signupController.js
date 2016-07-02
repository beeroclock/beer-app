angular.module('app.SignupController', [])
.controller('SignupController', function($scope, $state, $rootScope, SignupFactory){

  $scope.data = {};

  $scope.signup = function(){
    SignupFactory.signup(data.username, data.password, data.email)
  }
})
