myDemoApp.controller('DArrayExampleCtrl',['$scope', '$data', function($scope, $data) {

    $scope.disableFunctions = $data.disableFunctions;

    $scope.disableFunctions.isDeleteDisabled = function (record, oldRecord, form) {
        // Do not allow records that have previously been "accepted" to be deleted
        return oldRecord.accepted;
    };

}]);