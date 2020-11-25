const GuitarToken = artifacts.require("./GuitarToken.sol");

module.exports = function (deployer) {
  deployer.deploy(GuitarToken, "Fender", "FNR");
};

