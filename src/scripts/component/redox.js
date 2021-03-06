/**
 redox
 Component that handles reduction/oxidation and ions.

 @namespace Components
 */
'use strict';

angular.module('game').component('redox', {
  templateUrl: 'views/redox.html',
  controller: 'ct_redox',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_redox', ['state', 'data', 'visibility', 'util', 'format', 'reaction',
  function (state, data, visibility, util, format, reaction) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;
    ct.reaction = reaction;

    function update(player) {
      for(let slot of player.element_slots){
        if(!slot){
          continue;
        }
        for (let redox of slot.redoxes) {
          if (!redox.resource || !redox.active) {
            continue;
          }

          let reactant = ct.generateName(redox.element, redox.from);
          let power = ct.redoxPower(player);
          let number = Math.min(power, player.resources[reactant].number);
          let react = ct.redoxReaction(redox);

          ct.reaction.react(number, react, player);
        }
      }
    }

    /* Calculates the redox power based on the redox upgrades */
    ct.redoxPower = function(player) {
      let level = player.global_upgrades.redox_bandwidth;
      let upgrade = data.global_upgrades.redox_bandwidth;
      let basePower = upgrade.power;
      let polynomial = upgrade.power_poly;
      return basePower * Math.floor(Math.pow(level, polynomial));
    };

    /* Writes a redox in the form of a reaction so that we can use the reaction
    service to process it */
    ct.redoxReaction = function (redox) {
      let reactant = ct.generateName(redox.element, redox.from);
      let product = ct.generateName(redox.element, redox.to);
      let energy = redoxEnergy(redox.from, redox.to, redox.element);

      let react = {
        'reactant': {},
        'product': {}
      };

      react.reactant[reactant] = 1;
      react.product[product] = 1;
      if (energy > 0) {
        react.reactant.eV = energy;
      } else if (energy < 0) {
        react.product.eV = -energy;
      }

      let electron = redox.from - redox.to;
      if (electron > 0) {
        react.reactant['e-'] = electron;
      } else if (electron < 0) {
        react.product['e-'] = -electron;
      }

      return react;
    };

    /* Calculates how much energy it takes to go from a redox level to another
    for a given element */
    function redoxEnergy(from, to, element) {
      let energyFrom = data.redox[element][from];
      let energyTo = data.redox[element][to];
      let energy = energyTo - energyFrom;

      return energy;
    }

    /* Generates the name of a ion, e.g. O3+ */
    ct.generateName = function (element, i) {
      if (i === 0) {
        return data.elements[element].main;
      }
      let postfix = '';
      if (Math.abs(i) > 1) {
        postfix = Math.abs(i);
      }
      postfix += getSign(i);
      let name = element + postfix;
      // special case!! H+ is just a proton
      if (name === 'H+') {
        name = 'p';
      }
      return name;
    };

    function getSign(number) {
      return number > 0 ? '+' : '-';
    }

    /* Calculates the number of redox slots based on the redox upgrades */
    ct.redoxSlots = function (player) {
      let level = player.global_upgrades.redox_slots;
      let upgrade = data.global_upgrades.redox_slots;
      let basePower = upgrade.power;
      let multiplier = upgrade.power_mult;
      return basePower * Math.floor(multiplier * level);
    };

    ct.redoxSize = function (player) {
      let size = 0;
      for(let slot of player.element_slots){
        if(!slot){
          continue;
        }
        size += slot.redoxes.length;
      }
      return size;
    };

    /* Adds a new redox to the player list */
    ct.addRedox = function (player, slot) {
      if(ct.redoxSize(player) >= ct.redoxSlots(player)){
        return;
      }
      slot.redoxes.push({
        resource: data.elements[slot.element].main,
        active: false,
        element: slot.element,
        from: 0,
        to: 1
      });
    };

    ct.removeRedox = function (slot, index) {
      slot.redoxes.splice(index, 1);
    };

    ct.visibleRedox = function(slot) {
      return slot.redoxes;
    };

    state.registerUpdate('redox', update);
  }
]);
