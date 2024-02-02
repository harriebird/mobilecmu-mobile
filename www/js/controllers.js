/*
  CMU SIS Mobile controllers
  by Paul Harriet S. Asinero
*/
angular.module('cmusis.controllers',[])
.controller('LoginCtrl', function ($ionicLoading, $scope, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope, $ionicPopup) {
  $scope.loginData = {}
  $scope.loginError = false;
  $scope.loginErrorText;

  $scope.login = function() {
    var credentials = {
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }

    $ionicLoading.show();
    $auth.login(credentials, { url: localStorage.getItem('api_url')+'auth' }).then(function() {
      // Return an $http request for the authenticated user
      $http.get(localStorage.getItem('api_url')+'auth/stud?token='+$auth.getToken()).success(function(response){
        // Stringify the retured data
        var user = JSON.stringify(response.user);

        // Set the stringified user data into local storage
        localStorage.setItem('user', user);

        // Getting current user data from local storage
        $rootScope.currentUser = response.user;

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $ionicLoading.hide();
        $scope.loginData.email = '';
        $scope.loginData.password = '';
        $state.go('side.studinfo');
      })
      .error(function(){
        $ionicLoading.hide();
        $scope.loginError = true;
        $scope.loginErrorText = error.data.error;
      })
    })
    .catch(function (error) {
      $ionicLoading.hide();
      if(error.status == 401) {
        $ionicPopup.show({
          template: '<h4>Incorrect login credentials.<br>Please try again.</h4>',
          title: 'Login Failed',
          buttons: [{
            text: 'OK',
            type: 'button-assertive'
          }]
        })
      }
      else if (error.status == -1) {
        $ionicPopup.show({
          template: '<h4>Can\'t connect to the server.<br>Please check your internet connectivity.</h4>',
          title: 'Connection Error',
          buttons: [{
            text: 'OK',
            type: 'button-assertive'
          }]
        })
      }
    });
  }
  $scope.$on('$ionicView.enter', function(event, viewData) {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
  });
})
.controller('StudInfoCtrl', function ($scope, $rootScope, studentInfoService) {
  $scope.stud = undefined;
  $scope.getInfo = function (id) {
    studentInfoService.getInfo(id).then(function (info) {
      $rootScope.currentUser.FirstName = info.FirstName;
      $rootScope.currentUser.Middlename = info.Middlename;
      $rootScope.currentUser.LastName = info.LastName;
      $scope.stud = info;
    });
    studentInfoService.getPic(id).then(function (picdata) {
      $rootScope.profpic = picdata;
    });
    $scope.$broadcast('scroll.refreshComplete');
  }
  // $scope.getInfo($scope.studno);
  $scope.$on('$ionicView.enter', function(event, viewData) {
    if($scope.stud == undefined) {
      $scope.getInfo($rootScope.currentUser.prisms_id);
    }
  });
})
.controller('GradesCtrl', function ($scope, $rootScope, gradeService, semListService) {
  $scope.semesters = [];
  $scope.grades = [];
  $scope.getSemGrades = function (studno,sem) {
    gradeService.getGrades(studno,sem).then(function (info) {
      $scope.grades = info;
    });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.getUnits = function (grades) {
    return gradeService.sumUnits(grades);
  };

  $scope.getEUnits = function (grades) {
    return gradeService.getEarnedUnits(grades);
  };

  $scope.getEUnits = function (grades) {
    return gradeService.getEarnedUnits(grades);
  };

  $scope.getGwa = function (grades) {
    return gradeService.getGwa(grades);
  };

  $scope.$on('$ionicView.enter', function(event, viewData) {
    if($scope.semesters.length < 1) {
      semListService.getSems($rootScope.currentUser.prisms_id).then(function (info) {
        $scope.semesters = info;
        $scope.semester = $scope.semesters[$scope.semesters.length-1].TermID;
        $scope.getSemGrades($rootScope.currentUser.prisms_id, $scope.semester);
      });
    }
  });

})
.controller('CorCtrl', function ($scope, $rootScope, corService, semListService) {
  $scope.semesters = [];
  $scope.cor_info = [];
  $scope.cor_load = [];
  $scope.cor_charges = [];
  $scope.getCorData = function (studno,sem) {
    corService.getCorInfo(studno,sem.RegID).then(function (info) {
      $scope.cor_info = info;
    });
    corService.getCorLoad(studno,sem.RegID).then(function (info) {
      $scope.cor_load = info;
    });
    corService.getCorCharges(studno,sem.TermID).then(function (info) {
      $scope.cor_charges = info;
    });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.sumCharges = function (charges) {
    return corService.sumCharges(charges);
  }

  $scope.sumUnits = function (subload) {
    return corService.sumUnits(subload);
  }
  $scope.$on('$ionicView.enter', function(event, viewData) {
    if($scope.semesters.length < 1) {
      semListService.getSems($rootScope.currentUser.prisms_id).then(function (info) {
        $scope.semesters = info;
        $scope.semester = $scope.semesters[$scope.semesters.length-1];
        $scope.getCorData($rootScope.currentUser.prisms_id, $scope.semester);
      });
    }
  });
})
.controller('LedgerCtrl', function ($scope, $rootScope, ledgerService, semListService) {
  $scope.semesters = [];
  $scope.ledger_info = [];
  $scope.getLegderInfo = function (studno,sem) {
    ledgerService.getLegderInfo(studno,sem).then(function (info) {
      $scope.ledger_info = ledgerService.getBal(info);
    });
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.$on('$ionicView.enter', function(event, viewData) {
    if($scope.semesters.length < 1) {
      semListService.getSems($rootScope.currentUser.prisms_id).then(function (info) {
        $scope.semesters = info;
        $scope.semester = $scope.semesters[$scope.semesters.length-1].TermID;
        $scope.getLegderInfo($rootScope.currentUser.prisms_id, $scope.semester);
      });
    }
  });

})
.controller('IncompleteCtrl', function ($scope, $rootScope, gradeService, $rootScope) {
  $scope.grades = undefined;
  $scope.getIncGrades = function (studno) {
    gradeService.getInc(studno).then(function (info) {
      $scope.grades = gradeService.getCountDown(info);
    });
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.countComp = function (grades) {
    return gradeService.countComplied(grades);
  }
  $scope.countUncomp = function (grades) {
    return gradeService.countUncomplied(grades);
  }
  $scope.countFailed = function (grades) {
    return gradeService.countFailed(grades);
  }
  $scope.$on('$ionicView.enter', function(event, viewData) {
    if($scope.grades == undefined) {
      $scope.getIncGrades($rootScope.currentUser.prisms_id);
    }
  });

})
.controller('AboutCtrl', function ($scope, $ionicHistory, $ionicNavBarDelegate) {
  $scope.$on('$ionicView.enter', function(event, viewData) {
    $scope.curview = $ionicHistory.currentView();
    console.log($ionicHistory.currentView());
  });
})

.controller('SideCtrl', function ($scope, $ionicPopover, $auth, $http, $state, $rootScope, $ionicHistory, $templateCache) {
  $ionicPopover.fromTemplateUrl('morepop.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event, type) {
    $scope.type = type;
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.goAbout = function () {
    $scope.popover.hide();
    $state.go('side.about');
  }

  $scope.goSettings = function () {
    $scope.popover.hide();
    $state.go('side.settings');
  }

  $scope.logout = function () {
    $scope.popover.hide();
    $http.get(localStorage.getItem('api_url')+'logout?token='+localStorage.getItem('satellizer_token')).success(function(response){
    // $http.get(localStorage.getItem('api_url')+'logout').success(function(response){
      $auth.logout().then(function() {
        localStorage.removeItem('user');
        localStorage.removeItem('satellizer_token');
        $rootScope.currentUser = null;
        $state.go('login');
      })
    })
    .error(function(error){
      if (error.error == 'token_expired' || error.error == 'token_not_provided') {
        localStorage.removeItem('user');
        localStorage.removeItem('satellizer_token');
        $rootScope.currentUser = null;
        $state.go('login');
      }
    });
  }
})
.controller('SettingsCtrl', function ($scope, $ionicPopup, $http, $state) {
  $scope.api = {};
  $scope.api.override = false;
  $scope.api.api_url = localStorage.getItem('api_url');
  $scope.saveconfig = function () {
    if (!$scope.api.api_url.startsWith('http://')) {
      $scope.api.api_url = 'http://'+$scope.api.api_url;
    }
    if (!$scope.api.api_url.endsWith('/')) {
      $scope.api.api_url = $scope.api.api_url+'/';
    }

    $http.get($scope.api.api_url).success(function(response) {
      if(response.message == 'welcome_to_mobilecmu_api') {
        localStorage.setItem('api_url', $scope.api.api_url);
        $scope.api.override = false;
        $state.reload('login');
        $ionicPopup.show({
          template: '<h4>The mobileCMU API URL was successfully updated.</h4>',
          title: 'Success!',
          buttons: [{
            text: 'OK',
            type: 'button-balanced'
          }]
        })
      }
      else {
        $ionicPopup.show({
          template: '<h4>The URL provided is invalid. Please try again.</h4>',
          title: 'Error!',
          buttons: [{
            text: 'OK',
            type: 'button-assertive'
          }]
        })
      }
    })
    .error(function(error){
      $ionicPopup.show({
        template: '<h4>Cannot connect to the URL provided. Please try again.</h4>',
        title: 'Error!',
        buttons: [{
          text: 'OK',
          type: 'button-assertive'
        }]
      })
    });
  }
  $scope.restore = function () {
    $scope.api.api_url = "http://sis.cmu.edu.ph/laraserver/";
    localStorage.setItem('api_url', $scope.api.api_url);
    $ionicPopup.show({
      template: '<h4>The mobileCMU API URL was successfully restored.</h4>',
      title: 'Success!',
      buttons: [{
        text: 'OK',
        type: 'button-calm'
      }]
    })
  }
})
