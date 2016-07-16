angular.module('app.SettingsController', [])
.controller('SettingsController', function($scope, $state, $rootScope, $ionicPopup, SettingsFactory, AuthFactory){

  $scope.data = {};

  $scope.changePassword = function(){
    SettingsFactory.changePassword($scope.data.password, $scope.data.newPassword)
    .then(function (result) {
      if (result.status === 202) {
        var popup = $ionicPopup.alert({
          title: 'Password updated',
          template: result.statusText
        });
        $scope.data = {};
      } else{
        var popup = $ionicPopup.alert({
          title: 'Password not updated',
          template: result.statusText
        });
        $scope.data = {};
      };
    })
  }

  $scope.logout = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Logout',
       template: 'Are you sure you want to logout?'
     });

     confirmPopup.then(function(res) {
       if(res) {
         SettingsFactory.logout()
         .then(function(result) {
           if(result.status === 200){
             $rootScope.userId = null;
             $rootScope.myActiveEvent = null;
             AuthFactory.removeTokenAndHttpHeaders(function (result) {
                 if (result) {
                   $state.go('login')
                 } else{
                   var popup = $ionicPopup.alert({
                     title: 'Not Logged Out',
                     template: 'Something went wrong'
                   });
                 };
             })
           }
         })
       } else {
         var popup = $ionicPopup.alert({
           title: 'Not Logged Out',
           template: 'Something went wrong'
         });
       }
     });
   };
})
