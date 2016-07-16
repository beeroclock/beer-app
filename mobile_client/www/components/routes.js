angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController',
      cache: false,
      authenticate: false
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'components/signup/signup.html',
      controller: 'SignupController',
      cache: false,
      authenticate: false
    })
    .state('main', {
      url: '/main',
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      cache: false,
      authenticate: true
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'components/settings/settings.html',
      controller: 'SettingsController',
      cache: false,
      authenticate: true
    })
    .state('event', {
      url: '/event',
      templateUrl: 'components/event/event.html',
      controller: 'EventController',
      cache: false,
      authenticate: true
    })
    .state('friends', {
      url: '/friends',
      templateUrl: 'components/friends/friends.html',
      controller: 'FriendsController',
      cache: false,
      authenticate: true
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
