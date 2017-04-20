describe("Reaction service", function() {
  var spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it("should check if the cost of a reaction is met", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:0};
      spec.player.data.resources.eV = {number:15};

      value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it("should check if the cost of a reaction is met 2", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:5};
      spec.player.data.resources.eV = {number:5};

      value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it("should check if the cost of a reaction is met 3", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:50};

      value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it("should check if the cost of a reaction is met 4", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:5};
      spec.player.data.resources.eV = {number:50};

      value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(true);
    });

    it("should check if the cost of a reaction is met 5", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:500};

      value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+']);

      expect(value).toEqual(true);
    });
  });

  describe('react', function() {
    it("should react the number specified", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};

      spec.reaction.react(10,spec.data.redox['1H+'], spec.player.data);

      expect(spec.player.data.resources['1H'].number).toEqual(40);
      expect(spec.player.data.resources.eV.number).toEqual(64.016);
      expect(spec.player.data.resources.p.number).toEqual(11);
      expect(spec.player.data.resources['e-'].number).toEqual(10);
    });

    it("should return if the number specified is invalid", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};

      spec.reaction.react(0.5,spec.data.redox['1H+'], spec.player.data);

      expect(spec.player.data.resources['1H'].number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(200);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
    });

    it("should return if the number specified is negative", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};

      spec.reaction.react(-10,spec.data.redox['1H+'], spec.player.data);

      expect(spec.player.data.resources['1H'].number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(200);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
    });

    it("should return if the cost is not met", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['1H'] = {number:50};
      spec.player.data.resources.eV = {number:10};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};

      spec.reaction.react(5,spec.data.redox['1H+'], spec.player.data);

      expect(spec.player.data.resources['1H'].number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(10);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
    });
  });
});
