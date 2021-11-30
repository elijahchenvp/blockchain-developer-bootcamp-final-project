//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var CarSharing = artifacts.require("./CarSharing.sol");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  deployer.deploy(CarSharing);
};
