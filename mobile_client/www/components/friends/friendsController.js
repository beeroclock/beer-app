angular.module('app.FriendsController', [])
  .controller('FriendsController', FriendsController);

function FriendsController($scope, $ionicModal, friendsFactory) {
  $scope.friends = {};
  $scope.users = {};
  $scope.modals = {};
  $scope.getUsers = getUsers;
  $scope.openModal = openModal;
  $scope.closeModal = closeModal;
  var modalOpts = { scope: $scope, animation: 'slide-in-up' };

  init();

  function init() {
    $ionicModal.fromTemplateUrl('components/friends/friends.searchmodal.html', modalOpts)
      .then(setModal('search'));

    $ionicModal.fromTemplateUrl('components/friends/friends.requestmodal.html', modalOpts)
      .then(setModal('request'));

    friendsFactory.getFriends()
      .then(setList('friends'))
      .catch(logErr);
  }

  function getUsers() {
    friendsFactory.getUsers()
      .then(setList('users'))
      .catch(logErr);
  }

  function openModal(name) {
    $scope.modals[name].show();
  }

  function closeModal(name) {
    $scope.modals[name].hide();
  }

  function setModal(name) {
    return function(modal) {
      $scope.modals[name] = modal;
      $scope.$on('$destroy', function() {
        $scope.modals[name].remove();
      });
    };
  }

  function setList(listType) {
    return function(data) {
      $scope[listType].list = data;
    };
  }

  function logErr(err) {
    console.log(err);
  }
}
