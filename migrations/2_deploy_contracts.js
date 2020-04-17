const PolarToken = artifacts.require("PolarToken");

const EtherSwap = artifacts.require("EtherSwap");

module.exports = async function(deployer) {
  //deploy PolarToken
  await deployer.deploy(PolarToken);
  const token = await PolarToken.deployed();
  //deploy EthSwap
  await deployer.deploy(EtherSwap, token.address);
  const etherSwap = await EtherSwap.deployed();

  //transfet all tokens to EthSwap (1 million)
  await token.transfer(etherSwap.address, "1000000000000000000000000");
};
