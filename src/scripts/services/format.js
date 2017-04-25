angular
.module('incremental')
.service('format',
['player',
'util',
function(player, util) {  
  /*
   * Formats in HTML a compound i.e. a collection of resources of
   * the form x + y + z
   */
  this.compoundFormat = function (number, compound) {
    var compoundHTML = "";
    var keys = Object.keys(compound);
    for(var i = 0; i < keys.length; i++) {
      if(Number.isInteger(number) && number > 1) {
        compoundHTML += util.prettifyNumber(Number.parseFloat((number * compound[keys[i]]).toFixed(4))) +
                        " ";
      } else if(compound[keys[i]] != 1) {
        compoundHTML += util.prettifyNumber(compound[keys[i]]) + " ";
      }
      compoundHTML += util.getHTML(keys[i]) + " ";
      if(i < keys.length - 1) {
        compoundHTML += "+ ";
      }
    }
    return compoundHTML.trim();
  };

  /*
   * Formats a reaction i.e. a transformation from one compound to
   * another
   */
  this.reactionFormat = function (number, reaction) {
    var reactionHTML = "";
    reactionHTML += this.compoundFormat(number, reaction.reactant);
    reactionHTML += " <span class=\"icon\">&#8594;</span> ";
    reactionHTML += this.compoundFormat(number, reaction.product);
    return reactionHTML;
  };

  this.decayFormat = function (decay) {
    var format = '<span class="icon">&#8594;</span>';
    format += this.compoundFormat(1, decay.decay_product);
    return format;
  };
}]);
