describe("Util service", function() {
  var spec = {};

  commonSpec(spec);

  describe('prettifyNumber', function() {
    it("should return inifinity as a symbol", function() {
      value = spec.util.prettifyNumber(Infinity);
      expect(value).toEqual("&infin;");
    });

    it("should return empty string as a empty", function() {
      value = spec.util.prettifyNumber('');
      expect(value).toEqual('');
    });

    it("should return undefined as undefined", function() {
      value = spec.util.prettifyNumber(undefined);
      expect(value).toBeUndefined();
    });

    it("should leave small numbers unchanged", function() {
      value = spec.util.prettifyNumber(1);
      expect(value).toEqual('1');
    });

    it("should format numbers with group separation commas", function() {
      value = spec.util.prettifyNumber(500000);
      expect(value).toEqual('500,000');
    });

    it("should format numbers in scientific notation", function() {
      value = spec.util.prettifyNumber(1e24);
      expect(value).toEqual('1 &#215; 10<sup>24</sup>');
    });
  });

  describe('misc functions', function() {
    it("should return globally defined HTML code", function() {
      value = spec.util.getHTML('beta-');

      expect(value).toEqual('&#946;<sup>-</sup>');
    });

    it("should return resource defined HTML code", function() {
      value = spec.util.getHTML('2H');

      expect(value).toEqual('<sup>2</sup>H');
    });

    it("should return resources that don't have defined HTML code", function() {
      value = spec.util.getHTML('p');

      expect(value).toEqual('p');
    });
  });

  describe('poisson', function() {
    it("should generate numbers according to a poisson", function() {
      spyOn(Math,'random').and.returnValue(0.1);

      value = spec.util.getPoisson(1);

      expect(value).toEqual(0);
    });

    it("should generate numbers according to a poisson 2", function() {
      spyOn(Math,'random').and.returnValues(1,0.1);

      value = spec.util.getPoisson(1);

      expect(value).toEqual(1);
    });

    it("should generate numbers according to a poisson 3", function() {
      spyOn(Math,'random').and.returnValues(0.8,0.4,0.2,0.1);

      value = spec.util.getPoisson(4);

      expect(value).toEqual(3);
    });
  });

  describe('random draw', function() {
    it("should return a normally distributed random number", function() {
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValues(0);

      value = spec.util.randomDraw(100, Math.log(2)/50);

      expect(value).toEqual(1);
    });

    it("should return a normally distributed random number 2", function() {
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValues(0.5);

      value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(16);
    });

    it("should not return negative value", function() {
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValues(-1000);

      value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(0);
    });

    it("should not return overproduction", function() {
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValues(1000);

      value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(1000);
    });
  });
});
