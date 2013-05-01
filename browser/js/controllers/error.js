function ErrorCtrl($scope, $rootScope) {

  $scope.dismiss = function() {
    delete $scope.error;
  };

  $rootScope.$on('error', function(event, err) {
    console.log('got error from th root scope', err);
    $scope.error = err.data && err.data.error && err.data.error.message || 'Error';
  });
}