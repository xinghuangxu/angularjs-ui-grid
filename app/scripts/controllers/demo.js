'use strict';
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
        {name: 'Boxcar', displayName: 'boxcar id',type: 'number',visible:false,  grouping: {groupPriority: 0}},
        {name: 'StrategyID', displayName: 'id', enableCellEdit: false, type: 'number'},
        {name: 'Approach', displayName: 'approach'},
        {
            name: 'Requirement',
            displayName: 'requirement id',
            enableCellEdit: false,
            grouping: {groupPriority: 1},
            sort: {priority: 0, direction: 'desc'},
            width: '35%',
            cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
        },
        {name: 'Owner', displayName: 'owner',editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%', editDropdownValueLabel: 'Owner',  editDropdownOptionsArray: [
            { id: 'leonx', Owner: 'leonx' },
            { id: 'dstein', Owner: 'dstein' }
        ] },
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
        },
        {
            name: "link",
            cellTemplate: '<a href="#" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-link"></span></a>',
            cellClass: 'grid-align-center'
        }

    ];

    $scope.groupByOwner = function() {
        $scope.gridApi.grouping.clearGrouping();
        $scope.gridApi.grouping.groupColumn('Boxcar');
        $scope.gridApi.grouping.groupColumn('Owner');
        $scope.gridApi.grouping.aggregateColumn('Scope', uiGridGroupingConstants.aggregation.SUM);
    };

    $scope.groupByQualArea = function() {
        $scope.gridApi.grouping.clearGrouping();
        $scope.gridApi.grouping.groupColumn('Boxcar');
        $scope.gridApi.grouping.groupColumn('QualArea');
        $scope.gridApi.grouping.aggregateColumn('Scope', uiGridGroupingConstants.aggregation.SUM);
    };
    $scope.groupRequirement = function() {
        $scope.gridApi.grouping.clearGrouping();
        $scope.gridApi.grouping.groupColumn('Boxcar');
        $scope.gridApi.grouping.groupColumn('Requirement');
        $scope.gridApi.grouping.aggregateColumn('Scope', uiGridGroupingConstants.aggregation.SUM);
    };

    $scope.toggleRow = function( rowNum ){
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };

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
            for (var i = 0; i < data.length; i++) {
                data[i].ModifiedDate = new Date(data[i].ModifiedDate);
                data[i].Requirement = Math.floor(Math.random() * (10 - 1)) + 1;
                if(!data[i].Owner){
                    data[i].Owner = "None";
                }
                data[i].Scope = Math.floor(Math.random() * (10 - 1)) + 1;
            }
            $scope.gridOptions.data = data;
        });
}]);
    //.filter('mapOwner', function() {
    //    var genderHash = {
    //        1: 'leonx',
    //        2: 'dstein'
    //    };
    //
    //    return function(input) {
    //        if (!input){
    //            return '';
    //        } else {
    //            return genderHash[input];
    //        }
    //    };
    //});
