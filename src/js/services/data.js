angular.module('incremental').service(
'data',
['$http',
'$q',
function($http, $q) {
  var self = this;
  this.version = '1.0.4';

  this.table_resources = [ "e-", "n", "p" ];

  this.files = ["elements",
              "generators",
              "upgrades",
              "encyclopedia",
              "periodic_table",
              "resources",
              "achievements",
              "radioisotopes",
              "html",
              "syntheses",
              "binding_energy",
              "redox",
              "start_player"];

  this.loadData = function() {
    var promises = this.files.map(function(file){
      return $http.get('data/'+file+'.json').then(function(response) {
        self[file] = response.data;
      });
    });

    return $q.all(promises);
  };
}]);
