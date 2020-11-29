const GuitarBrand = artifacts.require("./GuitarBrand.sol");
//const GuitarMarketplace = artifacts.require("./GuitarMarketplace.sol");




module.exports = function (deployer) {
  //deployer.deploy(GuitarMarketplace);
  deployer.deploy(GuitarBrand, "Fender", "FNR");
};

