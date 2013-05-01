function NewUserCtrl($scope, UserRes, $location) {
  $scope.user = new UserRes;

  $scope.create = function() {
    $scope.submitting = true;

    function success() {
      console.log('success!');
      $location.url('/user/welcome');
    }

    function error(err) {
      $scope.$emit('error', err);
      $scope.submitting = false;
    }

    var a = $scope.user.$save(success, error);
  };

};