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
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
