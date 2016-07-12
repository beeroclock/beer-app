angular.module('app.FriendsController', [])
  .controller('FriendsController', FriendsController);

function FriendsController($scope, $ionicModal, FriendsFactory) {
  $scope.friends = {};
  $scope.users = {};
  $scope.modals = {};

  $scope.getUsers = getUsers;
  $scope.openModal = openModal;
  $scope.closeModal = closeModal;

  //on init
  activate();




  //////////
  function activate() {
    //modal setup
    $ionicModal.fromTemplateUrl('friends-search-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function(modal) {
        $scope.modals.search = modal;
      });

    $ionicModal.fromTemplateUrl('friends-request-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function(modal) {
        $scope.modals.request = modal;
      });

    //fetch friends
    FriendsFactory.getFriends()
      .then(function(data) {
        $scope.friends.list = data;
        console.log('$scope.friends.list', $scope.friends.list);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function getUsers() {
    return FriendsFactory.getUsers()
      .then(function(data) {
        $scope.users.results = data;
        console.log('$scope.users.results', $scope.users.results);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function openModal(modal) {
    $scope.modals[modal].show();
  }

  function closeModal(modal) {
    $scope.modals[modal].hide();
  }


}
