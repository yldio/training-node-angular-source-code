function NewSessionCtrl($scope, SessionRes, $location, $cookies) {
  $scope.session = new SessionRes;

  $scope.create = function() {
    $scope.submitting = true;

    function success(res) {
      $cookies.sessionId = res.sessionId;
      $location.url('/todos');
    }

    function error(err) {
      $scope.$emit('error', err);
      $scope.submitting = false;
    }

    var a = $scope.session.$save(success, error);
  };

};