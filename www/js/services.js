/*
  CMU SIS Mobile services
  by Paul Harriet S. Asinero
*/

angular.module('cmusis.services',[])
.factory('studentInfoService', function ($ionicLoading, $http, $q) {
  return {
    getInfo: getInfo,
    getPic: getPic
  };
  
  //Gets the student information
  function getInfo(id) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'students/'+id)
      .success(function (data) {
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function (err) {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }

  function getPic(id) {
    var deferred = $q.defer();
    $http.get(localStorage.getItem('api_url')+'picture/'+id)
      .success(function (data) {
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function (err) {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }
})
.factory('semListService', function ($ionicLoading, $http, $q) {
  return {
    getSems: getSems
  };
  //Function that grabs Student Information from the Server
  function getSems(id) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'semesters/'+id)
      .success(function (data) {
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }
})
.factory('gradeService', function ($ionicLoading, $http, $q, $ionicScrollDelegate) {
  return {
    getGrades: getGrades,
    sumUnits: sumUnits,
    getEarnedUnits: getEarnedUnits,
    getGwa: getGwa,
    getInc: getInc,
    countComplied:countComplied,
    countUncomplied:countUncomplied,
    countFailed:countFailed,
    getCountDown:getCountDown
  };
  //Function that does Grades Request to the Server
  function getGrades(id, sem) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'grades/'+id+'/'+sem)
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }
  //Sums the units enrolled
  function sumUnits(grades) {
    var sum = 0;
    for(var i=0; i < grades.length; i++){
      sum += parseInt(grades[i].AcadUnits);
    }
    return sum;
  }

  //Sums the units with passed remarks
  function getEarnedUnits(grades) {
    var sum = 0;
    for(var i=0; i < grades.length; i++){
      if ((grades[i].Final < 4 && grades[i].Final != "" ) || (grades[i].ReExam < 4 && grades[i].ReExam != "" )) {
        sum += parseInt(grades[i].AcadUnits);
      }
    }
    return sum;
  }

  //Sum units for GWA computation
  function getGwaUnits(grades) {
    var sum = 0;
    for(var i=0; i < grades.length; i++){
      if (grades[i].FinalRemarks == "Passed" || grades[i].FinalRemarks == "Failed") {
        sum += parseInt(grades[i].AcadUnits);
      }
    }
    return sum;
  }
  //Computes the General Weighted Average
  function getGwa(grades) {
    var unigrade = 0, gwa = 0;
    for(var i=0; i < grades.length ; i++){
      if ((grades[i].FinalRemarks == "Passed" || grades[i].FinalRemarks == "Failed") && grades[i].Final != "INC") {
        unigrade += grades[i].Final*grades[i].AcadUnits;

      }
      else if ((grades[i].FinalRemarks == "Passed" || grades[i].FinalRemarks == "Failed") && (grades[i].ReExam == "INC" || grades[i].ReExam == 4) && grades[i].ReExam == '') {
        unigrade += grades[i].ReExam*grades[i].AcadUnits;
      }
    }
    return unigrade/getGwaUnits(grades);
  }
  //Function that requests INC Grades from the server
  function getInc(id) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'grades/'+id+'/inc')
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }

  function getCountDown(grades) {
    for (var i = 0; i < grades.length; i++) {
      grades[i].CompDays = ((new Date() - new Date(grades[i].DatePosted)) /24/60/60/1000);
    }
    console.log(grades);
    return grades;
  }
  //Counts number of complied INC grades
  function countComplied(grades) {
    var count = 0;
    for(var i=0; i < grades.length ; i++){
      if(grades[i].Final == 'INC' && grades[i].ReExam != '') {
        count++;
      }
    }
    return count;
  }

  //Counts number of uncomplied INC grades
  function countUncomplied(grades) {
    var count = 0;
    for(var i=0; i < grades.length ; i++){
      if(grades[i].Final == 'INC' && grades[i].ReExam == '') {
        count++;
      }
    }
    return count;
  }

  // counts number of failed grades from INC
  function countFailed(grades) {
    var count = 0;
    for (var i = 0; i < grades.length; i++) {
      if(grades[i].Final == 'INC' && grades[i].ReExam == 5) {
        count++;
      }
    }
    return count;
  }
})
.factory('corService', function ($ionicLoading, $http, $q, $ionicScrollDelegate) {
  return {
    getCorInfo: getCorInfo,
    getCorLoad: getCorLoad,
    getCorCharges: getCorCharges,
    sumCharges: sumCharges,
    sumUnits: sumUnits
  };
  function getCorInfo(id, reg) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'corinfo/'+id+'/'+reg)
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }
  function getCorLoad(id, reg) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'corload/'+id+'/'+reg)
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }

  function getCorCharges(id, sem) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'corcharge/'+id+'/'+sem)
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }

  function sumCharges(charges) {
    var sum = 0;
    for(var i=0;i < charges.length; i++) {
      sum += parseFloat(charges[i].Debit);
    }
    return sum;
  }

  function sumUnits(subload) {
    var sum = 0;
    for(var i=0;i < subload.length; i++) {
      sum += parseInt(subload[i].AcadUnits);
    }
    return sum;
  }
})
.factory('ledgerService', function ($ionicLoading, $http, $q, $ionicScrollDelegate) {
  return {
    getLegderInfo: getLegderInfo,
    getBal: getBal
  };
  function getLegderInfo(id, sem) {
    var deferred = $q.defer();
    $ionicLoading.show();
    $http.get(localStorage.getItem('api_url')+'ledger/'+id+'/'+sem)
      .success(function (data) {
        $ionicScrollDelegate.scrollTop();;
        $ionicLoading.hide();
        deferred.resolve(data);
      })
      .error(function () {
        $ionicLoading.hide();
        deferred.reject();
      });
    return deferred.promise;
  }
  function getBal(ledger) {
    for (var i = 0; i < ledger.length; i++) {
      if(ledger[i].Debit != 0 && ledger[i].Credit != 0 && ledger[i].TransType != 0)
        ledger[i].Debit = 0;
    }

    for (var i = 0; i < ledger.length; i++) {
      if(i == 0)
        ledger[i].Balance = ledger[i].Debit - ledger[i].Credit;
      else {
        ledger[i].Balance = ledger[i-1].Balance + (ledger[i].Debit - ledger[i].Credit);
      }
    }
    return ledger;
  }
})
