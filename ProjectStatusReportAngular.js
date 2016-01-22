function fixToJSonDate(date) {
    if (date == null)
        return
    var r = date;

    r = r.replace("/Date(", "");
    r = r.replace(")/", "");
    //alert(parseInt(r))
    try {
        r = new Date(parseInt(r));
    }
    catch (e) { alert(e); }
    return r;
}

var app = angular.module("ProjectStatusReport", ['ui.bootstrap']);

app.controller("AppController", function ($scope, $http, $rootScope) {
    var index = getIndex();
    $http.get(getRoutsWebpage() + "/ProjectMaintenance/GetClientName", { params: { index: index } }).success(function(data){
        $scope.client = data;        
    }).error(function (er) {
        alert(er);
    });

    $http.get(getRoutsWebpage() + "/ProjectMaintenance/GetStatus", { params: { index: index } }).success(function (data) {
        $scope.status = data;
        for (var i = 0; i < $scope.status.length; i++) {
            $scope.status[i].ReportingPeriod = fixToJSonDate($scope.status[i].ReportingPeriod);
        }
        $scope.convertDateToLocal = function (date_) {
            if (date_ == null)
                return ""
            else
                return date_.toLocaleDateString();
        }
        $scope.statusID = 0;
        $scope.statusIDNew = "New";
        var newStatus = {};
        newStatus.ReportingPeriod = new Date();
        newStatus.StatusID = $scope.statusIDNew + $scope.statusID;
        $scope.statusID++;
        $scope.status.push(newStatus);

        $scope.activeRow = null;
        $scope.setActiveRow = function (rowStatusID) {
            for (var i = 0; i < $scope.status.length; i++) {
                $scope.status[i].ngActive = "";
                if ($scope.status[i].StatusID == rowStatusID) {
                    console.log($scope.status[i]);
                    $scope.status[i].ngActive = "info";
                    $scope.activeRow = i;
                }
            }
        }

        $scope.removeRecord = function (rowStatusID) {
            for (var i = 0; i < $scope.status.length; i++) {
                if ($scope.status[i].StatusID == rowStatusID) {
                    if ($scope.status[i].deleteFlag == null) $scope.status[i].deleteFlag = 0;
                    $scope.status[i].deleteFlag = 1 - $scope.status[i].deleteFlag;
                }
            }
        }
        $scope.displayDeleteFlag = function (flag) {
            if (flag == 1)
                return "Yes";
            return "";
        }

        $scope.addNewStatus = function () {
            var ls = $scope.status[$scope.status.length - 1];
            if (ls.StatusID == $scope.status[$scope.activeRow].StatusID)
            if (ls.ScheduleStatus != "Select" && ls.ScheduleDescription != "" && ls.RiskStatus != "Select" && ls.RiskDescription != "" && ls.PricingStatus != "Select" && ls.PricingStatusDescription!="" && 
                ls.OverallProjectStatus != "Select" && ls.OverallProjectStatusDescription != "" && ls.StatusSummary!="") {
                var newStatus = {};
                newStatus.ReportingPeriod = new Date();
                newStatus.StatusID = $scope.statusIDNew + $scope.statusID;
                $scope.statusID++;
                $scope.status.push(newStatus);
            }
        }

        function getRowWithStatusID(id_) {
            for (var i = 0; i < $scope.status.length; i++) {
                if (id_ == $scope.status[i].StatusID)
                    return i;
            }
            return null;
        }

        $scope.colorStatusDesc = function (id_,consern_) {
            var r = $scope.status[getRowWithStatusID(id_)];
            var c;
            var ret;
            switch (consern_) {
                case 0:
                    c = r.ScheduleStatus;
                    break;
                case 1:
                    c = r.RiskStatus;
                    break;
                case 2:
                    c = r.PricingStatus;
                    break;
                default:
                    c = r.OverallProjectStatus;
            }
            switch (c) {
                case "PSR1MAJOR_":
                    ret = "danger";
                    break;
                case "PSR1SOME__":
                    ret = "warning";
                    break;
                default:
                    ret = "success";
            }
            return ret;
        }
        //////////////////////////////////////////////////////////////////////Date Picker
        $scope.today = function () {
            $scope.rules[$scope.activeRule].val[5] = new Date();
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.rules[$scope.activeRule].val[5] = null;

        };

        // Disable weekend selection
        //$scope.disabled = function (date, mode) {
        //    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        //};

        $scope.toggleMin = function () {
            $scope.minDate = null //$scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        //$scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        //$scope.format = $scope.formats[0];
        $scope.format = 'MM/dd/yyyy';

    }).error(function (er) {
        alert(er);
    });
});
