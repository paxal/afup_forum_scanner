angular.module('starter.controllers', [ 'ngCordova', 'ionic' ])

.controller('DashCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup) {
        var params = {};

        (function () {
            var cw = $('#scan').width();
            $('#scan').css({'height': cw + 'px', 'line-height': cw + 'px'});
        })();

        var onSuccess = function (imageData) {
            storage.push(imageData['text']);
            $scope.success = true;
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
                return;
            }
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                onSuccess(imageData);
            }, function(error) {
                onFailure(error);
            });
        };
})

.controller('SendCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
});
