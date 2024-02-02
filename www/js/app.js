// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// var localStorage.getItem('api_url') = 'http://localhost/index.php/api/'; //url of the laravel application

angular.module('cmusis', ['ionic','ionic-letter-avatar','satellizer','permission','cmusis.controllers','cmusis.services'])

.run(function($ionicPlatform, $auth, $state, $http, $rootScope, $ionicLoading, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (!localStorage.api_url) {
      localStorage.setItem('api_url', 'http://sis.cmu.edu.ph/laraserver/')
    }

    if(localStorage.satellizer_token && localStorage.user) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner><br>Logging In<br>Automatically'
      });
      $http.defaults.headers.common.Authorization = 'Bearer '+localStorage.getItem('satellizer_token');
      // $http.get(localStorage.getItem('api_url')+'auth/stud?token='+$auth.getToken()).success(function(response){
      $http.get(localStorage.getItem('api_url')+'auth/stud').success(function(response){
        var user = JSON.stringify(response.user);
        localStorage.setItem('user', user);
        $rootScope.currentUser = response.user;
        $rootScope.sems = new Array();
        $ionicLoading.hide();
        $state.go('side.studinfo');
      })
      .error(function(error){
        localStorage.removeItem('user');
        $auth.removeToken();
        $ionicLoading.hide();
        $ionicPopup.show({
          template: '<h4>Automatic Login Failed.<br>Please try again.</h4>',
          title: 'Login Failed',
          buttons: [{
            text: 'OK',
            type: 'button-assertive'
          }]
        })
        $state.go('login');
      })
    }
    $rootScope.toISO = function (strdate) {
      return new Date(strdate).toISOString();
    }
  });
})

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  student: 'student_role',
  public: 'public_role'
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(false);
})
/*
  Routing implementation
*/
.config(function ($stateProvider, $urlRouterProvider) {
  // $authProvider.loginUrl = localStorage.getItem('api_url')+'auth';
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
  })
  .state('side', {
    url: '/side',
    abstract: true,
    templateUrl: 'views/sidemenu.html',
    controller: 'SideCtrl'
  })
  .state('side.studinfo', {
    url: '/studinfo',
    views: {
      'sideMenu': {
        templateUrl: 'views/studinfo.html',
        controller: 'StudInfoCtrl'
      }
    }
  })
  .state('side.grades', {
    url: '/grades',
    views: {
      'sideMenu': {
        templateUrl: 'views/grades.html',
        controller: 'GradesCtrl'
      }
    }
  })
  .state('side.ledger', {
    url: '/ledger',
    views: {
      'sideMenu': {
        templateUrl: 'views/ledger.html',
        controller: 'LedgerCtrl'
      }
    }
  })
  .state('side.cor', {
    url: '/cor',
    views: {
      'sideMenu': {
        templateUrl: 'views/cor.html',
        controller: 'CorCtrl'
      }
    }
  })
  .state('side.cor.info', {
    url: '/info',
    views: {
      'corInfo': {
        templateUrl: 'views/cor/info.html'
      }
    }
  })
  .state('side.cor.load', {
    url: '/load',
    views: {
      'corLoad': {
        templateUrl: 'views/cor/load.html'
      }
    }
  })
  .state('side.cor.charges', {
    url: '/charges',
    views: {
      'corCharges': {
        templateUrl: 'views/cor/charges.html'
      }
    }
  })
  .state('side.inc', {
    url: '/inc',
    views: {
      'sideMenu': {
        templateUrl: 'views/inc.html',
        controller: 'IncompleteCtrl'
      }
    }
  })
  .state('side.about', {
    url: '/about',
    views: {
      'sideMenu': {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }
    }
  })
  .state('side.usage', {
    url: '/usage',
    views: {
      'sideMenu': {
        templateUrl: 'views/about/usage.html'
      }
    }
  })
  .state('side.author', {
    url: '/author',
    views: {
      'sideMenu': {
        templateUrl: 'views/about/author.html'
      }
    }
  })
  .state('side.settings', {
    url: '/settings',
    views: {
      'sideMenu': {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('about', {
    url: '/about',
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })
  .state('usage', {
    url: '/usage',
    templateUrl: 'views/about/usage.html'
  })
  .state('author', {
    url: '/author',
    templateUrl: 'views/about/author.html'
  })
  .state('settings', {
    url: '/settings',
    templateUrl: 'views/settings.html',
    controller: 'SettingsCtrl'
  })
  $urlRouterProvider.otherwise('/login');
})
