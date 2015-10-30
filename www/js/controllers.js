angular.module('starter.controllers', [ 'ngCordova', 'ionic', 'starter.services' ])

.controller('DashCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup, Scans, $rootScope) {
        var params = {};

        (function () {
            var cw = $('#scan').width();
            $('#scan').css({'height': cw + 'px', 'line-height': cw + 'px'});
        })();

        var onSuccess = function (imageData) {
            Scans.add(imageData['text']);
            $scope.success = true;

            $rootScope.$broadcast('ScansUpdate');
        };

        var onFailure = function (error) {
            if (error['cancelled']) {
                $scope.success = null;
            } else {
                $scope.success = false;
            }
        };

        $scope.success = null;

        $scope.scan = function () {
            if (typeof cordova === 'undefined') {
                $scope.success = !$scope.success;
                if ($scope.success) {
                    onSuccess({'text': 'http://afup.org/'});
                } else {
                    onFailure({'cancelled': 1});
                }
                return;
            }
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                onSuccess(imageData);
            }, function(error) {
                onFailure(error);
            });
        };
})

.controller('SendCtrl', function($scope, Scans) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
        var reloadEntries = function () {
            $scope.entries = Scans.getAll();
        };
        reloadEntries();

        $scope.$on('ScansUpdate', reloadEntries);
});
