module.exports =
function Routes(server) {
  ['user'].forEach(function(moduleName) {
    require('./' + moduleName)(server);
  });
};