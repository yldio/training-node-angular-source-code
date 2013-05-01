function NewUserCtrl($scope) {
  $scope.user = {}

  $scope.create = function() {
    $scope.submitting = true;
    alert('Saving!');
  };

};