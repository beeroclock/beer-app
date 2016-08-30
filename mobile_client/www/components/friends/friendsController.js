angular.module('app.FriendsController', [])
  .controller('FriendsController', FriendsController);

function FriendsController($scope, $state, $ionicModal, $rootScope, $ionicPopup, friendsFactory) {
  $scope.friends = {};
  $scope.friends.list = [];
  $scope.friends.pending = [];
  $scope.users = {};
  $scope.modals = {};
  $scope.getUsers = getUsers;
  $scope.openModal = openModal;
  $scope.closeModal = closeModal;
  $scope.friendshipUpdate = friendshipUpdate;
  $scope.removeFriend = removeFriend;
  $scope.searchUser = searchUser;
  $scope.requestFriend = requestFriend;
  $scope.userFound = false;
  $scope.friendshipAccepted = false;
  $scope.noFriendFound = false;
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
      if (friendship.accepted === true) {
        $scope.friends.list.push(friendship);
      } else if (friendship.accepted === null) {
        pending.push(friendship);
      }
    });
    normalizePendingData(pending);
  }

  function setUsers(data) {
    $scope.users.list = data;
  }

  function friendshipUpdate(id, userResponse, index, friendName) {
    friendsFactory.friendshipUpdate(id, userResponse)
      .then(function(result) {
        var temp = _.pullAt($scope.friends.pending, index)[0]

        if (userResponse) {
          temp.accepted = true;
          temp.inviteId = temp.id;
          temp.inviteName = temp.name;
          $scope.friends.list.push(temp)
          var popup = $ionicPopup.alert({
            title: 'Friendship Accepted',
            template: 'You are now friends with ' + friendName
          })
        }
        if (!userResponse) {
          var popup = $ionicPopup.alert({
            title: 'Friendship Rejected',
            template: 'You are not friends with ' + friendName
          })
        }

      })
      .catch(logErr);
  }

  function removeFriend(id, userResponse, index) {
    friendsFactory.friendshipUpdate(id, userResponse)
      .then(function(result) {
        _.pullAt($scope.friends.list, index);
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
      var requestedByMe = false;
      if ($rootScope.username === friendship.inviteName) {
        friend = friendship.inviteeName;
        friendId = friendship.inviteeId;
      } else {
        friend = friendship.inviteName;
        friendId = friendship.inviteId;
      }
      if(friendship.inviteId === $rootScope.userId){
        requestedByMe = true;
      }

      return {
        name: friend,
        id: friendId,
        accepted: friendship.accepted,
        requestedByMe: requestedByMe
      };
    });
  }

  function searchUser (){
    $scope.userFound = false;
    $scope.noFriendFound = false;
    $scope.hideRequestButton = false;
    if ($scope.users.search === $rootScope.username) {
      var popup = $ionicPopup.alert({
        title: 'It\'s-a me, ' + $rootScope.username + '!',
        template: 'Search for someone other than you'
      })
    } else {
      friendsFactory.searchUser($scope.users.search)
      .then(function (result) {
        if (result.data === "") {
          $scope.noFriendFound = true;
        } else {
          $scope.users.list = result.data;
          $scope.userFound = true;
        }
      })
    }
  }

  function requestFriend (friendId) {
    friendsFactory.requestFriend(friendId)
    .then(function(result){
      var popup = $ionicPopup.alert({
        title: 'Friendship Requested'
      })
      searchUser();
    })
  }

}
