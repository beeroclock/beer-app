angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController',
      authenticate: false
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'components/signup/signup.html',
      controller: 'SignupController',
      authenticate: false
    })
    .state('main', {
      url: '/main',
      templateUrl: 'components/main/main.html',
      controller: 'MainController',
      authenticate: true
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'components/settings/settings.html',
      controller: 'SettingsController',
      authenticate: true
    })
    .state('event', {
      url: '/event',
      templateUrl: 'components/event/event.html',
      controller: 'EventController',
      authenticate: true
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
