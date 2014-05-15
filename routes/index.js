var ROUTE_MODULES = ['user'];

module.exports = function Routes(server) {
  ROUTE_MODULES.forEach(function(moduleName) {
    require('./' + moduleName)(server);
  });
};
