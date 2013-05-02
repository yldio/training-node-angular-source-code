window.NewSessionCtrl =
function NewSessionCtrl($scope, SessionRes, $location, $cookies) {
  $scope.session = new SessionRes;

  $scope.create = function() {
    $scope.submitting = true;

    function success(res) {
      console.log('setting session id to', res.sessionId);
      $.jStorage.set('session', res.sessionId);
      $location.url($location.search().from || '/lists');
    }

    function error(err) {
      $scope.$emit('error', err);
      $scope.submitting = false;
    }

    var a = $scope.session.$save(success, error);
  };

};