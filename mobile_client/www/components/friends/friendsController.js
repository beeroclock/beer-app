angular.module('app.FriendsController', [])
  .controller('FriendsController', FriendsController);

function FriendsController($scope, $ionicModal, $rootScope, friendsFactory) {
  $scope.friends = {};
  $scope.friends.list = [];
  $scope.friends.pending = [];
  $scope.users = {};
  $scope.modals = {};
  $scope.getUsers = getUsers;
  $scope.openModal = openModal;
  $scope.closeModal = closeModal;
  $scope.acceptFriend = acceptFriend;
  $scope.rejectFriend = rejectFriend;
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
    var pending = [];

    _.forEach(userFriendships, function(friendship) {
      // console.log('friendship:', friendship);
      if (friendship.accepted === true) {
        $scope.friends.list.push(friendship);
      } else if (friendship.accepted === null) {
        pending.push(friendship);
      }
    });
    normalizePendingData(pending);
    console.log('$scope.friends.pending', $scope.friends.pending);
  }



  function setUsers(data) {
    $scope.users.list = data;
  }

  // IMPLEMENT THESE LATER
  function acceptFriend(id) {
    friendsFactory.friendshipUpdate(id, true)
      .then(function(result) {
        console.log(result);
      })
      .catch(logErr);
  }

  function rejectFriend(id) {
    friendsFactory.friendshipUpdate(id, false)
      .then(function(result) {
        console.log(result);
      })
      .catch(logErr);
  }

  function logErr(err) {
    console.log(err);
  }

  function normalizePendingData(data) {
    var friend;
    var friendId;

    $scope.friends.pending = _.map(data, function(friendship) {
      if ($rootScope.username === friendship.inviteName) {
        friend = friendship.inviteeName;
        friendId = friendship.inviteeId;
      } else {
        friend = friendship.inviteName;
        friendId = friendship.inviteId;
      }

      return {
        name: friend,
        id: friendId,
        accepted: friendship.accepted
      };
    });
  }
}
