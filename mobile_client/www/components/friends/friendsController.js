angular.module('app.FriendsController', [])
  .controller('FriendsController', FriendsController);

function FriendsController($scope, $ionicModal, friendsFactory) {
  $scope.friends = {};
  $scope.friends.list = [];
  $scope.friends.pending = [];
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
      .then(setFriendsAndPending)
      .catch(logErr);
  }

  function getUsers() {
    friendsFactory.getUsers()
      .then(setUsers)
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

  function setFriendsAndPending(userFriendships) {
    _.forEach(userFriendships, function(friendship) {
      console.log('friendship:', friendship);
      if (friendship.accepted === true) {
        $scope.friends.list.push(friendship);
      } else if (friendship.accepted === null) {
        $scope.friends.pending.push(friendship);
      }
      console.log($scope.friends.list);
      console.log($scope.friends.pending);
    });
  }

  function setUsers(data) {
    $scope.users.list = data;
  }

  function logErr(err) {
    console.log(err);
  }
}
