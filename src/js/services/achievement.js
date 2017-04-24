angular
.module('incremental')
.service('achievement',
['$timeout',
'player',
'data',
function($timeout, player, data) {
  self = this;
  self.toast = [];
  self.is_toast_visible = false;

  <%= functions %>

  this.init = function (){
    self.toast = [];
    self.is_toast_visible = false;
  };

  this.deleteToast = function () {
    self.toast.shift();
    if(self.toast.length > 0) {
      self.is_toast_visible = true;
    }
  };

  this.removeToast = function () {
    self.is_toast_visible = false;
    $timeout(this.deleteToast, 1100);
  };

  this.addToast = function (t) {
    self.toast.push(t);
    if(this.toast.length == 1) {
      self.is_toast_visible = true;
    }
  };

  this.numberUnlocks = function () {
    return Object.keys(data.unlocks).length;
  };

  this.numberUnlocked = function () {
    var unlocked = 0;
    for(var key in player.data.unlocks) {
      if(player.data.unlocks[key]) {
        unlocked++;
      }
    }
    return unlocked;
  };

  this.checkAchievements = function () {
    for(var unlock in data.unlocks){
      if(!player.data.unlocks[unlock]){
        item = data.unlocks[unlock];

        if(this[item.condition]){
          this.addToast(item.name);
          player.data.unlocks[unlock] = true;
        }
      }
    }
  };
}]);
