angular.module('starter.controllers', [ 'ngCordova', 'ionic', 'starter.services' ])

.controller('DashCtrl', function($scope, $cordovaBarcodeScanner, $ionicPopup, Scans, $rootScope, AfupConfig) {
        console.debug(AfupConfig);
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

.controller('SendCtrl', function($scope, Scans, AfupConfig) {
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

        $scope.post_url = AfupConfig.get(AfupConfig.API);
        $scope.post_token = AfupConfig.get(AfupConfig.TOKEN);
        $scope.md5_salt = AfupConfig.get(AfupConfig.MD5_SALT);

        $scope.post_url_change = function () {
            AfupConfig.set(AfupConfig.API, this.post_url);
        };
        $scope.post_token_change = function () {
            AfupConfig.set(AfupConfig.TOKEN, this.post_token);
        };
        $scope.md5_salt_change = function () {
            AfupConfig.set(AfupConfig.MD5_SALT, this.md5_salt);
        };

        var success = function (data) {
            console.debug(JSON.stringify(data));
        };

        $scope.sendAll = function () {
            AfupConfig.send(Scans.getAll(), success);
        };
        $scope.sendCurrent = function () {
            AfupConfig.send(Scans.getCurrent(), success);
        };
});
