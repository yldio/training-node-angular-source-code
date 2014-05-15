function Cart() {
}
Cart.prototype = {
}

var cart = new Cart;


app.factory("Cart",function() {
  function Cart() {
  }
  Cart.prototype = {
  }
  return Cart;
});

app.controller("CartCtrl",function(cartStore,$scope) {

  $scope.cart = cartStore.get(cartId);


});
