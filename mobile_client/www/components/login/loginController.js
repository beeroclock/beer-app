angular.module('app.LoginController', [])

.controller('LoginController', LoginController);

function LoginController($scope, $state) {
  $scope.data = {};
  $scope.login = function(){};
}
