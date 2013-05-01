module.exports =
function Routes(server) {
  ['user', 'session'].forEach(function(moduleName) {
    require('./' + moduleName)(server);
  });
};