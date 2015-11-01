/**
 * @ngdoc function
 * @name uiGridApp.controller:SortingCtrl
 * @description
 * # SortingCtrl
 * Controller of the sorting of the grids
 */
angular.module('addressFormatter', []).filter('address', function () {
    return function (input) {
        return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
    };
});

angular.module('uiGridApp').controller('DemoCtrl', ['$scope', '$http', '$q', '$interval', 'uiGridGroupingConstants', function ($scope, $http, $q, $interval, uiGridGroupingConstants) {
    $scope.gridOptions = {
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.gridOptions.columnDefs = [
        {name: 'StrategyID', displayName: 'id', enableCellEdit: false, type: 'number'},
        {name: 'Approach', displayName: 'approach'},
        {
            name: 'Requirement',
            displayName: 'requirement id',
            enableCellEdit: false,
            grouping: {groupPriority: 0},
            sort: {priority: 0, direction: 'desc'},
            width: '35%',
            cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
        },
        {name: 'Owner', displayName: 'owner'},
        {name: 'Type', displayName: 'type'},
        {name: 'QualArea', displayName: 'qual area'},
        {name: 'ImpactArea', displayName: 'impact area'},
        //{name: 'ModifiedDate', displayName: 'modified date', type: 'date', cellFilter: 'date:"yyyy-MM-dd"'},

        {
            name: 'Scope',
            displayName: 'Scope(eWeeks)',
            type: 'number',
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            customTreeAggregationFinalizerFn: function (aggregation) {
                aggregation.rendered = aggregation.value;
            }
        }

    ];

    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);

        // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
        $interval(function () {
            if (rowEntity.gender === 'male') {
                promise.reject();
            } else {
                promise.resolve();
            }
        }, 3000, 1);
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $http.get('/data/test_strategies.json')
        .success(function (data) {
            for (i = 0; i < data.length; i++) {
                data[i].ModifiedDate = new Date(data[i].ModifiedDate);
                data[i].Requirement = Math.floor(Math.random() * (10 - 1)) + 1;
                data[i].Scope = Math.floor(Math.random() * (10 - 1)) + 1;
            }
            $scope.gridOptions.data = data;
        });
}]);